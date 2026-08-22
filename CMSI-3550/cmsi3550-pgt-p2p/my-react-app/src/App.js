import React, { useState } from 'react';
import './App.css';


function App() {
    // State for message input fields
    const [toNode, setToNode] = useState('');
    const [message, setMessage] = useState('');
  
    // Function to handle form submission
    const handleSubmit = (event) => {
      event.preventDefault();
      // Send message to backend
      console.log(`Sending message to Node ${toNode}: ${message}`);
      // Reset input fields
      setToNode('');
      setMessage('');
    };
  return (
<div className="App">
      <header className="App-header">
        <h1>P2P Network</h1>
      </header>
      <main>
        {/* Display network status */}
        <h2>Network Status</h2>
        <p>Connected Nodes: 2</p>
        {/* Send message form */}
        <h2>Send Message</h2>
        <form>
          <label>
            To Node:
            <input type="text" name="toNode" />
          </label>
          <label>
            Message:
            <input type="text" name="message" />
          </label>
          <button type="submit">Send</button>
        </form>
        {/* Display messages */}
        <h2>Received Messages</h2>
        <ul>
          <li>Message 1</li>
          <li>Message 2</li>
        </ul>
      </main>
    </div>
  );
}

export default App;
