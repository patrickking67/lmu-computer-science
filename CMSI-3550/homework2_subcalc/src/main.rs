use std::net::Ipv4Addr;

fn main() {
    // Input
    let target_ip = "157.242.0.0";
    let cidr_notation = 16;

    // Target IP
    let ip = target_ip.parse::<Ipv4Addr>().expect("Invalid IP address format");

    // Calculate Subnet
    let subnet_mask = ipv4_cidr_to_subnet_mask(cidr_notation);
    let network_address = calculate_network_address(ip, subnet_mask);
    let broadcast_address = calculate_broadcast_address(network_address, subnet_mask);
    let first_usable_ip = Ipv4Addr::from(u32::from(network_address) + 1);
    let last_usable_ip = Ipv4Addr::from(u32::from(broadcast_address) - 1);
    let total_hosts = 2u32.pow(32 - u32::from(cidr_notation)) - 2;
    let subnet_size = 2u32.pow(32 - u32::from(cidr_notation));


    // Output
    println!("Subnet Mask: {}", subnet_mask);
    println!("Network Address: {}", network_address);
    println!("Broadcast Address: {}", broadcast_address);
    println!("First Usable IP: {}", first_usable_ip);
    println!("Last Usable IP: {}", last_usable_ip);
    println!("Total Usable Hosts: {}", total_hosts);
    println!("Subnet Size: {}", subnet_size);
}

fn ipv4_cidr_to_subnet_mask(cidr: u8) -> Ipv4Addr {
    let mask = !(u32::MAX >> cidr);
    Ipv4Addr::from(mask)
}

fn calculate_network_address(ip: Ipv4Addr, subnet_mask: Ipv4Addr) -> Ipv4Addr {
    let ip_u32 = u32::from(ip);
    let mask_u32 = u32::from(subnet_mask);
    Ipv4Addr::from(ip_u32 & mask_u32)
}

fn calculate_broadcast_address(network_address: Ipv4Addr, subnet_mask: Ipv4Addr) -> Ipv4Addr {
    let network_u32 = u32::from(network_address);
    let mask_u32 = u32::from(subnet_mask);
    Ipv4Addr::from(network_u32 | !mask_u32)
}

