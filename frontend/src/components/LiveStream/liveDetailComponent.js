import React from "react";
import YouTube from 'react-youtube';
import '../../styles/live.scss';
import { GrStreetView } from "react-icons/gr";
import { MdInsertEmoticon } from "react-icons/md";
import { useParams } from 'react-router-dom';
class LiveDetailComponent extends React.Component {
    state = {
        author: 'Natlife',
        liveTitle: 'Introduce about ReactJS',
        view: '1000000',
        liveID: 'zyDKOmP6BaU',

    }
    onPlayerReady = (event) => {
        event.target.playVideo();
    };

    render() {
        const { ID } = this.props.params;
        const optsForVideo = {
            // height: '0',
            // width: '0',
            height: '580px',
            width: '100%',
            playerVars: {
                autoplay: 1,
                controls: 1,
                modestbranding: 1,
                rel: 0,
                fs: 1,
                disablekb: 1,
                iv_load_policy: 3,
            }

        };
        return (
            <div className="live-container">
                <div className="live-header">
                    {/* <h1>{ID}</h1> */}
                    <h1>{this.state.author} / {this.state.liveTitle}</h1>
                    <button>X</button>

                </div>
                <div className="live-body">
                    <div className="live-display">
                        <YouTube
                            videoId={this.state.liveID}
                            opts={optsForVideo}
                            onReady={this.onPlayerReady}
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
                            {/* <MdInsertEmoticon className="icon-select" /> */}
                            <input type="text" />
                            <button>send</button>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}
function LiveDetailWrapper() {
    const params = useParams();
    return <LiveDetailComponent params={params} />;
}
export default (LiveDetailWrapper);