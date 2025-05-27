//import logo from './logo.svg';
import '../styles/App.scss';
import '../styles/createPost.scss';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserSettingComponent from '../components/UserProfileEdit/userSettingComponent.js';
import UserProfilePage from "./UserProfile.js"
import CreatePostComponent from "../components/PostControl/createPostComponent.js";
import EditProfileComponent from '../components/UserProfileEdit/editProfileComponent.js';
import EditPasswordComponent from '../components/UserProfileEdit/editPasswordComponent.js';
import EditNotificationComponent from '../components/UserProfileEdit/editNotificationComponent.js';
import EditPricingComponent from '../components/UserProfileEdit/editPricingComponent.js';
import DeleteAccountComponent from '../components/UserProfileEdit/deleteAccountComponent.js';

//import { ToastContainer } from 'react-toastify';

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserProfilePage />} />
          <Route path="/home/*" element={<UserSettingComponent />}>
            <Route path="editprofile" element={<EditProfileComponent />} />
            <Route path="editpassword" element={<EditPasswordComponent />} />
            <Route path="editnotification" element={<EditNotificationComponent />} />
            <Route path="editpricing" element={<EditPricingComponent />} />
            <Route path="deleteaccount" element={<DeleteAccountComponent />} />
          </Route>
          <Route path="/user" element={<UserProfilePage />} />
          <Route path="/createpost" element={<CreatePostComponent />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>

    // <CreatePostComponent />
    // <>
    //   {/* <UserSettingComponent /> */}
    //   <CreatePostComponent />
    //   <ToastContainer />
    // </>

  );
}

export default App;
