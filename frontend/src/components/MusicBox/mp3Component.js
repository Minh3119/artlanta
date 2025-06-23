import React from "react";
import YouTube from "react-youtube";
import { toast } from 'react-toastify';
class MP3Component extends React.Component {
    state = {
        player: null,
        volume: 100,
        isPlaying: false,
        musicDuration: 0,
        currentTime: 0,
        musicTitle: "",
        listPlaylist: [{
            type: 'playlist',
            ID: 0,
            name: "jack",
            link: 'PLdif7DCtYdMY2CYB5ozZI5r-tqEh-B9Qc'
        }],
        currentPlaylist: {
            type: 'playlist',
            ID: 0,
            name: "jack",
            link: 'PLdif7DCtYdMY2CYB5ozZI5r-tqEh-B9Qc'
            // link: 'PLtwH7CuLnpU9xv30W-FgvcTZZIsD-wzX4'
            // type: 'video',
            // ID: 'YzRyzWzTlI8'
        },
        totalPlayTime: 0,
        playStartTime: null,
    }
    componentDidMount() {
        fetch(`http://localhost:9999/backend/api/music/view`, {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch music data');
                return response.json();
            })
            .then(async data => {
                const validPlaylists = data.response
                    .map(item => this.formatYoutubeID(item))
                    .filter(Boolean);

                this.setState({
                    listPlaylist: [this.state.listPlaylist[0], ...validPlaylists],
                });
            })
            .catch(error => {
                console.error('Error fetching music data:', error);
            });

    }
    async componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        let totalTime = this.state.totalPlayTime;
        if (this.state.playStartTime) {
            const now = Date.now();
            const playedTime = (now - this.state.playStartTime) / 1000;
            totalTime += playedTime;
        }
        try {
            const res = await fetch('http://localhost:9999/backend/api/music/time/insert', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    totalPlayTime: totalTime,
                }),
            })
            if (res.ok) {
                return;
            } else {
                toast.error("error save play time");
            }
        }
        catch (er) {
            console.log("server error!", er);
        }
    }
    formatYoutubeID = (item) => {
        const playlistRegex = /[?&]list=([A-Za-z0-9_-]{10,})/;
        const videoRegex = /(?:v=|\/videos\/|embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/;

        const isPlaylist = item.playlistLink.match(playlistRegex);
        if (isPlaylist) {
            return {
                type: 'playlist',
                ID: item.ID,
                name: item.playlistName,
                link: isPlaylist[1]
            };
        }

        const isVideo = item.playlistLink.match(videoRegex);
        if (isVideo) {
            return {
                type: 'video',
                ID: item.ID,
                name: item.playlistName,
                link: isVideo[1]
            };
        }

        return toast.error("Invalid YouTube URL");
    }

    onPlayerReady = (event) => {
        this.setState({
            player: event.target,
            musicTitle: event.target.getVideoData().title,
            musicDuration: event.target.getDuration(),
        });
        event.target.setVolume(this.state.volume);
        this.interval = setInterval(() => {
            const time = this.state.player.getCurrentTime();
            this.setState({ currentTime: time });
        }, 800);


    };
    onPlayerStateChange = (event) => {
        const YT = window.YT;
        const currentTime = Date.now();
        switch (event.data) {
            case 1:
                this.setState({
                    isPlaying: true,
                    playStartTime: currentTime
                });

                break;
            case 2:
                if (this.state.playStartTime) {
                    const playedTime = (currentTime - this.state.playStartTime) / 1000;
                    this.setState({
                        totalPlayTime: this.state.totalPlayTime + playedTime,
                        playStartTime: null,
                        isPlaying: false,
                    });
                } else {
                    this.setState({ isPlaying: false });
                }
                break;
        }
        if (event.data === YT.PlayerState.PLAYING) {
            setTimeout(() => {
                this.setState({
                    musicTitle: event.target.getVideoData().title,
                    musicDuration: event.target.getDuration(),
                })
            }, 500);
        }
    }
    onPlayerError = (event) => {
        let errorMessage = "error";

        switch (event.data) {
            case 2:
                errorMessage = "Wrong videoID format";
                break;
            case 5:
                errorMessage = "HTML5 player error";
                break;
            case 100:
                errorMessage = "Private video, cannot be played";
                break;
            case 101:
            case 150:
                errorMessage = "Video cannot be played in your area";
                break;
            default:
                errorMessage = "Unknown error occurred";
        }

        this.setState({
            musicTitle: errorMessage,
            isPlaying: false,
        });
    }
    formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        const pad = (num) => String(num).padStart(2, '0');

        if (h > 0) {
            return `${pad(h)}:${pad(m)}:${pad(s)}`;
        } else {
            return `${pad(m)}:${pad(s)}`;
        }
    }
    handlePause = () => {
        if (this.state.player) {
            this.state.player.pauseVideo();
        }
        this.setState({ isPlaying: false });
    };

    handlePlay = () => {
        if (this.state.player) {
            this.state.player.playVideo();
        }
        this.setState({ isPlaying: true });
    };

    handleNext = () => {
        if (this.state.player) {
            this.state.player.nextVideo();
        }
    };

    handlePrevious = () => {
        if (this.state.player) {
            this.state.player.previousVideo();
        }
    };
    handleMute = () => {
        if (this.state.player) {
            if (this.state.volume > 0) {
                this.state.player.setVolume(0);
                this.setState({ volume: 0 });
            } else {
                this.state.player.setVolume(100);
                this.setState({ volume: 100 });
            }
        }
    }
    handleVolumeChange = (event) => {
        const newVolume = parseInt(event.target.value);
        const { player } = this.state;
        if (player) {
            player.setVolume(newVolume);
        }
        this.setState({ volume: newVolume });
    };
    handleProgressChange = (event) => {
        const newTime = (event.target.value / 100) * this.state.musicDuration;
        if (this.state.player) {
            this.state.player.seekTo(newTime, true);
        }
        this.setState({ currentTime: newTime });
    };
    handleChangeMusic = (event) => {
        const now = Date.now();
        let addedPlayTime = 0;

        if (this.state.playStartTime) {
            addedPlayTime = (now - this.state.playStartTime) / 1000;
        }

        this.setState({
            totalPlayTime: this.state.totalPlayTime + addedPlayTime,
            playStartTime: null,
            isPlaying: false,
            currentPlaylist: this.state.listPlaylist[event.target.value],
        });
    }
    render() {
        const optsForVideo = {
            height: '0',
            width: '0',
            // height: '200px',
            // width: '200px',
            playerVars: {
                autoplay: 0,
                loop: 1,
            }

        };
        const optsForPlaylist = {
            height: '0',
            width: '0',
            // height: '200px',
            // width: '200px',
            playerVars: {
                autoplay: 0,
                listType: 'playlist',
                list: this.state.currentPlaylist.link,
                loop: 1,

            }

        };
        return (
            <div className="mp3-control">
                <div className="track-info">
                    <select className="playlist" onChange={(e) => this.handleChangeMusic(e)}>
                        {this.state.listPlaylist.map((item, index) =>
                            <option value={index} key={item.ID}>
                                {item.name}
                            </option>

                        )}

                    </select>
                    <div className="track-title">{this.state.musicTitle}</div>
                    {this.state.currentPlaylist.type === 'video' ?
                        <YouTube
                            videoId={this.state.currentPlaylist.link}
                            opts={optsForVideo}
                            onReady={this.onPlayerReady}
                            onStateChange={this.onPlayerStateChange}
                            onError={this.onPlayerError}
                        />
                        :
                        <YouTube

                            opts={optsForPlaylist}
                            onReady={this.onPlayerReady}
                            onStateChange={this.onPlayerStateChange}
                            onError={this.onPlayerError}
                        />

                    }
                </div>

                <>
                    <div className="controls">
                        <button className="btn prev-btn" onClick={this.handlePrevious}>&#9664;&#9664;</button>
                        {
                            this.state.isPlaying ?
                                <button className="btn pause"
                                    onClick={this.handlePause}
                                >H</button>
                                :
                                <button className="btn play"
                                    onClick={this.handlePlay}
                                >&#9658;</button>
                        }
                        <button className="btn next-btn" onClick={this.handleNext} >&#9654;&#9654;</button>

                    </div>
                    <div className="progress-bar">
                        <time className="progress-time">{this.formatTime(this.state.currentTime)}</time>
                        <input type="range" className="progress-line"
                            value={(this.state.currentTime / this.state.musicDuration) * 100}
                            onChange={(e) => this.handleProgressChange(e)}
                            min="0" max="100" step="1" />
                        <time className="progress-time" >{this.formatTime(this.state.musicDuration)}</time>
                    </div>
                </>

                <div className="volume-container">
                    <input type="range" className="volume-control" min="0" max="100" step="1"
                        value={this.state.volume}
                        onChange={(e) => this.handleVolumeChange(e)} />
                    <button className="btn mute-btn" onClick={() => this.handleMute()}>&#128265;</button>
                </div>
            </div>
        )
    }
}
export default MP3Component;