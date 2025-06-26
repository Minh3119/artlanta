import React from "react";
import { NavLink } from "react-router-dom";

import '../../styles/userProfile.scss';
class UserProfileTabsComponent extends React.Component {
    render() {

        return (

            <div className="profile-left">
                <NavLink to="/settings/editprofile" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Profile</NavLink>
                <NavLink to="/settings/editpassword" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Password</NavLink>
                <NavLink to="/settings/editnotification" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Notification</NavLink>
                <NavLink to="/settings/editpricing" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Pricing</NavLink>
                <NavLink to="/settings/deleteaccount" className={({ isActive }) => isActive ? "profile-item active" : "profile-item"}>Delete your account</NavLink>

            </div>
        );
    }
}
export default UserProfileTabsComponent;
