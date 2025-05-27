//import logo from './logo.svg';
import '../styles/App.scss';
import '../styles/createPost.scss';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserSettingComponent from '../components/UserProfileEdit/userSettingComponent.js';
import UserProfilePage from "../pages/ArtistExplore.js"
import CreatePostComponent from "../components/PostControl/createPostComponent.js";

//import { ToastContainer } from 'react-toastify';

function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route exact path="/home" element={<UserSettingComponent />} />
    //     <Route path="/user" element={<UserProfilePage />} />
    //     <Route path="/createpost" element={<CreatePostComponent />} />
    //     <Route path="/home/editprofile"
    //       element={<EditProfileComponent />} />
    //     <Route path="/editpassword"
    //       element={<EditPasswordComponent />} />
    //     <Route path="/editnotification"
    //       element={<EditNotificationComponent />} />
    //     <Route path="/editpricing"
    //       element={<EditPricingComponent />} />
    //   </Routes>
    // </BrowserRouter >

    // <CreatePostComponent />
    <>
      {/* <UserSettingComponent /> */}
      <CreatePostComponent />
      <ToastContainer />
    </>

  );
}

export default App;
