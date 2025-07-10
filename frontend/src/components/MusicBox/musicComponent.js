import React from "react";

// import { toast } from 'react-toastify';
// import { Rnd } from "react-rnd";
import { Navigate } from 'react-router-dom';
import { AiOutlineClose } from "react-icons/ai";
import '../../styles/music.scss';

import MP3Component from "./mp3Component";
import VideoComponent from "./videoComponent";
import SettingComponent from "./settingComponent";
class MusicComponent extends React.Component {
    state = {
        isMP3: "mp3",//mp3 | video | setting
        userID: 0
    }
    async componentDidUpdate() {
        try {
            const res = await fetch(
                "http://localhost:9999/backend/api/session/check",
                {
                    credentials: "include",
                }
            );

            if (!res.ok) return;

            const data = await res.json();
            if (data.loggedIn) {
                this.setState({
                    userID: data.userId,
                })
            }
        } catch (error) {
            console.error("Failed to check session:", error);
        }
    }
    async componentWillUnmount() {
        try {
            const res = await fetch(
                "http://localhost:9999/backend/api/session/check",
                {
                    credentials: "include",
                }
            );

            if (!res.ok) return;

            const data = await res.json();
            if (data.loggedIn) {
                this.setState({
                    userID: data.userId,
                })
            }
        } catch (error) {
            console.error("Failed to check session:", error);
        }
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
        if (this.state.userID === 0 && this.state.isMP3 === "setting") {
            this.setState({
                isMP3: "mp3",
            });

            return (<Navigate to="/login" />);
        };

        return (
            <div className="music-container" style={{ display: this.props.isMusicOpen ? 'flex' : 'none' }}>
                <div className="music-box">
                    <nav className="music-navbar">
                        <div onClick={() => this.setState({ isMP3: "mp3" })}>Audio</div>
                        <div onClick={() => this.setState({ isMP3: "video" })}>Video</div>
                        <div onClick={() => {
                            this.setState({ isMP3: "setting" });
                        }
                        }>Setting</div>
                        <div onClick={() => this.props.setIsMusicOpen(!this.props.isMusicOpen)}><AiOutlineClose /></div>
                    </nav>

                    {this.handleTabChange(this.state.isMP3)}

                </div >
            </div >
        )
    }
}
export default MusicComponent