# CMSI 3550 - Peer-to-Peer Trading Card Network

## Usage

To run the peer-to-peer trading card network program, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Ensure you have Rust and Cargo installed.
4. Run `cargo build` to compile the project.
5. Once the compilation is complete, run `cargo run` to start the program.
6. Follow the prompts to interact with the trading card network.

## Proposal

### Project Overview

Our project aims to create a peer-to-peer trading card network where users can exchange digital trading cards in a decentralized manner. The network allows users to discover and communicate with each other, facilitating trades and interactions without the need for a centralized server.

### Team Members

- Patrick King
- Gage Messner
- Thomas Powell

### Features

1. **Trading Card Management**: Users can create, view, and trade digital trading cards within the network.
2. **Peer Discovery**: The network enables automatic discovery of other peers/nodes, allowing seamless communication and trading.
3. **Decentralized Architecture**: Eliminates the need for a central server, enhancing privacy and reducing dependency on a single point of failure.
4. **Security**: Utilizes encryption and authentication mechanisms to ensure secure communication between peers.

### Implementation Details

- **Rust Language**: We will implement the project using Rust programming language due to its performance, safety, and support for asynchronous programming.
- **Libp2p Framework**: Leveraging the libp2p framework for building peer-to-peer network applications, providing essential networking components and protocols out of the box.
- **Trading Card Representation**: Trading cards will be represented as JSON objects, containing attributes such as card ID, name, team, statistics, and visibility status.
- **Command-Line Interface (CLI)**: Initially, we will implement a command-line interface for interacting with the trading card network. However, we may explore implementing a web-based user interface in the future.

### Next Steps

1. **Implementation**: Develop the core functionality of the trading card network, including peer discovery, card management, and communication protocols.
2. **Testing**: Conduct thorough testing to ensure the reliability, security, and performance of the system.
3. **Documentation**: Provide comprehensive documentation for users and developers, including installation instructions, usage guidelines, and API references.
4. **Deployment**: Deploy the trading card network on various platforms for real-world testing and evaluation.
