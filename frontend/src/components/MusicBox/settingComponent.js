import React from "react";
class SettingComponent extends React.Component {
    state = {
        playlistName: "",
        playlistLink: ""
    }
    render() {
        return (
            <div className="music-control">
                <div className="playlist-name">
                    <input type="text" placeholder="playlist name " value={this.state.playlistName} onChange={(e) => { this.setState({ playlistName: e.target.value }) }} />
                    <button>
                        check
                    </button>
                </div>
                <div className="playlist-link">
                    <input type="text" placeholder="playlist link" value={this.state.playlistLink} onChange={(e) => { this.setState({ playlistLink: e.target.value }) }} />
                    <button>
                        Add
                    </button>
                </div>
                <div className="playlist-list">
                    <input type="text" placeholder="playlist 1" />
                    <input type="text" placeholder="link 1" />
                    <button>
                        edit
                    </button>
                    <button>
                        remove
                    </button>

                </div>
                <div className="post-button">
                    <button onClick={this.handleSubmit} style={{ backgroundColor: "lightgreen" }}>Create</button>
                    <button style={{ backgroundColor: "lightcoral" }} onClick={this.handleCancel}>Cancel</button>
                </div>
            </div>
        )
    }
}
export default SettingComponent;