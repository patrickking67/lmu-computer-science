// Node.js
class Node {
    constructor(id) {
      this.id = id;
      this.messages = [];
    }
  
    handleMessage(message) {
      // Process incoming message
      this.messages.push(message);
      console.log(`Node ${this.id} received message: ${message}`);
    }
  }
  
  // Create nodes
  const node1 = new Node(1);
  const node2 = new Node(2);
  
  // Simulate message passing between nodes
  node1.handleMessage("Hello from Node 2");
  node2.handleMessage("Hi from Node 1");
  