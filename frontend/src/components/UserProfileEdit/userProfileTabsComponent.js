import React from "react";
import { NavLink } from "react-router-dom";

import '../../styles/userProfile.scss';
class UserProfileTabsComponent extends React.Component {
    render() {

        return (

            <div className="profile-left">
                <NavLink to="/editprofile" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Profile</NavLink>
                <NavLink to="/editpassword" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Password</NavLink>
                <NavLink to="/editnotification" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Notification</NavLink>
                <NavLink to="/editpricing" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Pricing</NavLink>
                <div className="profile-item profile-delete" onClick={() => console.log("Delete acc")}>
                    Delete your account
                </div>

            </div>
        );
    }
}
export default UserProfileTabsComponent;
