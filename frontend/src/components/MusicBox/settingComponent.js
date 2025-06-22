import React from "react";
import { toast } from 'react-toastify';
class SettingComponent extends React.Component {
    state = {
        playlistName: "",
        playlistLink: "",
        listPlaylist: [
            {

            }
        ]
    }
    componentDidMount() {
        // Fetch existing playlists from the server or local storage
        // this.setState({ listPlaylist: fetchedPlaylists });
    }
    componentDidUpdate() {

    }
    handleOnCheck = () => {

    }
    handleOnAdd = async () => {
        const formData = new FormData();
        formData.append("playlistName", this.state.playlistName);
        formData.append("playlistLink", this.state.playlistLink);
        if (this.state.playlistName === "" || this.state.playlistLink === "") {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const res = await fetch('http://localhost:9999/backend/api/post/create', {
                method: "POST",
                body: formData,
                credentials: 'include'
            });
            if (res.ok) {
                this.setState({
                    playlistName: "",
                    playlistLink: "",
                });
                toast.success("Create playlist completed!");
            } else {
                toast.error("Create playlist error, try again later.");
            }
        }
        catch (er) {
            this.setState({ message: "Cannot connect to the server." });
            console.log("server error!", er);
        }
    }
    handleOnEdit = () => {

    }
    handleOnRemove = () => {

    }
    render() {
        return (
            <div className="music-control">
                <div className="playlist-name">
                    <input type="text" placeholder="playlist name " value={this.state.playlistName} onChange={(e) => { this.setState({ playlistName: e.target.value }) }} />
                    <button onClick={this.handleOnCheck}>
                        check
                    </button>
                </div>
                <div className="playlist-link">
                    <input type="text" placeholder="playlist link" value={this.state.playlistLink} onChange={(e) => { this.setState({ playlistLink: e.target.value }) }} />
                    <button onClick={this.handleOnAdd}>
                        Add
                    </button>
                </div>
                <div className="playlist-list">
                    <input type="text" placeholder="playlist 1"
                        onChange={(e) => { this.setState({}) }} />
                    <input type="text" placeholder="link 1" />
                    <button onClick={this.handleOnEdit}>
                        edit
                    </button>
                    <button onClick={this.handleOnRemove}>
                        remove
                    </button>

                </div>
            </div>
        )
    }
}
export default SettingComponent;