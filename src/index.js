// index.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Login from './Login';
import Game from './Game';
import reportWebVitals from './reportWebVitals';

const AuthRedirect = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    fetch('/session-check', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) {
    return <div>正在檢查登入狀態...</div>;
  }

  return isLoggedIn ? <Navigate to="/game" /> : <Navigate to="/login" />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/game" element={<Game />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
