import React from "react";
import YouTube from 'react-youtube';
import '../../styles/live.scss';
import { GrStreetView } from "react-icons/gr";
import { Navigate, useParams } from 'react-router-dom';
import LiveChatComponent from "./liveChatComponent";
import axios from 'axios';
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
        peakView: '',
        CreatedAt: '',
        LiveStatus: '',
        Visibility: '',
        LiveID: '',

    }
    componentDidMount() {
        axios.get("http://localhost:9999/backend/api/user/userid", { withCredentials: true })
            .then((res) => {
                this.setState({
                    currentUserID: res.data.response.userID,
                });
            })
            .catch((err) => console.error(err));


        axios.post("http://localhost:9999/backend/api/live/get",
            {
                ID: this.props.params.ID
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            .then((res) => {
                const data = res.data.response;
                this.setState({
                    userID: data.UserID,
                    UserName: data.UserName,
                    Avt: data.Avt,
                    Title: data.Title,
                    View: data.View,
                    CreatedAt: data.CreatedAt,
                    LiveStatus: data.LiveStatus,
                    Visibility: data.Visibility,
                    LiveID: data.LiveID,
                });
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
    handleUpdateView = async () => {
        try {
            const API_KEY = 'YOUR_API_KEY';
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`
            );
            const views = response.data.items[0].statistics.viewCount;
            setViewCount(views);
        } catch (error) {
            console.error('Lỗi khi lấy lượt xem:', error);
        }

    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />;
        }
        // const { ID } = this.props.params;
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
                    <LiveChatComponent
                        View={this.state.View}
                        handleUpdateView={this.handleUpdateView}

                    />


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