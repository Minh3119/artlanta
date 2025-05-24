//import logo from './logo.svg';
import '../styles/App.scss';
import UserProfileComponent from "../components/UserProfile/userProfileComponent";
import PostComponent from "../components/ManagePost/PostComponent"
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <HomeComponent /> */}
        <PostComponent />
      </header>
      <ToastContainer />
    </div>
  );
}

export default App;
