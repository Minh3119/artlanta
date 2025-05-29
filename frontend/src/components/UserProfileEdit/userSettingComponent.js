import React from "react";
import UserProfileTabsComponent from "./userProfileTabsComponent";
import { Outlet, Routes, Route } from "react-router-dom";
import "../../styles/userProfile.scss";


//components
import EditProfileComponent from './editProfileComponent';
import EditPasswordComponent from './editPasswordComponent';
import EditNotificationComponent from './editNotificationComponent';
import EditPricingComponent from './editPricingComponent';
import DeleteAccountComponent from "./deleteAccountComponent";

class UserSettingComponent extends React.Component {
    componentDidMount() {
        // GET data from server
    }

    render() {
        return (
            <div className="user-profile-container">
                <div className="user-control">
                    <UserProfileTabsComponent />
                    {/* <Outlet /> */}
                    <Routes>
                        <Route path="editprofile" element={<EditProfileComponent />} />
                        <Route path="editpassword" element={<EditPasswordComponent />} />
                        <Route path="editnotification" element={<EditNotificationComponent />} />
                        <Route path="editpricing" element={<EditPricingComponent />} />
                        <Route path="deleteaccount" element={<DeleteAccountComponent />} />
                    </Routes>

                </div>
            </div>
        );
    }
}

export default UserSettingComponent;