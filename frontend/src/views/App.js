//import logo from './logo.svg';
import '../styles/App.scss';
import UserSettingComponent from '../components/UserProfileEdit/userSettingComponent';
import CreatePostComponent from '../components/PostControl/createPostComponent';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <HomeComponent /> */}
        {/* <UserSettingComponent /> */}
        <CreatePostComponent />

      </header>
      <ToastContainer />
    </div>
  );
}

export default App;
