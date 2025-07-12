import React from "react";
import YouTube from 'react-youtube';
import '../../styles/live.scss';
import { GrStreetView } from "react-icons/gr";
import { Navigate, useParams } from 'react-router-dom';
class LiveDetailComponent extends React.Component {
    state = {
        redirect: null,
        currentUserID: '',
        ID: '',
        userID: '',
        UserName: '',
        Avt: '',
        Title: '',
        View: '',
        CreatedAt: '',
        LiveStatus: '',
        Visibility: '',
        LiveID: '',

    }
    componentDidMount() {
        fetch("http://localhost:9999/backend/api/user/userid", {
            method: "GET",
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    currentUserID: data.response.userID,
                })
            })
            .catch((err) => console.error(err));


        fetch("http://localhost:9999/backend/api/live/get", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ID: this.props.params.ID,

            }),
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    userID: data.response.UserID,
                    UserName: data.response.UserName,
                    Avt: data.response.Avt,
                    Title: data.response.Title,
                    View: data.response.View,
                    CreatedAt: data.response.CreatedAt,
                    LiveStatus: data.response.LiveStatus,
                    Visibility: data.response.Visibility,
                    LiveID: data.response.LiveID,

                })
            })
            .catch((err) => console.error(err));

    }
    onPlayerReady = (event) => {
        event.target.playVideo();
    };
    handleExit = () => {
        if (this.state.currentUserID === this.state.userID) {
            // fetch("http://localhost:9999/backend/api/live/exit", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({
            //         ID: this.props.params.ID,
            //     }),
            //     credentials: 'include'
            // })
            // .then((res) => res.json())
            // .then((data) => {
            //     if (data.success) {
            //         window.location.href = '/live';
            //     } else {
            //         console.error(data.error);
            //     }
            // })
            // .catch((err) => console.error(err));
        }
        this.setState({
            redirect: '/'
        })
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />;
        }
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
                    <h1>{this.state.UserName} / {this.state.Title}</h1>
                    <button onClick={() => this.handleExit()}>X</button>

                </div >
                <div className="live-body">
                    <div className="live-display">
                        <YouTube
                            videoId={this.state.LiveID}
                            opts={optsForVideo}
                            onReady={this.onPlayerReady}
                        // onStateChange={this.onPlayerStateChange}
                        // onError={this.onPlayerError}
                        />
                    </div>
                    <div className="live-chat">
                        <div className="live-chat-header">
                            <span>Live Chat</span>
                            <span className="live-view"><GrStreetView />{this.state.View}</span>
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

            </div >
        )
    }
}
function LiveDetailWrapper() {
    const params = useParams();
    return <LiveDetailComponent params={params} />;
}
export default (LiveDetailWrapper);