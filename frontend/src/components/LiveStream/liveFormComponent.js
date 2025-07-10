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
    handleSumit = async () => {
        try {
            const res = await fetch('http://localhost:9999/backend/api/music/insert', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    channelLink: this.state.channelLink,
                    Title: this.state.title,
                    Visibility: this.state.visibility,

                }),
                credentials: 'include'
            })
                .then(async data => {
                    this.setState({
                        ID: data.response
                    })
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                })
                ;

            if (res.ok) {
                this.setState({
                    channelLink: '',
                    isSubmit: `/live/detail/${this.state.ID}`,
                });
                toast.success("Channel success");
            } else {
                toast.error(" error, try again later.");
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
                <input type='text' value={this.state.channelLink}
                    onChange={(e) => { this.setState({ channelLink: e.target.value }) }} />
                <button onClick={() => this.handleSubmit()}>Submit</button>
            </div>
        )
    }

}
export default LiveFormComponent;