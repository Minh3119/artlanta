//import logo from './logo.svg';
import React, { useState } from "react";
import "../styles/App.scss";
import "../styles/post.scss";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProfilePage from "./UserProfile.js";
import CurrentUserProfilePage from "./CurrentUserProfilePage.js";
import Artists from "./Artists.js";
import CreatePostComponent from "../components/PostControl/createPostComponent.js";
import HomePage from "./HomePage.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import UpdatePostComponent from "../components/PostControl/updatePostComponent.js";
import DeletePostComponent from "../components/PostControl/deletePostComponent.js";
import Login from "./Login.js";
import Register from "./Register.js";
import PassForget from "./PassForget.js";
import PostListPage from "./Post.js";
import PostDetail from "./PostDetail.js";
import MessagesPage from "./Messages.js";
import SavedPostPage from './SavedPostPage.js';
import MusicComponent from "../components/MusicBox/musicComponent.js";
import { FiHeadphones } from "react-icons/fi";
//import { set } from 'date-fns';
import Payment from "./Payment.js";
import PaymentHis from "./HistoryPayment.js";
import PaymentResult from "./PaymentResult.js";
import AdminDashboard from "./AdminDashboard";
import EventPage from "./EventPage.js";
import RecentPosts from "./RecentPosts";
import UserStatistics from "./UserStatistics.jsx";
import { WebSocketProvider } from "../contexts/WebSocketContext";
import Settings from "./Settings.jsx";
import EditProfileComponent from "../components/UserProfileEdit/editProfileComponent";
import CommissionRequestForm from "../components/Commission/CommissionRequestForm";
import EditPasswordComponent from "../components/UserProfileEdit/editPasswordComponent";
import EditNotificationComponent from "../components/UserProfileEdit/editNotificationComponent";
import EditPricingComponent from "../components/UserProfileEdit/editPricingComponent";
import DeleteAccountComponent from "../components/UserProfileEdit/deleteAccountComponent";
import LiveDetailComponent from "../components/LiveStream/liveDetailComponent.js";
import LivePageComponent from "../components/LiveStream/livePageComponent.js";
import LiveFormComponent from "../components/LiveStream/liveFormComponent.js";
import CommissionListPage from "./CommissionListPage.js";
import CommissionDetailPage from "./CommissionDetailPage.js";
import ArtistFormContainer from "../components/ArtistForm/ArtistFormContainer";
import EKYC from "./EKYCVerificationPage.js";
import Withdraw from "./Withdraw.js";
import EditProfile from "./EditProfile.js";
import CommissionDashboard from "./CommissionDashboard.js";
import ModeratorDashboard from "./ModeratorDashboard.js";
import ClientComDashboard from "./ClientComDashboard.js";
import CommissionRequestList from '../components/Commission/CommissionRequestList';
import ClientCommissionRequestList from '../components/Commission/ClientCommissionRequestList';
function App() {
  const [isMusicOpen, setIsMusicOpen] = useState(false);

  return (
    <WebSocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="/profile" element={<CurrentUserProfilePage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/createpost" element={<CreatePostComponent />} />
          <Route path="/editpost" element={<UpdatePostComponent />} />
          <Route path="/deletepost" element={<DeletePostComponent />} />
          <Route path="/music" element={<MusicComponent />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/passforget" element={<PassForget />} />
          <Route path="/post" element={<PostListPage />} />
          <Route path="/post/:postID" element={<PostDetail />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/post/:postID" element={<PostDetail />} />
           <Route path="/moddashboard" element={<ModeratorDashboard />} />
          <Route path="/payment" element={<Payment />}></Route>
          <Route path="/paymentHis" element={<PaymentHis />}></Route>
          <Route path="/paymentResult" element={<PaymentResult />}></Route>
          <Route path="/471408451d6070899bba1548031a2cf3/admin" element={<AdminDashboard />} />
          <Route path="/recent-posts" element={<RecentPosts />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/saved" element={<SavedPostPage />} />
          <Route path="/live" element={<LivePageComponent />} />
          <Route path="/live/form" element={<LiveFormComponent />} />
          <Route path="/account/:userId/stats" element={<UserStatistics />} />
          <Route path="/live/detail/:ID" element={<LiveDetailComponent />} />
          <Route path="/settings" element={<Settings />}>
            <Route path="editprofile" element={<EditProfileComponent />} />
            <Route path="editpassword" element={<EditPasswordComponent />} />
            <Route path="editnotification" element={<EditNotificationComponent />} />
            <Route path="editpricing" element={<EditPricingComponent />} />
            <Route path="deleteaccount" element={<DeleteAccountComponent />} />
          </Route>
          <Route path="/editprofile" element={<EditProfile />}></Route>
          <Route path="/artistPost" element={<ArtistFormContainer />}></Route>
          <Route path="/eKYC" element={<EKYC />}></Route>
          <Route path="/withdraw" element={<Withdraw />}></Route>
          <Route path="/request" element={<CommissionRequestForm />} />
          <Route path="/clientcomdashboard" element={<ClientComDashboard />}> 
              <Route path="request" element={<ClientCommissionRequestList />} />
            <Route path="commissions" element={<CommissionListPage />} />
            <Route path="commissions/:commissionId" element={<CommissionDetailPage />} />
            </Route>
           <Route path="/commissiondashboard" element={<CommissionDashboard />}>
            <Route path="request" element={<CommissionRequestList />} />
            <Route path="commissions" element={<CommissionListPage />} />
            <Route path="commissions/:commissionId" element={<CommissionDetailPage />} />
    </Route>
        </Routes >
       
        <MusicComponent
          setIsMusicOpen={setIsMusicOpen}
          isMusicOpen={isMusicOpen}
        />
        {
          isMusicOpen ? null : (
            <div
              className="floating-icon"
              onClick={() => setIsMusicOpen(!isMusicOpen)}
            >
              <FiHeadphones />
            </div>
          )
        }
      </BrowserRouter >
      <ToastContainer />
    </WebSocketProvider >
  );
}

export default App;
