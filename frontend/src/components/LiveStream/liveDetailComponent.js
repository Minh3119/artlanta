import React from "react";
import YouTube from 'react-youtube';
import '../../styles/live.scss';
import logo from '../../assets/images/arlanta.svg';
import { Navigate, useParams } from 'react-router-dom';
import LiveChatComponent from "./liveChatComponent";
import imageCompression from 'browser-image-compression';
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
        imageBidList: [],
        realBidImage: [],
        isLoading: true,
        timeLeft: null,

    }
    timerInterval = null;
    async componentDidMount() {
        await axios.get("http://localhost:9999/backend/api/user/userid", { withCredentials: true })
            .then((res) => {
                this.setState({
                    currentUserID: res.data.response.userID,
                });
            })
            .catch((err) => console.error(err));


        await axios.post("http://localhost:9999/backend/api/live/get",
            {
                ID: this.props.params.ID
            },
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            .then(async (res) => {
                const options = {
                    maxSizeMB: 0.1,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                };
                const data = res.data.response;
                const previewUrls = Array.isArray(data.imageUrl) ? data.imageUrl : [];
                const filesFromUrls = await Promise.all(
                    previewUrls.map(async (item, index) => {
                        const response = await fetch(item.mediaURL);
                        const blob = await response.blob();
                        return ({
                            file: new File([blob], `image_${index}`, { type: blob.type }),
                            preview: URL.createObjectURL(blob),
                            startPrice: item.startPrice,
                            isBid: false,
                            userIDWithBid: null,
                        });
                    })
                );
                const compressedFile = await Promise.all(
                    filesFromUrls.map(async (item) => {
                        const compressed = await imageCompression(item.file, options);
                        return {
                            file: compressed,
                            preview: URL.createObjectURL(compressed),
                            startPrice: item.startPrice,
                            isBid: false,
                            userIDWithBid: null,
                        };
                    })
                )

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
                    imageBidList: compressedFile,
                    realBidImage: previewUrls,
                    isLoading: false,
                });
            })
            .catch((err) => console.error(err));
        this.handleUpdateView();

    }
    componentWillUnmount() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    }
    handleTimerFromChild = (serverTimeLeft) => {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.setState({ timeLeft: serverTimeLeft });

        this.timerInterval = setInterval(() => {
            this.setState(prev => {
                if (prev.timeLeft > 0) return { timeLeft: prev.timeLeft - 1 };
                clearInterval(this.timerInterval);
                return { timeLeft: 0 };
            });
        }, 1000);
    };
    onPlayerReady = (event) => {
        event.target.playVideo();
    };
    handleExit = async () => {
        if (this.state.currentUserID === this.state.userID[0] && this.state.LiveStatus == 'Live') {
            console.log('End live');
            axios.post(`http://localhost:9999/backend/api/live/detail/end`, {
                ID: this.props.params.ID,
                View: this.state.View[0],
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }

            ).catch((err) => console.error(err));
        }
        else {
            console.log('Exit live');
            await axios.post(`http://localhost:9999/backend/api/live/update/view`, {
                ID: this.props.params.ID,
                View: this.state.View,
            }, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            }

            ).catch((err) => console.error(err));
        }
        this.setState({
            redirect: '/'
        })
    }
    handleUpdateView = async () => {
        try {
            const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
            const response = await axios.get(
                `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${this.state.LiveID}&key=${API_KEY}`
            );

            this.setState({
                View: response.data.items[0].statistics.viewCount,
                peakView: this.state.View > this.state.peakView ? this.state.View : this.state.peakView
            });
        } catch (error) {
            console.error('Error get view:', error);
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
            // height: '580px',
            // width: '100%',
            playerVars: {
                autoplay: 0,
                controls: 1,
                modestbranding: 1,
                rel: 0,
                fs: 1,
                disablekb: 1,
                iv_load_policy: 3,
            }

        };
        return (

            this.state.isLoading ?
                <div className="loading-container">
                    <span>Loading ...</span>
                    <img
                        src={logo}
                        alt="Loading..."
                        className="loading-spinner"
                    /></div>
                :
                < div className="live-container" >
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
                            // onReady={this.onPlayerReady}
                            // onStateChange={this.onPlayerStateChange}
                            // onError={this.onPlayerError}
                            />
                            <div className="live-auction-container">
                                <h2>
                                    <div className="auction-header">Live Auction</div>
                                    <div>{this.state.timeLeft}</div>
                                </h2>

                                <div className="live-auction-list">
                                    {this.state.imageBidList.map((item, index) => {
                                        return (
                                            <div className="live-auction-item" key={index}>
                                                <div className="image-wrapper">
                                                    <img src={item.preview} style={{ maxWidth: '200px', maxHeight: '500px' }} alt={`Live Auction ${index}`} />
                                                </div>
                                                <p>{item.startPrice}</p>
                                            </div>
                                        )
                                    })

                                    }
                                </div>
                            </div>
                            <div className="live-gallery-container">
                                <h2>
                                    Live Gallery
                                </h2>
                            </div>
                        </div>
                        <LiveChatComponent
                            View={this.state.View}
                            handleUpdateView={this.handleUpdateView}
                            ID={this.props.params.ID}
                            onTimerChange={this.handleTimerFromChild}

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