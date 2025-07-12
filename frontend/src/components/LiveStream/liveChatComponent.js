import React from "react";
class LiveChatComponent extends React.Component {

    state = {
        messagesList: [],
        currentMessages: '',
    }
    socket = null;
    componentDidMount() {
        this.connectWebSocket();
    }
    connectWebSocket = () => {
        const IDs = this.props.params.ID;

        this.socket = new WebSocket(`ws://localhost:9999/backend/api/live/chat?ID=${ID}`);

        this.socket.onopen = () => {
            console.log(" WebSocket connected to ID:", ID);
        };

        this.socket.onmessage = (event) => {
            const message = event.data;
            this.setState((prevState) => ({
                messages: [...prevState.messages, message]
            }));
        };

        this.socket.onclose = () => {
            console.log(" WebSocket disconnected");
        };

        this.socket.onerror = (err) => {
            console.error(" WebSocket error:", err);
        };
    }
    componentWillUnmount() {
        if (this.socket) {
            this.socket.close();
        }
    }

    handleSendMessage = () => {
        if (this.socket && this.state.currentMessage.trim() !== '') {
            this.socket.send(this.state.currentMessage);
            this.setState({ currentMessage: '' });
        }
    }
    render() {
        return (
            <div>
                chat
            </div>
        )
    }
}
export default LiveChatComponent;