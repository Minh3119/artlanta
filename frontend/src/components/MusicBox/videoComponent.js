import React from "react";
import YouTube from "react-youtube";

class VideoComponent extends React.Component {
    state = {
        player: null,
        volume: 100,
        isPlaying: false,
        musicDuration: 0,
        currentTime: 0,
        musicTitle: "",
        playlist: [
            {
                type: 'video',
                ID: 'YzRyzWzTlI8'
            }
        ],
        currentPlaylist: {
            type: 'playlist',
            // ID: 'PLtwH7CuLnpU9xv30W-FgvcTZZIsD-wzX4'
            ID: 'PLdif7DCtYdMY2CYB5ozZI5r-tqEh-B9Qc'
            // type: 'video',
            // ID: 'YzRyzWzTlI8'
        },
    }
    onPlayerReady = (event) => {
        this.setState({
            player: event.target,
            musicTitle: event.target.getVideoData().title,
            musicDuration: event.target.getDuration(),
        });
        event.target.setVolume(this.state.volume);
    };
    onPlayerStateChange = (event) => {
        const YT = window.YT;
        if (event.data === YT.PlayerState.PLAYING) {
            setTimeout(() => {
                this.setState({
                    musicTitle: event.target.getVideoData().title,
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
    handleVolumeChange = (event) => {
        const newVolume = parseInt(event.target.value);
        const { player } = this.state;
        if (player) {
            player.setVolume(newVolume);
        }
        this.setState({ volume: newVolume });
    };

    render() {
        const optsForVideo = {
            // height: '0',
            // width: '0',
            height: '200px',
            width: '100%',
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
            // height: '0',
            // width: '0',
            height: '200px',
            width: '100%',
            playerVars: {
                autoplay: 0,
                listType: 'playlist',
                list: this.state.currentPlaylist.ID,
                loop: 1,

            }

        };
        return (
            <div className="video-control">
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

                <div className="volume-container">
                    <input type="range" className="volume-control" min="0" max="100" step="1"
                        value={this.state.volume}
                        onChange={(e) => this.handleVolumeChange(e)} />
                    <button className="btn mute-btn" >&#128265;</button>
                </div>
            </div>
        )
    }
}
export default VideoComponent;