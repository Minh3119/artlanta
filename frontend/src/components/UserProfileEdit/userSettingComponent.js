import React from "react";
import UserProfileTabsComponent from "./userProfileTabsComponent";
import { Outlet } from "react-router-dom";

// import { toast } from "react-toastify";

class UserSettingComponent extends React.Component {
    componentDidMount() {
        // GET data from server
    }
    
    render() {
        return (
            <div className="user-profile-container">
                <div className="user-control">
                    <UserProfileTabsComponent />
                    <Outlet />
                </div>
            </div>
        );
    }
}

export default UserSettingComponent;