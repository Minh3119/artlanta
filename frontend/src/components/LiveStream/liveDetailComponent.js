import React from "react";
import YouTube from 'react-youtube';
import '../../styles/live.scss';
import logo from '../../assets/images/arlanta.svg';
import { Navigate, useParams } from 'react-router-dom';
import LiveChatComponent from "./liveChatComponent";
import LiveGalleryComponent from "./liveGalleryComponent";
import AddAuctionComponent from "./addAuctionComponent";
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import { toast } from 'react-toastify';
class LiveDetailComponent extends React.Component {
    state = {
        redirect: null,
        currentUserID: '',
        balance: 0,
        currentUserName: '',
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
        auctionTransaction: 0,
        realBidImage: [],
        isLoading: true,
        timeLeft: null,
        messagesList: [],
        isOpenAddAuction: false


    }
    socket = null;
    chatBoxRef = React.createRef();
    async componentDidMount() {
        await axios.get("http://localhost:9999/backend/api/user/userid", { withCredentials: true })
            .then((res) => {
                this.setState({
                    currentUserID: res.data.response.userID,
                    currentUserName: res.data.response.username
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
                    maxSizeMB: 0.02,
                    maxWidthOrHeight: 200,
                    useWebWorker: true,
                };
                const data = res.data.response;
                const previewUrls = Array.isArray(data.imageUrl) ? data.imageUrl : [];
                let count = 0;
                const filesFromUrls = await Promise.all(
                    previewUrls.map(async (item, index) => {
                        if (item.IsBid == "Bid") {
                            count++;
                        }
                        const response = await fetch(item.mediaURL);
                        const blob = await response.blob();
                        return ({
                            aucID: item.AucID,
                            userIDWithBid: item.BidUserID,
                            file: new File([blob], `image_${index}`, { type: blob.type }),
                            preview: URL.createObjectURL(blob),
                            startPrice: item.startPrice,
                            isBid: item.IsBid,

                        });
                    })
                );
                const compressedFile = await Promise.all(
                    filesFromUrls.map(async (item) => {
                        const compressed = await imageCompression(item.file, options);
                        return {
                            aucID: item.aucID,
                            userIDWithBid: item.userIDWithBid,
                            file: compressed,
                            preview: URL.createObjectURL(compressed),
                            startPrice: item.startPrice,
                            isBid: item.isBid,
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
                    auctionTransaction: count
                });
            })
            .catch((err) => console.error(err));
        // this.handleUpdateView();
        // this.chatBoxRef.current.scrollTo({
        //     top: this.chatBoxRef.current.scrollHeight,
        //     behavior: "smooth"
        // });

        this.loadWallet();
        if (!this.socket) {
            this.connectWebSocket();

        }
    }

    connectWebSocket = () => {
        const ID = this.props.params.ID;

        this.socket = new WebSocket(`ws://localhost:9999/backend/api/live/chat?ID=${ID}`);

        this.socket.onopen = () => {
            console.log(" WebSocket connected to ID:", ID);
            this.socket.send(`at-` + this.state.auctionTransaction);
            this.reloadAuction();
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            let message = {};
            if (data.Type === "Chat" || data.Type === "Bid") {
                message = {
                    Type: data.Type,
                    UserID: data.UserID,
                    Avatar: data.Avatar,
                    Username: data.Username,
                    Message: data.Message
                }
                // this.setState((prevState) => ({
                //     messagesList: [...prevState.messagesList, message]
                // }));
                this.setState((prevState) => ({
                    messagesList: [...prevState.messagesList, message]
                }),
                    () => {
                        // Scroll sau khi DOM đã update
                        if (this.chatBoxRef?.current) {
                            this.chatBoxRef.current.scrollTo({
                                top: this.chatBoxRef.current.scrollHeight,
                                behavior: "smooth"
                            });
                        }
                    }

                );
            }
            // else if (data.Type === "Bid") {
            //     message = {
            //         Type: data.Type,
            //         UserID: data.UserID,
            //         Username: data.Username,
            //         Message: data.Message
            //     }
            //     // this.setState((prevState) => ({
            //     //     messagesList: [...prevState.messagesList, message]
            //     // }));
            // }
            else if (data.Type === "Timer") {
                this.setState({ timeLeft: data.Message });
                return;
            }
            else if (data.Type === "BidUpdate") {
                this.reloadAuction();
                toast.success(`User ${data.UserID} have raise the ${data.AuctionIndex} Auction with ${data.Amount}`, {
                    toastId: "raise-auction",
                });

            }
            else if (data.Type === "BidResult") {
                this.changeCurrentAuction(data);
                this.reloadAuction();
                this.loadWallet();
                toast.success(`User ${data.UserID} have won the ${data.AuctionIndex} Auction with ${data.Amount}`, {
                    toastId: "won-auction",
                });

            }
            else if (data.Type === "CurrentAuction") {
                this.changeCurrentAuction(data);
            }
            else if (data.Type === "at") {
                return
            }
            else if (data.Type === "View") {
                this.loadView();
            }
            else if (data.Type === "Reload") {
                if (data.Reload === "true") {
                    this.reloadAuction();
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
    onPlayerReady = (event) => {
        event.target.playVideo();
    };
    handleOnChangeMessage = (e) => {
        this.setState({
            messagesList: e,
        })
    }
    changeCurrentAuction = (data) => {
        this.setState({
            auctionTransaction: data.CurrentAuction
        })
    }
    loadWallet = async () => {
        await axios.post("http://localhost:9999/backend/api/wallet", {},
            {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })
            .then(async (res) => {
                const data = res.data;
                this.setState({
                    balance: data.balance
                })


            })
            .catch((err) => console.error(err));
    }
    reloadAuction = async () => {
        await axios.post("http://localhost:9999/backend/api/live/auction/get",
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
                    maxSizeMB: 0.02,
                    maxWidthOrHeight: 200,
                    useWebWorker: true,
                };
                const data = res.data.response;
                const previewUrls = Array.isArray(data.imageUrl) ? data.imageUrl : [];
                let count = 0;
                const filesFromUrls = await Promise.all(
                    previewUrls.map(async (item, index) => {
                        if (item.IsBid == "Bid") {
                            count++;
                        }
                        const response = await fetch(item.mediaURL);
                        const blob = await response.blob();
                        return ({
                            aucID: item.AucID,
                            userIDWithBid: item.BidUserID,
                            file: new File([blob], `image_${index}`, { type: blob.type }),
                            preview: URL.createObjectURL(blob),
                            startPrice: item.startPrice,
                            isBid: item.IsBid,

                        });
                    })
                );
                const compressedFile = await Promise.all(
                    filesFromUrls.map(async (item) => {
                        const compressed = await imageCompression(item.file, options);
                        return {
                            aucID: item.aucID,
                            userIDWithBid: item.userIDWithBid,
                            file: compressed,
                            preview: URL.createObjectURL(compressed),
                            startPrice: item.startPrice,
                            isBid: item.isBid,
                        };
                    })
                )


                this.setState({
                    auctionTransaction: count,
                    imageBidList: compressedFile,
                    realBidImage: previewUrls,
                });
            })
            .catch((err) => console.error(err));
    }
    loadView = async () => {
        try {
            const res = await axios.post(
                "http://localhost:9999/backend/api/live/view/get",
                {
                    ID: this.props.params.ID,
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            const data = res.data;
            this.setState({
                View: data.View
            });
        } catch (err) {
            console.error(err);
        }
    }
    handleExit = async () => {
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
        this.setState({
            redirect: '/'
        })
    }
    handleEnd = async () => {
        if (this.state.currentUserID === this.state.userID && this.state.LiveStatus == 'Live') {
            console.log('End live');
            axios.post(`http://localhost:9999/backend/api/live/detail/end`, {
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
    handleAddAuctionForm = () => {
        this.setState({
            isOpenAddAuction: !this.state.isOpenAddAuction
        })
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />;
        }
        // const { ID } = this.props.params;
        const optsForVideo = {
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
                        {(this.state.currentUserID === this.state.userID && this.state.LiveStatus == 'Live') ?
                            <button className="end-live" onClick={() => this.handleEnd()}>End Live</button> : null
                        }
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
                                    {
                                        this.state.LiveStatus === "Live" ?
                                            <button className="auction-add" onClick={() => this.handleAddAuctionForm()}>+</button>
                                            :
                                            <div className="auction-add"></div>
                                    }
                                    <div>{this.state.timeLeft}</div>
                                </h2>

                                <div className="live-auction-list">
                                    {this.state.imageBidList.map((item, index) => {
                                        if (index <= this.state.auctionTransaction || this.state.LiveStatus === "Post") {
                                            return (
                                                <div className="live-auction-item" key={index}>
                                                    {
                                                        item.isBid == "Bid" ?
                                                            <p className="auction-id">Sold out!!!</p>
                                                            :
                                                            <p className="auction-id">ID: {item.aucID}</p>
                                                    }
                                                    <div className="image-wrapper">
                                                        <img src={item.preview} style={{ maxWidth: '200px', maxHeight: '500px' }} alt={`Live Auction ${index}`} />
                                                    </div>
                                                    <p>{item.startPrice} VND</p>
                                                </div>
                                            )
                                        }
                                        else {
                                            return (
                                                <div className="live-auction-item" key={index}>
                                                    <p className="auction-id">ID: ???</p>
                                                    <div className="image-wrapper">
                                                        <div style={{ maxWidth: '200px', maxHeight: '500px' }}>
                                                            Lock
                                                        </div>

                                                    </div>
                                                    <p>??? VND</p>
                                                </div>
                                            )
                                        }

                                    })

                                    }
                                </div>
                            </div>
                            {/* <LiveGalleryComponent
                                ID={this.props.params.ID}
                            /> */}
                        </div>
                        <LiveChatComponent
                            View={this.state.View}
                            handleUpdateView={this.handleUpdateView}
                            ID={this.props.params.ID}
                            messagesList={this.state.messagesList}
                            socket={this.socket}
                            updateMess={this.handleOnChangeMessage}
                            balance={this.state.balance}
                            chatBox={this.chatBoxRef}

                        />

                        {
                            this.state.isOpenAddAuction ?
                                <AddAuctionComponent
                                    ID={this.props.params.ID}
                                    handleCloseForm={this.handleAddAuctionForm}

                                /> :
                                null
                        }


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