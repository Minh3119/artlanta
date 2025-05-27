import React from "react";

import UserProfileTabsComponent from "./userProfileTabsComponent";
import EditProfileComponent from "./editProfileComponent";
import EditPasswordComponent from "./editPasswordComponent";
import EditNotificationComponent from "./editNotificationComponent";
import EditPricingComponent from "./editPricingComponent";

// import { toast } from "react-toastify";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";


class UserSettingComponent extends React.Component {
    componentDidMount() {
        // GET data tu sever

    }
    render() {


        return (
            <Router>
                <div className="user-profile-container">
                    <div className="user-control">
                        <UserProfileTabsComponent />
                        <Routes>
                            <Route path="/"
                                element={<div>hello</div>} />
                            <Route path="/editprofile"
                                element={<EditProfileComponent />} />
                            <Route path="/editpassword"
                                element={<EditPasswordComponent />} />
                            <Route path="/editnotification"
                                element={<EditNotificationComponent />} />
                            <Route path="/editpricing"
                                element={<EditPricingComponent />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        );
    }
}
export default UserSettingComponent;