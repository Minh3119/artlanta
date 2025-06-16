import React from "react";

import { toast } from 'react-toastify';
import '../../styles/music.scss';

import MP3Component from "./mp3Component";
import VideoComponent from "./videoComponent";
import SettingComponent from "./settingComponent";
class MusicComponent extends React.Component {
    state = {
        isMP3: "mp3",//mp3 | video | setting
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

    handleTabChange = (tab) => {
        switch (tab) {
            case 'mp3':
                return <MP3Component />;
            case 'video':
                return <VideoComponent />;
            case 'setting':
                return <SettingComponent />;
            default:
                return null;
        }
    }
    render() {

        return (
            <div className="music-container" style={{ display: this.props.isMusicOpen ? 'flex' : 'none' }}>
                <div className="music-box">
                    <nav className="music-navbar">
                        <div onClick={() => this.setState({ isMP3: "mp3" })}>Audio</div>
                        <div onClick={() => this.setState({ isMP3: "video" })}>Video</div>
                        <div onClick={() => this.setState({ isMP3: "setting" })}>Setting</div>
                        <div onClick={() => this.props.setIsMusicOpen(!this.props.isMusicOpen)}>X</div>
                    </nav>

                    {this.handleTabChange(this.state.isMP3)}

                </div>
            </div>
        )
    }
}
export default MusicComponent