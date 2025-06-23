import React from "react";
import { toast } from 'react-toastify';
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import { RiResetLeftFill } from "react-icons/ri";
class SettingComponent extends React.Component {
    state = {
        playlistName: "",
        playlistLink: "",
        editName: "",
        editLink: "",
        totalPlayTime: 0,
        editID: null,
        listPlaylist: [
            {

            }
        ],
        isEdit: false,
        editingIndex: null,
        isDuplicate: "white",
        playTime: 0
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

        fetch(`http://localhost:9999/backend/api/music/time/view`, {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch playtime');
                return response.json();
            })
            .then(async data => {
                this.setState({
                    playTime: data.response
                });
            })
            .catch(error => {
                console.error('Error fetchingplaytime:', error);
            });

    }

    handleOnChangeName = (e) => {
        const newName = e.target.value;
        newName.trim().length <= 50 ?
            (
                this.setState({
                    playlistName: newName
                })
            )
            :
            (
                toast.error('Playlist name too long!', {
                    toastId: "playlistName-toast",
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    className: "toast-complete"
                })
            )
    }
    handleOnChangeLink = (e) => {
        const newLink = e.target.value;
        newLink.trim().length <= 200 ?
            (
                this.setState({
                    playlistLink: newLink
                })
            )
            :
            (
                toast.error('Playlist link too long!', {
                    toastId: "playlistName-toast",
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    className: "toast-complete"
                })
            )
    }
    handleOnChangeNameEdit = (e) => {
        const newName = e.target.value;
        newName.trim().length <= 50 ?
            (
                this.setState({
                    editName: newName
                })
            )
            :
            (
                toast.error('Playlist name too long!', {
                    toastId: "playlistName-toast",
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    className: "toast-complete"
                })
            )
    }
    handleOnChangeLinkEdit = (e) => {
        const newLink = e.target.value;
        newLink.trim().length <= 200 ?
            (
                this.setState({
                    editLink: newLink
                })
            )
            :
            (
                toast.error('Playlist link too long!', {
                    toastId: "playlistName-toast",
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    className: "toast-complete"
                })
            )
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
    handleCheckFormat = (url) => {
        const URL = url.trim();
        const playlistRegex = /[?&]list=([A-Za-z0-9_-]{10,})/;
        const videoRegex = /(?:v=|\/videos\/|embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/;

        return playlistRegex.test(URL) || videoRegex.test(URL);
    }
    handleOnAdd = async () => {
        if (this.handleCheckFormat(this.state.playlistLink) === false) {
            toast.error("Invalid YouTube URL format.");
            return;
        }
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
            editID: this.state.listPlaylist[index].ID,

        })
    }
    handleOnEdit = async (ID) => {
        if (this.handleCheckFormat(this.state.editLink) === false) {
            toast.error("Invalid YouTube URL format.");
            return;
        }
        if (this.state.listPlaylist.some(
            item => item.playlistName.trim() === this.state.editName.trim() && item.ID !== this.state.editID
        )
        ) {
            toast.error("Please check the playlist name.");
            return;
        }
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
                this.setState({
                    editName: "",
                    editLink: "",
                    isEdit: false,
                    editingIndex: null,
                });
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
    handleOnResetTime = async () => {
        try {
            const res = await fetch('http://localhost:9999/backend/api/music/time/delete', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });
            if (res.ok) {
                this.setState({
                    editName: "",
                    editLink: "",
                    isEdit: false,
                    editingIndex: null,
                });
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
    render() {
        return (
            <div className="music-control">
                <div className="playlist-count">
                    <p>Total play time: </p>
                    <p className="time-count">{this.formatTime(this.state.playTime)}</p>
                    <button onClick={() => this.handleOnResetTime()}>
                        <RiResetLeftFill className="icon" />
                    </button>
                </div>
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
                    <div className="playlist-display">
                        {
                            this.state.listPlaylist.map((item, index) => {
                                const isEditing = this.state.editingIndex === index;
                                return (
                                    <div key={item.ID}>
                                        {isEditing ?
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