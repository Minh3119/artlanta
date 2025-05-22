//import logo from './logo.svg';
import '../styles/App.scss';
import UserSettingComponent from '../components/UserProfile/userSettingComponent';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <HomeComponent /> */}
        <UserSettingComponent />

      </header>
      <ToastContainer />
    </div>
  );
}

export default App;
