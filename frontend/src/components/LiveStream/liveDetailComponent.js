import React from "react";
import YouTube from 'react-youtube';
import '../../styles/live.scss';
import { GrStreetView } from "react-icons/gr";
class LiveDetailComponent extends React.Component {
    state = {
        author: 'Natlife',
        liveContent: 'Introduce about ReactJS',
        view: '1000000',
        liveID: 'zyDKOmP6BaU',

    }


    render() {
        const optsForVideo = {
            // height: '0',
            // width: '0',
            height: '600px',
            width: '100%',
            playerVars: {
                autoplay: 0,
                loop: 1,
            }

        };
        return (
            <div className="live-container">
                <div className="live-header">
                    <h1>{this.state.author} / {this.state.liveContent}</h1>
                    <button>X</button>

                </div>
                <div className="live-body">
                    <div className="live-display">
                        <YouTube
                            videoId={this.state.liveID}
                            opts={optsForVideo}
                        // onReady={this.onPlayerReady}
                        // onStateChange={this.onPlayerStateChange}
                        // onError={this.onPlayerError}
                        />
                    </div>
                    <div className="live-chat">
                        <div className="live-chat-header">
                            <span>Live Chat</span>
                            <span className="live-view"><GrStreetView />{this.state.view}</span>
                        </div>
                        <div className="live-chat-body">
                            <div className="chat-item">
                                <img alt="1" />
                                <div className="user">
                                    <span className="user-name">user</span>
                                    <span className="user-text">text</span>
                                </div>
                            </div>

                        </div>
                        <div className="live-chat-input">
                            <div>icon</div>
                            <input type="text" />
                            <button>send</button>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}
export default LiveDetailComponent