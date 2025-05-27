import React from "react";
import { NavLink } from "react-router-dom";
class UserProfileTabsComponent extends React.Component {
    render() {

        return (

            <div className="profile-left">
                <NavLink to="/editprofile" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Profile</NavLink>
                <NavLink to="/editpassword" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Password</NavLink>
                <NavLink to="/editnotification" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Notification</NavLink>
                <NavLink to="/editpricing" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Pricing</NavLink>
                <div className="profile-item profile-delete" onClick={() => console.log("Delete acc")}>
                    <div className="profile-item" onClick={() => this.props.handleTabChange("profileTab")}
                        style={this.props.tab === "profileTab" ? { backgroundColor: "aqua" } : {}}>
                        Profile
                    </div>
                    <div className="profile-item" onClick={() => this.props.handleTabChange("passwordTab")}
                        style={this.props.tab === "passwordTab" ? { backgroundColor: "aqua" } : {}}>
                        Password
                    </div>
                    <div className="profile-item" onClick={() => this.props.handleTabChange("notificationTab")}
                        style={this.props.tab === "notificationTab" ? { backgroundColor: "aqua" } : {}}>
                        Notification
                    </div>
                    <div className="profile-item" onClick={() => this.props.handleTabChange("pricingTab")}
                        style={this.props.tab === "pricingTab" ? { backgroundColor: "aqua" } : {}}>
                        Pricing
                    </div>
                    <div className="profile-delete profile-item" onClick={() => this.props.handleTabChange("deleteTab")}
                        style={this.props.tab === "deleteTab" ? { backgroundColor: "red" } : {}}>
                        Delete your account
                    </div>

                </div>
            </div>
        );
    }
}
export default UserProfileTabsComponent;
