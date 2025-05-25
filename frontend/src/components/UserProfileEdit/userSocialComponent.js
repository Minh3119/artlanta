import React from "react";

class UserSocialComponent extends React.Component {
    state = {
        newLink: "",
        newPlatform: "",
        isAdd: false,
    }
    render() {
        return (
            <div className="social-container">
                <div className="social-header">
                    <p className="profile-detail-title">Social</p>
                    <button onClick={() => this.setState({ isAdd: !this.state.isAdd })}>+</button>
                </div>
                <div className="social-add-container">
                    {
                        this.state.isAdd ?
                            <div className="social-add">
                                <input type="text" placeholder="Platform"
                                    className="social-platform" value={this.state.newPlatform}
                                    onChange={(event) => this.setState({ newPlatform: event.target.value })} />
                                <input type="text" placeholder="Link"
                                    className="social-link" value={this.state.newLink}
                                    onChange={(event) => this.setState({ newLink: event.target.value })} />
                                <button onClick={() => this.props.handleAddSocial(this.state.newPlatform, this.state.newLink)}>Add</button>
                            </div>
                            :
                            null
                    }
                </div>
                <ul className="social-list">
                    {

                        this.props.social.map((item, index) => {

                            return (
                                <li key={index}>
                                    <a href={item.Link}>{item.Platform}</a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        )
    }
}
export default UserSocialComponent;