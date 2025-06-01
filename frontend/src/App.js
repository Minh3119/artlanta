import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserProfile from './pages/UserProfile';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App; 