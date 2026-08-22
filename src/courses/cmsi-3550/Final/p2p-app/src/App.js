import React, { useState } from 'react';
import './App.css';

function App() {
    const [peers, setPeers] = useState([]);
    const [cards, setCards] = useState([]);
    const [newCard, setNewCard] = useState({
        name: '',
        team: '',
        statistics: ''
    });

    const handleInputChange = (e) => {
        setNewCard({
            ...newCard,
            [e.target.name]: e.target.value
        });
    };

    const handleCardAddition = (e) => {
        e.preventDefault();
        if (newCard.name && newCard.team && newCard.statistics) {
            setCards([...cards, {...newCard, id: cards.length + 1}]);
            setNewCard({ name: '', team: '', statistics: '' });
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Peer-to-Peer Trading Card Network</h1>
            </header>
            <div className="App-body">
                <h2>Peers</h2>
                {peers.length > 0 ? (
                    <ul>
                        {peers.map(peer => (
                            <li key={peer} className="card">{peer}</li>
                        ))}
                    </ul>
                ) : <p>No peers connected yet.</p>}
                <h2>Cards</h2>
                {cards.length > 0 ? (
                    <ul>
                        {cards.map(card => (
                            <li key={card.id} className="card">{`${card.name} - ${card.team} - ${card.statistics}`}</li>
                        ))}
                    </ul>
                ) : <p>No cards available.</p>}
                <div>
                    <form onSubmit={handleCardAddition}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Card Name"
                            value={newCard.name}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                        <input
                            type="text"
                            name="team"
                            placeholder="Team"
                            value={newCard.team}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                        <input
                            type="text"
                            name="statistics"
                            placeholder="Statistics"
                            value={newCard.statistics}
                            onChange={handleInputChange}
                            className="form-input"
                        />
                        <button type="submit" className="form-button">Add Card</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default App;
