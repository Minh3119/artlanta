import React from "react";
import '../../styles/music.scss';
class MusicComponent extends React.Component {
    render() {
        return (
            <div className="music-container">
                <div className="music-box">
                    <nav>music box navbar</nav>
                    <div className="music-control">
                        <div className="track-info">
                            <div className="track-title" aria-live="polite">Track Title</div>
                        </div>
                        <div className="controls">
                            <button className="btn prev-btn" aria-label="Previous Track" title="Previous">&#9664;&#9664;</button>
                            <button className="btn play" aria-label="Play" title="Play">&#9658;</button>
                            <button className="btn next-btn" aria-label="Next Track" title="Next">&#9654;&#9654;</button>
                        </div>
                        <div className="progress-area">
                            <time className="progress-time" id="current-time" aria-label="Current time">00:00</time>
                            <input type="range" id="progress-bar" value="0" min="0" max="100" step="1" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Track progress" />
                            <time className="progress-time" id="duration" aria-label="Track duration">00:00</time>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default MusicComponent