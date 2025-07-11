import React from 'react';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
class LiveFormComponent extends React.Component {
    state = {
        channelLink: '',
        title: '',
        visibility: "PUBLIC",
        isSubmit: null,
        ID: 0,
    }
    extractYouTubeUsername = (url) => {
        const regex = /^https?:\/\/(www\.)?youtube\.com\/(@[A-Za-z0-9_.-]+)\/?$/;
        const match = url.match(regex);
        return match ? match[2] : null;
    }
    handleSubmit = async () => {
        if (this.extractYouTubeUsername(this.state.channelLink) === null) {
            return toast.error("Invalid YouTube channel link. Please provide a valid link in the format: https://www.youtube.com/@username");
        }
        try {
            const res = await fetch('http://localhost:9999/backend/api/live/check', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    channelLink: this.extractYouTubeUsername(this.state.channelLink),
                    Title: this.state.title,
                    Visibility: this.state.visibility,

                }),
                credentials: 'include'
            })
            console.log("res", res);
            const data = await res.json();

            if (res.ok && data.response) {
                this.setState({
                    channelLink: '',
                    title: '',
                    visibility: "PUBLIC",
                    isSubmit: `/live/detail/${data.response}`,
                });
                toast.success("Channel success");
            } else {
                toast.error(data.error);

            }
        }
        catch (er) {
            this.setState({ message: "Cannot connect to the server." });
            console.log("server error!", er);
        }
    }
    render() {
        if (this.state.isSubmit) {
            return (<Navigate to={this.state.isSubmit} />)
        }
        return (
            <div>
                <input type='text' placeholder='Link' value={this.state.channelLink}
                    onChange={(e) => { this.setState({ channelLink: e.target.value }) }} />
                <input type='text' placeholder='title' value={this.state.title}
                    onChange={(e) => { this.setState({ title: e.target.value }) }} />
                <select value={this.state.visibility} onChange={(e) => { this.setState({ visibility: e.target.value }) }}>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                </select>
                <button onClick={() => this.handleSubmit()}>Submit</button>
            </div>
        )
    }

}
export default LiveFormComponent;