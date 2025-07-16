import React from "react";
import { GrStreetView } from "react-icons/gr";
import ChatStore from "./chatStore";
class LiveChatComponent extends React.Component {

    state = {
        messagesList: [],
        currentMessage: '',
    };
    unsubcribe = null;
    socket = null;
    componentDidMount() {
        const store = ChatStore.getState();
        store.connect(this.props.ID);


        this.unsubscribe = ChatStore.subscribe(
            (state) => state.messages,
            (messages) => {
                this.setState({ messagesList: messages });
            }
        );
    }
    componentWillUnmount() {
        const store = ChatStore.getState();
        store.disconnect();


        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    handleSendMessage = () => {
        if (this.state.currentMessage.trim() !== '') {
            const store = ChatStore.getState();
            store.sendMessage(currentMessage);
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