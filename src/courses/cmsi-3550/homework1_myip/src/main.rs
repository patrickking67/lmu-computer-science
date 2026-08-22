use local_ip_address::local_ip;

fn main() {
    match local_ip() {
        Ok(ip) => println!("Your local IP address is {}", ip),
        Err(e) => eprintln!("Couldn't get local IP: {}", e),
    }
}