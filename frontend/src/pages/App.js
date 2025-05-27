//import logo from './logo.svg';
import '../styles/App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserProfileComponent from "../components/UserProfileEdit/userProfileComponent";
import UserProfilePage from "./UserProfile.js"
import SessionTest from "../pages/SessionTest.js"
import Artists from "./Artists.js"
import CreatePostComponent from '../components/PostControl/createPostComponent.js';
//import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<UserProfileComponent/>} />
        <Route path="/user/:userId" element={<UserProfilePage/>} />
        <Route path="/sessiontest" element={<SessionTest/>} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/post" element={<CreatePostComponent/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
