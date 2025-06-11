import React from "react";
import YouTube from "react-youtube";
import '../../styles/music.scss';
class MusicComponent extends React.Component {
    state = {
        player: null,
        volume: 100,
        isPlaying: false,
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
        }, 500);


    };
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
        const { playlist, videoIndex, player } = this.state;
        if (videoIndex < playlist.length - 1) {
            const nextIndex = videoIndex + 1;
            this.setState({ videoIndex: nextIndex }, () => {
                player.loadVideoById(playlist[nextIndex]);
            });
        }
    };

    handlePrevious = () => {
        const { playlist, videoIndex, player } = this.state;
        if (videoIndex > 0) {
            const prevIndex = videoIndex - 1;
            this.setState({ videoIndex: prevIndex }, () => {
                player.loadVideoById(playlist[prevIndex]);
            });
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
        const opts = {
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
        return (
            <div className="music-container">
                <div className="music-box">
                    <nav className="music-navbar">
                        <div>Audio</div>
                        <div>Video</div>
                        <div>Setting</div>
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
                            <YouTube
                                videoId="iK-Cji6J73Q"
                                opts={opts}
                                onReady={this.onPlayerReady}
                            />
                        </div>
                        <div className="controls">
                            <button className="btn prev-btn">&#9664;&#9664;</button>
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
                            <button className="btn next-btn" >&#9654;&#9654;</button>

                        </div>
                        <div className="progress-bar">
                            <time className="progress-time">{this.formatTime(this.state.currentTime)}</time>
                            <input type="range" className="progress-line"
                                value={(this.state.currentTime / this.state.musicDuration) * 100}
                                onChange={(e) => this.handleProgressChange(e)}
                                min="0" max="100" step="1" />
                            <time className="progress-time" >{this.formatTime(this.state.musicDuration)}</time>
                        </div>
                        <div>
                            <input type="range" id="volume-control" min="0" max="100" step="1"
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