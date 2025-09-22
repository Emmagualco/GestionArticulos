import React, { useState } from "react";
import "../App.css";

function LoginPanel({ onLogin, loginError }) {
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });

    function handleChange(e) {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        onLogin(loginForm);
    }

    return (
        <div className="login-panel">
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    id="login-username"
                    name="username"
                    type="text"
                    placeholder="Usuario"
                    value={loginForm.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                />
                <input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    value={loginForm.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                />
                <button type="submit" className="form-panel-button">Entrar</button>
            </form>
            {loginError && <div className="modal-error">{loginError}</div>}
        </div>
    );
}

export default LoginPanel;
