import React from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { GrStreetView } from "react-icons/gr";
import { redirect, Navigate } from "react-router-dom";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip } from 'react-tooltip';
class LiveChatComponent extends React.Component {

    state = {
        instructor: `<strong>Auction tip</strong><br/>
                    Syntax: #bid-(AuctionID)-(BidPrice)<br/><br/>
                    - Each transaction lasts 50s.<br/>
                    - When a transaction resets, the highest bid will be applied.<br/>
                    - If no one bids in a transaction, the winner will be the previous highest bidder.<br/>
                    - If no one bids in the first transaction, the auction will return to the author.<br/>
                    - The winner can check the notification for download link.`,
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

    handleSendMessage = () => {
        if (!this.state.UserID) {
            this.setState({
                redirect: "/login",
            })
            return;

        }
        if (this.state.currentMessage.startsWith('#bid')) {
            const amount = this.state.currentMessage.split('-')[2];
            if (Number(this.props.balance) < amount) {
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
                <div className="live-chat-body" ref={this.props.chatBox}>
                    {
                        this.props.messagesList.map((message, index) => {
                            return (
                                <div className="chat-item" key={index}>
                                    <img src={message.Avatar} className="user-avatar" alt="1" />
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
                    <FaCircleInfo className="message-help" data-tooltip-id="my-tooltip"
                        data-tooltip-html={this.state.instructor} />
                    <Tooltip id="my-tooltip" place="bottom"
                        style={{
                            maxWidth: '300px',
                            whiteSpace: 'normal',
                            backgroundColor: '#333',
                            color: '#fff',
                            fontSize: '13px',
                            padding: '8px',
                            borderRadius: '4px'
                        }}
                    />
                    <button onClick={() => this.handleSendMessage()}>send</button>
                </div>

            </div>
        )
    }
}
export default LiveChatComponent;