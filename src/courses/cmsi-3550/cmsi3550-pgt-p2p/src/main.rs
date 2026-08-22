use libp2p::{
    core::upgrade,
    floodsub::{Floodsub, FloodsubEvent, Topic},
    futures::StreamExt,
    identity,
    mdns::{Mdns, MdnsEvent},
    mplex,
    noise::{Keypair, NoiseConfig, X25519Spec},
    swarm::{NetworkBehaviourEventProcess, Swarm, SwarmBuilder},
    tcp::TokioTcpConfig,
    NetworkBehaviour, PeerId, Transport,
};
use log::{error, info};
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use tokio::{fs, io::AsyncBufReadExt, sync::mpsc};

const STORAGE_FILE_PATH: &str = "./cards.json";

type Result<T> = std::result::Result<T, Box<dyn std::error::Error + Send + Sync + 'static>>;
type Cards = Vec<Card>;


static KEYS: Lazy<identity::Keypair> = Lazy::new(|| identity::Keypair::generate_ed25519());
static PEER_ID: Lazy<PeerId> = Lazy::new(|| PeerId::from(KEYS.public()));
static TOPIC: Lazy<Topic> = Lazy::new(|| Topic::new("cards"));

#[derive(Debug, Serialize, Deserialize)]
struct Card {
    id: usize,
    name: String,
    team: String,
    statistics: String,
    public: bool,
}

#[derive(Debug, Serialize, Deserialize)]
enum CardMode {
    ALL,
    One(String),
}

#[derive(Debug, Serialize, Deserialize)]
struct CardRequest {
    mode: CardMode,
}

#[derive(Debug, Serialize, Deserialize)]
struct CardResponse {
    mode: CardMode,
    data: Cards,
    receiver: String,
}

enum EventType {
    Response(CardRequest),
    Input(String),
}

#[tokio::main]
async fn main() {
    pretty_env_logger::init();

    info!("Peer Id: {}", PEER_ID.clone());
    let (response_sender, mut response_rcv) = mpsc::unbounded_channel();

    let auth_keys = Keypair::<X25519Spec>::new()
        .into_authentic(&KEYS)
        .expect("can create auth keys");

    let transp = TokioTcpConfig::new()
    .upgrade(upgrade::Version::V1)
    .authenticate(NoiseConfig::xx(auth_keys).into_authenticated())
    .multiplex(mplex::MplexConfig::new())
    .boxed();

    let mut behaviour = RecipeBehaviour {
        floodsub: Floodsub::new(PEER_ID.clone()),
        mdns: TokioMdns::new().expect("can create mdns"),
        response_sender,
    };

    behaviour.floodsub.subscribe(TOPIC.clone());

    let mut swarm = SwarmBuilder::new(transp, behaviour, PEER_ID.clone())
    .executor(Box::new(|fut| {
        tokio::spawn(fut);
    }))
    .build();

let mut stdin = tokio::io::BufReader::new(tokio::io::stdin()).lines();

Swarm::listen_on(
    &mut swarm,
    "/ip4/0.0.0.0/tcp/0"
        .parse()
        .expect("can get a local socket"),
)
.expect("swarm can be started");
loop {
    let evt = {
        tokio::select! {
            line = stdin.next_line() => Some(EventType::Input(line.expect("can get line").expect("can read line from stdin"))),
            event = swarm.next() => {
                info!("Unhandled Swarm Event: {:?}", event);
                None
            },
            response = response_rcv.recv() => Some(EventType::Response(response.expect("response exists"))),
        }
    };
    ...
}
}

if let Some(event) = evt {
    match event {
        EventType::Response(resp) => {
           ...
        }
        EventType::Input(line) => match line.as_str() {
            "ls p" => handle_list_peers(&mut swarm).await,
            cmd if cmd.starts_with("ls r") => handle_list_cards(cmd, &mut swarm).await,
            cmd if cmd.starts_with("create r") => handle_create_card(cmd).await,
            cmd if cmd.starts_with("publish r") => handle_publish_card(cmd).await,
            _ => error!("unknown command"),
        },
    }
}

async fn handle_list_peers(swarm: &mut Swarm<RecipeBehaviour>) {
    info!("Discovered Peers:");
    let nodes = swarm.mdns.discovered_nodes();
    let mut unique_peers = HashSet::new();
    for peer in nodes {
        unique_peers.insert(peer);
    }
    unique_peers.iter().for_each(|p| info!("{}", p));
}

async fn handle_create_card(cmd: &str) {
    if let Some(rest) = cmd.strip_prefix("create r") {
        let elements: Vec<&str> = rest.split("|").collect();
        if elements.len() < 3 {
            info!("too few arguments - Format: name|team|statistics");
        } else {
            let name = elements.get(0).expect("name is there");
            let team = elements.get(1).expect("ingredients is there");
            let statistics = elements.get(2).expect("instructions is there");
            if let Err(e) = create_new_card(name, team, statistics).await {
                error!("error creating card: {}", e);
            };
        }
    }
}

async fn handle_publish_card(cmd: &str) {
    if let Some(rest) = cmd.strip_prefix("publish r") {
        match rest.trim().parse::<usize>() {
            Ok(id) => {
                if let Err(e) = publish_card(id).await {
                    info!("error publishing card with id {}, {}", id, e)
                } else {
                    info!("Published Card with id: {}", id);
                }
            }
            Err(e) => error!("invalid id: {}, {}", rest.trim(), e),
        };
    }
}

async fn create_new_card(name: &str, team: &str, statistics: &str) -> Result<()> {
    let mut local_cards = read_local_cards().await?;
    let new_id = match local_cards.iter().max_by_key(|r| r.id) {
        Some(v) => v.id + 1,
        None => 0,
    };
    local_cards.push(Card {
        id: new_id,
        name: name.to_owned(),
        team: team.to_owned(),
        statistics: statistics.to_owned(),
        public: false,
    });
    write_local_cards(&local_cards).await?;

    info!("Created card:");
    info!("Name: {}", name);
    info!("Team: {}", team);
    info!("Statstics:: {}", statistics);

    Ok(())
}

async fn publish_cards(id: usize) -> Result<()> {
    let mut local_cards = read_local_cards().await?;
    local_cards
        .iter_mut()
        .filter(|r| r.id == id)
        .for_each(|r| r.public = true);
    write_local_cards(&local_cards).await?;
    Ok(())
}

async fn read_local_cards() -> Result<Cards> {
    let content = fs::read(STORAGE_FILE_PATH).await?;
    let result = serde_json::from_slice(&content)?;
    Ok(result)
}

async fn write_local_cards(cards: &Cards) -> Result<()> {
    let json = serde_json::to_string(&recipes)?;
    fs::write(STORAGE_FILE_PATH, &json).await?;
    Ok(())
}