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
    // componentDidUpdate() {
    //     this.props.handleUpdateView();
    // }

    // startTimer = (durationInSeconds) => {
    //     if (this.socket) {
    //         this.socket.send("Timer:" + durationInSeconds);
    //     }
    // };
    connectWebSocket = () => {
        const ID = this.props.ID;

        this.socket = new WebSocket(`ws://localhost:9999/backend/api/live/chat?ID=${ID}`);

        this.socket.onopen = () => {
            console.log(" WebSocket connected to ID:", ID);
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.Type === "Chat") {
                const message = {
                    Username: data.Username,
                    Message: data.Message
                }
                this.setState((prevState) => ({
                    messagesList: [...prevState.messagesList, message]
                }));
            }
            else if (data.Type === "Bid") {

            }
            else if (data.Type === "Timer") {
                const serverTimeLeft = parseInt(data.Timer);
                if (!isNaN(serverTimeLeft)) {
                    this.props.onTimerChange?.(serverTimeLeft);
                }
            }
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
                    <div>Live Chat</div>
                    <div className="live-view"><GrStreetView />{this.props.View}</div>
                </div>
                <div className="live-chat-body">
                    {
                        this.state.messagesList.map((message, index) => {
                            return (
                                <div className="chat-item" key={index}>
                                    <img alt="1" />
                                    <div className="user">
                                        <span className="user-name">{message.Username}</span>
                                        <span className="user-text">{message.Message}</span>
                                    </div>
                                </div>
                            )
                        }
                        )
                    }

                </div>
                <div className="live-chat-input">
                    {/* <MdInsertEmoticon className="icon-select" /> */}
                    <input type="text" value={this.state.currentMessage} className="live-message"
                        onChange={(e) => this.setState({ currentMessage: e.target.value })} placeholder="Type your message here"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                this.handleSendMessage();
                            }
                        }}
                    />
                    <button onClick={() => this.handleSendMessage()}>send</button>
                </div>

            </div>
        )
    }
}
export default LiveChatComponent;