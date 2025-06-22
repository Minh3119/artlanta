import React from "react";
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
class SettingComponent extends React.Component {
    state = {
        playlistName: "",
        playlistLink: "",
        editName: "",
        editLink: "",
        listPlaylist: [
            {

            }
        ],
        isEdit: false,
        editingIndex: null,
        isDuplicate: "white",
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
                this.setState({
                    listPlaylist: data.response,
                });
            })
            .catch(error => {
                console.error('Error fetching music data:', error);
            });

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
    handleOnChangeName = (e) => {
        this.setState({ playlistName: e.target.value })
    }
    handleOnChangeLink = (e) => {
        this.setState({ playlistLink: e.target.value })
    }
    handleOnChangeNameEdit = (e) => {
        this.setState({ editName: e.target.value })
    }
    handleOnChangeLinkEdit = (e) => {
        this.setState({ editLink: e.target.value })
    }
    handleOnCheck = () => {
        const isDuplicate = this.state.listPlaylist.some(
            item => item.playlistName.trim() === this.state.playlistName.trim()
        );

        if (isDuplicate) {
            toast.error("Playlist name already exists!");
            this.setState({ isDuplicate: "lightcoral" });
            return;
        }
        else {
            this.setState({ isDuplicate: "lightgreen" });
            return;
        }
    }
    handleOnAdd = async () => {
        if (this.state.listPlaylist.some(
            item => item.playlistName.trim() === this.state.playlistName.trim()
        )
        ) {
            toast.error("Please check the playlist name.");
            this.setState({ isDuplicate: "lightcoral" });
            return;
        }
        if (this.state.playlistName === "" || this.state.playlistLink === "") {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const res = await fetch('http://localhost:9999/backend/api/music/insert', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    playlistName: this.state.playlistName.trim(),
                    playlistLink: this.state.playlistLink.trim()
                }),
                credentials: 'include'
            });

            if (res.ok) {
                this.setState({
                    playlistName: "",
                    playlistLink: "",
                    isDuplicate: "white",
                });
                toast.success("Create playlist completed!");
                this.componentDidMount();
            } else {
                toast.error("Create playlist error, try again later.");
            }
        }
        catch (er) {
            this.setState({ message: "Cannot connect to the server." });
            console.log("server error!", er);
        }
    }
    handleOpenEdit = (index) => {

        this.setState({
            editingIndex: index,
            editName: this.state.listPlaylist[index].playlistName,
            editLink: this.state.listPlaylist[index].playlistLink,

        })
    }
    handleOnEdit = async (ID) => {
        if (this.state.editName === "" || this.state.editLink === "") {
            alert("Please fill in all fields.");
            return;
        }
        try {
            const res = await fetch('http://localhost:9999/backend/api/music/update', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ID: ID,
                    playlistName: this.state.editName.trim(),
                    playlistLink: this.state.editLink.trim()
                }),
                credentials: 'include'
            });
            if (res.ok) {
                this.setState({
                    editName: "",
                    editLink: "",
                    isEdit: false,
                    editingIndex: null,
                });
                toast.success("Edit playlist completed!");
                this.componentDidMount();
            } else {
                toast.error("Edit playlist error, try again later.");
            }
        }
        catch (er) {
            this.setState({ message: "Cannot connect to the server." });
            console.log("server error!", er);
        }
    }
    handleOnRemove = async (ID) => {
        try {
            const res = await fetch('http://localhost:9999/backend/api/music/delete', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ID: ID
                }),
                credentials: 'include'
            });
            if (res.ok) {
                toast.success("Delete playlist completed!");
                this.componentDidMount();
            } else {
                toast.error("Delete playlist error, try again later.");
            }
        }
        catch (er) {
            this.setState({ message: "Cannot connect to the server." });
            console.log("server error!", er);
        }
    }
    render() {
        return (
            <div className="music-control">
                <div className="playlist-name">
                    <input type="text" placeholder="playlist name " value={this.state.playlistName}
                        onChange={(e) => this.handleOnChangeName(e)}
                        style={{ backgroundColor: this.state.isDuplicate }} />
                    <button onClick={this.handleOnCheck}>
                        <FaCheck className="icon" />
                    </button>
                </div>
                <div className="playlist-link">
                    <input type="text" placeholder="playlist link" value={this.state.playlistLink} onChange={(e) => this.handleOnChangeLink(e)} />
                    <button onClick={this.handleOnAdd}>
                        <MdAddCircleOutline className="icon" />
                    </button>
                </div>
                <div className="playlist-list">
                    {/* <input type="text" placeholder="playlist 1"
                        onChange={(e) => { this.setState({}) }} />
                    <input type="text" placeholder="link 1" /> */}
                    <div className="playlist-display">
                        {
                            this.state.listPlaylist.map((item, index) => {
                                this.state.isEdit = this.state.editingIndex === index
                                return (
                                    <div key={item.ID}>
                                        {this.state.isEdit ?
                                            <div>
                                                <input className="item-name" value={this.state.editName} onChange={(e) => this.handleOnChangeNameEdit(e)} />
                                                <textarea className="item-link" value={this.state.editLink} onChange={(e) => this.handleOnChangeLinkEdit(e)} />
                                                <button onClick={() => this.handleOnEdit(item.ID)}>
                                                    <FaEdit className="icon" />
                                                </button>
                                                <button onClick={() => this.handleOnRemove(item.ID)}>
                                                    <MdDeleteOutline className="icon" />
                                                </button>
                                            </div>
                                            :
                                            <div onDoubleClick={() => this.handleOpenEdit(index)}>
                                                <p className="item-name">{item.playlistName}</p>
                                                <p className="item-link">{item.playlistLink}</p>
                                                <button onClick={() => this.handleOpenEdit(index)}>
                                                    <FaEdit className="icon" />
                                                </button>
                                                <button onClick={() => this.handleOnRemove(item.ID)}>
                                                    <MdDeleteOutline className="icon" />
                                                </button>
                                            </div>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>


                </div>
            </div >
        )
    }
}
export default SettingComponent;