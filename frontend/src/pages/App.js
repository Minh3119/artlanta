//import logo from './logo.svg';
import '../styles/App.scss';
import '../styles/createPost.scss';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserSettingComponent from '../components/UserProfileEdit/userSettingComponent.js';
import UserProfilePage from "./UserProfile.js"
import SessionTest from "../pages/SessionTest.js"
import Artists from "./Artists.js"
import CreatePostComponent from '../components/PostControl/createPostComponent.js';
import HomePage from './HomePage.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EditProfileComponent from '../components/UserProfileEdit/editProfileComponent.js';
import EditPasswordComponent from '../components/UserProfileEdit/editPasswordComponent.js';
import EditNotificationComponent from '../components/UserProfileEdit/editNotificationComponent.js';
import EditPricingComponent from '../components/UserProfileEdit/editPricingComponent.js';
import DeleteAccountComponent from '../components/UserProfileEdit/deleteAccountComponent.js';
import Login from './Login.js';
import Register from './Register.js';

//import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<UserSettingComponent />}>

          </Route>
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/sessiontest" element={<SessionTest />} />
          <Route path="/createpost" element={<CreatePostComponent />} />
          <Route path="/homepage" element={<HomePage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
        </Routes>
      </BrowserRouter >
      <ToastContainer />
    </>

  );
}

export default App;
