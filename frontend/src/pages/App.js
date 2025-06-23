//import logo from './logo.svg';
import React, { useState } from "react";
import '../styles/App.scss';
import '../styles/post.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserProfilePage from "./UserProfile.js"
import CurrentUserProfilePage from "./CurrentUserProfilePage.js"
import Artists from "./Artists.js"
import CreatePostComponent from '../components/PostControl/createPostComponent.js';
import HomePage from './HomePage.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import UpdatePostComponent from '../components/PostControl/updatePostComponent.js';
import DeletePostComponent from '../components/PostControl/deletePostComponent.js';
import Login from './Login.js';
import Register from './Register.js';
import PassForget from './PassForget.js';
import PostListPage from "./Post.js"
import PostDetail from './PostDetail.js';
import MessagesPage from './Messages.js';
import EventPage from './EventPage.js';

import MusicComponent from '../components/MusicBox/musicComponent.js';
import { FiHeadphones } from "react-icons/fi";
import { set } from 'date-fns';
import Payment from './Payment.js';
import PaymentSuccess from '../components/Payment/PaypalPaymentSucess.js';
import RecentPosts from './RecentPosts';
import { ImOffice } from "react-icons/im";

function App() {
  const [isMusicOpen, setIsMusicOpen] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:id" element={<UserProfilePage />} />
          <Route path="/profile" element={<CurrentUserProfilePage />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/createpost" element={<CreatePostComponent />} />
          <Route path="/editpost" element={<UpdatePostComponent />} />
          <Route path="/deletepost" element={<DeletePostComponent />} />
          <Route path="/music" element={<MusicComponent />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget" element={<PassForget />} />
          <Route path="/post" element={<PostListPage />} />
          <Route path="/post/:postID" element={<PostDetail />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/recent-posts" element={<RecentPosts />} />
          <Route path="/event" element={<EventPage />} />
        </Routes >
        <MusicComponent setIsMusicOpen={setIsMusicOpen}
          isMusicOpen={isMusicOpen}
        />
        {
          isMusicOpen ?
            null
            :
            <div className="floating-icon" onClick={() => setIsMusicOpen(!isMusicOpen)}>
              <FiHeadphones />
            </div>

        }

      </BrowserRouter >
      <ToastContainer />
    </>

  );
}

export default App;
