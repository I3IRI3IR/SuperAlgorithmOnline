import React from 'react';
import './Login.css'; 

const Login = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/discord';
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">歡迎使用 Discord 登入</h2>
                <p className="login-description">點擊下方按鈕以使用 Discord 帳號登入</p>
                <button className="login-button" onClick={handleLogin}>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png"
                        alt="Discord Icon"
                        className="login-button-icon"
                    />
                    登入 Discord
                </button>
            </div>
        </div>
    );
};

export default Login;
