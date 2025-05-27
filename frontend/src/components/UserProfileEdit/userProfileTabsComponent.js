import React from "react";
import { Link } from "react-router-dom";

import '../../styles/userProfile.scss';
class UserProfileTabsComponent extends React.Component {
    render() {

        return (

            <div className="profile-left">
                <Link to="editprofile" className="profile-item">
                    Profile
                </Link>
                <Link to="editpassword" className="profile-item">
                    Password
                </Link>
                <Link to="editnotification" className="profile-item">
                    Notification
                </Link>
                <Link to="editpricing" className="profile-item">
                    Pricing
                </Link>
                <Link to="deleteaccount" className="profile-item profile-delete">
                    Delete your account
                </Link>

            </div>
        );
    }
}
export default UserProfileTabsComponent;
