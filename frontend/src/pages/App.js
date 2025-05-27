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
          <Route path="/" element={<UserSettingComponent />}>
            <Route path="editprofile" element={<EditProfileComponent />} />
            <Route path="editpassword" element={<EditPasswordComponent />} />
            <Route path="editnotification" element={<EditNotificationComponent />} />
            <Route path="editpricing" element={<EditPricingComponent />} />
            <Route path="deleteaccount" element={<DeleteAccountComponent />} />
          </Route>
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/sessiontest" element={<SessionTest />} />
          <Route path="/createpost" element={<CreatePostComponent />} />
        </Routes>
      </BrowserRouter>
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
