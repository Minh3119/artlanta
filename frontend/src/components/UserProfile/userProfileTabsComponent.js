import React from "react";
import { Link, NavLink } from "react-router-dom";
class UserProfileTabsComponent extends React.Component {
    render() {

        return (

            <div className="profile-left">
                <div className="profile-item" onClick={() => this.props.handleTabChange("profileTab")}
                    style={this.props.tab === "profileTab" ? { backgroundColor: "aqua" } : {}}>
                    <NavLink to="/editprofile" activeClassName="active">Profile</NavLink>
                </div>
                <div className="profile-item" onClick={() => this.props.handleTabChange("passwordTab")}
                    style={this.props.tab === "passwordTab" ? { backgroundColor: "aqua" } : {}}>
                    <NavLink to="/editpassword" activeClassName="active">Password</NavLink>
                </div>
                <div className="profile-item" onClick={() => this.props.handleTabChange("notificationTab")}
                    style={this.props.tab === "notificationTab" ? { backgroundColor: "aqua" } : {}}>
                    <NavLink to="/editnotification" activeClassName="active">Notification</NavLink>
                </div>
                <div className="profile-item" onClick={() => this.props.handleTabChange("pricingTab")}
                    style={this.props.tab === "pricingTab" ? { backgroundColor: "aqua" } : {}}>
                    <NavLink to="/editpricing" activeClassName="active">Pricing</NavLink>
                </div>
                <div className="profile-delete profile-item" onClick={() => this.props.handleTabChange("deleteTab")}
                    style={this.props.tab === "deleteTab" ? { backgroundColor: "red" } : {}}>
                    Delete your account
                </div>

            </div>
        )
    }
}
export default UserProfileTabsComponent;