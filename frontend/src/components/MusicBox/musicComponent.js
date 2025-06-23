import React from "react";

import { toast } from 'react-toastify';
import { Rnd } from "react-rnd";
import { AiOutlineClose } from "react-icons/ai";
import '../../styles/music.scss';

import MP3Component from "./mp3Component";
import VideoComponent from "./videoComponent";
import SettingComponent from "./settingComponent";
class MusicComponent extends React.Component {
    state = {
        isMP3: "mp3",//mp3 | video | setting
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
                        <div onClick={() => this.props.setIsMusicOpen(!this.props.isMusicOpen)}><AiOutlineClose /></div>
                    </nav>

                    {this.handleTabChange(this.state.isMP3)}

                </div>
            </div>
        )
    }
}
export default MusicComponent