import React from "react";

import UserProfileTabsComponent from "./userProfileTabsComponent";
import EditProfileComponent from "./editProfileComponent";
import EditPasswordComponent from "./editPasswordComponent";
import EditNotificationComponent from "./editNotificationComponent";
import EditPricingComponent from "./editPricingComponent";


import "../../styles/userProfile.scss";

import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

class UserSettingComponent extends React.Component {
    state = {
        user: {
            name: "Ndluong",
            gender: "Male",
            email: "ndluong1903@gmail.com",
            social: [{
                platform: "Github",
                link: "https://github.com/Natlife",
            }],
            bio: "I am a software engineer with a passion for web development.",
        },
        tab: "profileTab",
    }

    componentDidMount() {
        // GET data tu sever

    }
    handleTabChange = (newTab) => {
        this.setState({ tab: newTab });
    }
    render() {

        if (!this.state.user) {
            return (
                <div className="user-profile-container">
                    <div className="user-profile">Loading...</div>
                </div>
            );
        }

        return (
            <Router>
                <div className="user-profile-container">
                    <div className="user-profile">
                        <UserProfileTabsComponent
                            tab={this.state.tab}
                            handleTabChange={this.handleTabChange}
                        />
                        <Routes>
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