import {useState, useEffect, useRef} from 'react';

const MessagesPage = () => {
    const ws = useRef(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
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

        return () => {
            ws.current.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'message', content: 'Hello, WebSocket!' }));
        } else {
            console.error('WebSocket is not connected');
        }
    };

    return (
        <div>
            <h1>Messages</h1>
            <button onClick={() => sendMessage()}>
                Send Message
            </button>

            <h2>Received Messages</h2>
            <p>
                {messages.map((message, index) => (
                    <div key={index}>
                        <p>{message}</p>
                    </div>
                ))}
            </p>

        </div>
    )
}

export default MessagesPage;
