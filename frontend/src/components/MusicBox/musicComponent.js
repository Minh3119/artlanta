import React from "react";
import YouTube from "react-youtube";
import '../../styles/music.scss';
class MusicComponent extends React.Component {
    state = {
        player: null,
        volume: 100,
        isPlaying: false,
    }
    onPlayerReady = (event) => {
        this.setState({ player: event.target });
        event.target.setVolume(this.state.volume);
    };
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
    render() {
        const opts = {
            height: '0',
            width: '0',

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
                            <div className="track-title" aria-live="polite">Track Title</div>
                            <YouTube
                                videoId="dQw4w9WgXcQ"
                                opts={opts}
                                onReady={this.onPlayerReady}
                            />
                        </div>
                        <div className="controls">
                            <button className="btn prev-btn" aria-label="Previous Track" title="Previous">&#9664;&#9664;</button>
                            {
                                this.state.isPlaying ?
                                    <button className="btn play" aria-label="Pause" title="Pause"
                                        onClick={this.handlePause}
                                    >H</button>
                                    :
                                    <button className="btn play" aria-label="Play" title="Play"
                                        onClick={this.handlePlay}
                                    >&#9658;</button>
                            }
                            <button className="btn next-btn" aria-label="Next Track" title="Next">&#9654;&#9654;</button>

                        </div>
                        <div>
                            <time className="progress-time" id="current-time" aria-label="Current time">00:00</time>
                            <input type="range" id="progress-bar" value="0" min="0" max="100" step="1" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Track progress" />
                            <time className="progress-time" id="duration" aria-label="Track duration">00:00</time>
                        </div>
                        <div>
                            <input type="range" id="volume-control" min="0" max="100" step="1"
                                value={this.state.volume} aria-label="Volume control"
                                onChange={(e) => this.handleVolumeChange(e)} />
                            <button className="btn mute-btn" aria-label="Audio" title="Audio">&#128265;</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default MusicComponent