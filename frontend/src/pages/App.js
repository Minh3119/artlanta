//import logo from './logo.svg';
import '../styles/App.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserProfileComponent from "../components/UserProfileEdit/userProfileComponent";
import UserProfilePage from "../pages/ArtistExplore.js"
//import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<UserProfileComponent/>} />
        <Route path="/user" element={<UserProfilePage/>} />
      </Routes>
    </BrowserRouter>
    //<Router>
    //    <Route exact path="/" element={<UserProfileComponent/>} />
    //    <Route path="/user" element={<UserProfilePage/>} />
    //</Router>
    //<div className="App">
    //  <header className="App-header">
    //    {/* <HomeComponent /> */}
    //    <UserProfileComponent />
    //  </header>
    //  <ToastContainer />
    //</div>
  );
}

export default App;
