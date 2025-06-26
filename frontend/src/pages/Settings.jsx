import React from "react";
import UserProfileTabsComponent from "../components/UserProfileEdit/userProfileTabsComponent";
import { Outlet } from "react-router-dom";

const Settings = () => (
  <div className="user-profile-container">
    <div className="user-control">
      <UserProfileTabsComponent />
      <Outlet />
    </div>
  </div>
);

export default Settings;
