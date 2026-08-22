fn main() {
    let input = "ABCD:EFGH:IJKL:MNOP:QRST:UVWX:YZ12:3456";
    let groups: Vec<&str> = input.split(':').collect();

    if groups.len() != 8 {
        eprintln!("Invalid input. The input does not consist of 8 groups.");
        return;
    }

    for (i, group) in groups.iter().enumerate() {
        if group.len() != 4 {
            eprintln!("Invalid group at position {}: '{}'. Each group must consist of 4 characters.", i + 1, group);
            return;
        }
    }

    // If Pass Print Groups
    for group in groups {
        println!("{}", group);
    }
}
