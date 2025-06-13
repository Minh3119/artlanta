import {useState, useEffect, useRef} from 'react';

const MessagesPage = () => {
    const ws = useRef(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        {/* WebSocket connection */}
        ws.current = new WebSocket('ws://localhost:9999/backend/ws/message');

        ws.current.onopen = () => {
            console.log('WebSocket connection opened');
        };

        ws.current.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        {/* Fetch users */}

        return () => {
            ws.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'message', content: input }));
        } else {
            console.error('WebSocket is not connected');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
        {/* Users Column */}
        <div style={{ width: '25%', borderRight: '1px solid #ccc', padding: '1rem' }}>
            <h3>Users</h3>
            {users.map(user => (
            <div
                key={user}
                onClick={() => setSelectedUser(user)}
                style={{
                padding: '0.5rem',
                cursor: 'pointer',
                background: user === selectedUser ? '#eef' : 'transparent',
                }}
            >
                {user}
            </div>
            ))}
        </div>

        {/* Messages Column */}
        <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
            <h3>{selectedUser ? `Chat with ${selectedUser}` : 'Select a user'}</h3>
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
            {selectedUser &&
                (messages[selectedUser] || []).map((msg, idx) => (
                <div key={idx} style={{ textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                    <p style={{ background: '#f1f1f1', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '10px' }}>
                    {msg.text}
                    </p>
                </div>
                ))}
            </div>
            {selectedUser && (
            <div style={{ display: 'flex' }}>
                <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{ flex: 1, padding: '0.5rem' }}
                placeholder="Type your message..."
                />
                <button onClick={sendMessage} style={{ padding: '0.5rem 1rem' }}>Send</button>
            </div>
            )}
        </div>
        </div>
    )
}

export default MessagesPage;
