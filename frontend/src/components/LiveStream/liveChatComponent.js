import React from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { GrStreetView } from "react-icons/gr";
import { redirect } from "react-router-dom";
import { Navigate } from 'react-router-dom';
class LiveChatComponent extends React.Component {

    state = {
        UserID: null,
        redirect: null,
        currentMessage: '',

    }

    async componentDidMount() {
        await axios.get("http://localhost:9999/backend/api/user/userid", { withCredentials: true })
            .then((res) => {
                this.setState({
                    UserID: res.data.response.userID,
                });
            })
            .catch((err) => console.error(err));
        await axios.get(`http://localhost:9999/backend/api/live/chat/get?livePost=${this.props.ID}`, { withCredentials: true })
            .then((res) => {
                this.props.updateMess(res.data.response);
            })
            .catch((err) => console.error(err));

    }
    // connectWebSocket = () => {
    //     const ID = this.props.ID;

    //     this.socket = new WebSocket(`ws://localhost:9999/backend/api/live/chat?ID=${ID}`);

    //     this.socket.onopen = () => {
    //         console.log(" WebSocket connected to ID:", ID);
    //     };

    //     this.socket.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         console.log("data:", data);
    //         if (data.Type === "Chat") {
    //             const message = {
    //                 Type: data.Type,
    //                 UserID: data.UserID,
    //                 Username: data.Username,
    //                 Message: data.Message
    //             }
    //             this.setState((prevState) => ({
    //                 messagesList: [...prevState.messagesList, message]
    //             }));
    //         }
    //         else if (data.Type === "Bid") {

    //         }


    //     };


    //     this.socket.onclose = () => {
    //         console.log(" WebSocket disconnected");
    //     };

    //     this.socket.onerror = (err) => {
    //         console.error(" WebSocket error:", err);
    //     };
    // }
    // componentWillUnmount() {
    //     if (this.socket) {
    //         this.socket.close();
    //     }

    // }

    handleSendMessage = () => {
        if (!this.state.UserID) {
            this.setState({
                redirect: "/login",
            })
            return;

        }
        if (this.state.currentMessage.startsWith('#bid')) {
            const amount = this.state.currentMessage.split('-')[2];
            if (this.props.balance < amount) {
                return toast.error("Ur credit is not that much!")
            }
        }
        if (this.props.socket && this.state.currentMessage.trim() !== '') {
            this.props.socket.send(this.state.currentMessage);
            this.setState({ currentMessage: '' });
        }
    }
    render() {
        if (this.state.redirect) {
            return (<Navigate to={this.state.redirect} />)
        }
        return (
            <div className="live-chat">
                <div className="live-chat-header">
                    <div>Live Chat</div>
                    <div className="balance">{this.props.balance} VND</div>
                    <div className="live-view"><GrStreetView />{this.props.View}</div>
                </div>
                <div className="live-chat-body">
                    {
                        this.props.messagesList.map((message, index) => {
                            return (
                                <div className="chat-item" key={index}>
                                    <img alt="1" />
                                    <div className="user">
                                        <span className="user-name">{message.Username}</span>
                                        <span className="user-text" style={{ backgroundColor: message.Type === "Bid" ? " red" : null }}>{message.Message}</span>
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