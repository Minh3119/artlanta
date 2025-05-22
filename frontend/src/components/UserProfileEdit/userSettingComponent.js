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
    withRouter
} from "react-router-dom";

class UserSettingComponent extends React.Component {
    state = {
        tab: "",
    }

    componentDidMount() {
        // GET data tu sever

    }
    // componentDidUpdate() {
    //     if (this.state.tab == "") {
    //         switch (this.props.location.pathname) {
    //             case "editprofile":
    //                 this.setState({ tab: "profileTab" });
    //                 break;
    //             case "editprofile":
    //                 this.setState({ tab: "passwordTab" });
    //                 break;
    //             case "editprofile":
    //                 this.setState({ tab: "notificationTab" });
    //                 break;
    //             case "editprofile":
    //                 this.setState({ tab: "pricingTab" });
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // }
    handleTabChange = (newTab) => {
        this.setState({ tab: newTab });
    }
    render() {


        return (
            <Router>
                <div className="user-profile-container">
                    <div className="user-control">
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