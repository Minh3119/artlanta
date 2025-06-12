import React from "react";
import YouTube from "react-youtube";
import { toast } from 'react-toastify';
import '../../styles/music.scss';
class MusicComponent extends React.Component {
    state = {
        player: null,
        volume: 100,
        isPlaying: false,
        playlist: [
            {
                type: 'video',
                ID: 'YzRyzWzTlI8'
            }
        ],
        currentPlaylist: {
            type: 'playlist',
            ID: 'PLtwH7CuLnpU9xv30W-FgvcTZZIsD-wzX4'
            // type: 'video',
            // ID: 'YzRyzWzTlI8'
        },
        musicTitle: "",
        musicDuration: 0,
        currentTime: 0,
    }
    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
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
    formatYoutubeID = (url) => {
        const playlistRegex = /[?&]list=([A-Za-z0-9_-]{10,})/;
        const videoRegex = /(?:v=|\/videos\/|embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/;

        const isPlaylist = url.match(playlistRegex);
        if (isPlaylist) {
            return {
                type: 'playlist',
                ID: isPlaylist[1]
            };
        }

        const isVideo = url.match(videoRegex);
        if (isVideo) {
            return {
                type: 'video',
                ID: isVideo[1]
            };
        }

        return toast.error("Invalid YouTube URL");
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
    render() {
        const optsForVideo = {
            height: '0',
            width: '0',
            // height: '200px',
            // width: '200px',
            playerVars: {
                autoplay: 0,
                controls: 0,
                modestbranding: 1,
                showinfo: 0,
                rel: 0,
                fs: 0,
                disablekb: 1,
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
                list: this.state.currentPlaylist.ID,
                loop: 1,

            }

        };
        return (
            <div className="music-container">
                <div className="music-box">
                    <nav className="music-navbar">
                        <div>Audio</div>
                        <div>Video</div>
                        <div>Setting</div>
                        <div>X</div>
                    </nav>
                    <div className="music-control">
                        <div className="track-info">
                            <select className="playlist">
                                <option value="id">
                                    Music
                                </option>
                                <option value="id2">
                                    Vlog
                                </option>
                            </select>
                            <div className="track-title">{this.state.musicTitle}</div>
                            {this.state.currentPlaylist.type === 'video' ?
                                <YouTube
                                    videoId={this.state.currentPlaylist.ID}
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
                        <div className="volume-container">
                            <input type="range" className="volume-control" min="0" max="100" step="1"
                                value={this.state.volume}
                                onChange={(e) => this.handleVolumeChange(e)} />
                            <button className="btn mute-btn" >&#128265;</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default MusicComponent