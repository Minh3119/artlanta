import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class SessionTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      error: null,
    };
  }

  componentDidMount() {
    fetch('http://localhost:9999/backend/api/lastusername', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ username: data.response.lastusername });
        toast.success(`Last username was: ${data.response.lastusername}`);
      })
      .catch((error) => {
        this.setState({ error: error.message });
      });
  }

  render() {
    const { username, error } = this.state;

    return (
      <>
        <div>
          <h1>Last Username</h1>
          {error ? (
            <p>Error: {error}</p>
          ) : (
            <p>{username ? `Username: ${username}` : 'Loading...'}</p>
          )}
        </div>
        <ToastContainer />
      </>
    );
  }
}

export default SessionTest;
