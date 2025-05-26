//import logo from './logo.svg';
import "../styles/App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProfileComponent from "../components/UserProfileEdit/userProfileComponent";
import UserProfilePage from "../pages/ArtistExplore.js";
import NotificationPopup from "../components/Notification/NotificationPopup.jsx";
import { NotificationProvider } from "../components/Notification/NotificationContext.jsx";

function App() {
  
  return (
    <NotificationProvider>
      <NotificationPopup />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<UserProfileComponent />} />
          <Route path="/user" element={<UserProfilePage />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
