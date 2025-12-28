import React, { useState } from 'react';
import { login } from '../utils/storageUtils';
import './AuthForms.css';

const LoginForm = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.username.trim()) {
      showMessage('Username is required', 'error');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      showMessage('Password is required', 'error');
      setLoading(false);
      return;
    }

    // Try to login
    const user = login(formData.username, formData.password);

    if (user) {
      showMessage(`Welcome, ${user.username}!`, 'success');
      setFormData({
        username: '',
        password: ''
      });

      // Call callback after 1 second
      setTimeout(() => {
        onLoginSuccess(user);
      }, 1000);
    } else {
      showMessage('Invalid username or password', 'error');
    }

    setLoading(false);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>Login</h2>
        <p className="form-subtitle">Sign in to your account</p>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account?</p>
          <button
            type="button"
            className="btn-link"
            onClick={onSwitchToRegister}
            disabled={loading}
          >
            Create one now
          </button>
        </div>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials:</p>
          <div className="demo-item">
            <strong>Citizen:</strong> citizen / password123
          </div>
          <div className="demo-item">
            <strong>Responder:</strong> responder / password123
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
