import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './Login';
import Game from './Game';
import reportWebVitals from './reportWebVitals';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null: 尚未檢查, true: 已登入, false: 未登入

  useEffect(() => {
    // 向伺服器請求 session 資料
    fetch('http://localhost:5000/session-check', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        if (data.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error('Error checking session:', error);
        setIsLoggedIn(false);
      });
  }, []);

  // 當 `isLoggedIn` 為 `null` 時顯示加載狀態
  if (isLoggedIn === null) {
    return <div>正在檢查登入狀態...</div>;
  }

  // 根據 `isLoggedIn` 狀態選擇渲染的組件
  return isLoggedIn ? <Game /> : <Login />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
