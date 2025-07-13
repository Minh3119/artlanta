import React from "react";
import { GrStreetView } from "react-icons/gr";
class LiveChatComponent extends React.Component {

    state = {
        messagesList: [],
        currentMessage: '',
    }
    socket = null;
    componentDidMount() {
        this.connectWebSocket();
    }
    componentDidUpdate() {
        this.props.handleUpdateView();
    }
    connectWebSocket = () => {
        const ID = this.props.ID;

        this.socket = new WebSocket(`ws://localhost:9999/backend/api/live/chat?ID=${ID}`);

        this.socket.onopen = () => {
            console.log(" WebSocket connected to ID:", ID);
        };

        this.socket.onmessage = (event) => {
            const message = event.data;
            this.setState((prevState) => ({
                messagesList: [...prevState.messagesList, message]
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
            <div className="live-chat">
                <div className="live-chat-header">
                    <span>Live Chat</span>
                    <span className="live-view"><GrStreetView />{this.props.View}</span>
                </div>
                <div className="live-chat-body">
                    {
                        this.state.messagesList.map((message, index) => {
                            return (
                                <div className="chat-item" key={index}>
                                    <img alt="1" />
                                    <div className="user">
                                        <span className="user-name">user</span>
                                        <span className="user-text">{message}</span>
                                    </div>
                                </div>
                            )
                        }
                        )
                    }

                </div>
                <div className="live-chat-input">
                    {/* <MdInsertEmoticon className="icon-select" /> */}
                    <input type="text" value={this.state.currentMessage}
                        onChange={(e) => this.setState({ currentMessage: e.target.value })} placeholder="Type your message here"
                    />
                    <button onClick={() => this.handleSendMessage()}>send</button>
                </div>

            </div>
        )
    }
}
export default LiveChatComponent;