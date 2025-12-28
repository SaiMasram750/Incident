import React, { useState } from 'react';
import { saveUser } from '../utils/storageUtils';
import './AuthForms.css';

const RegisterForm = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'citizen'
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

    if (formData.username.length < 3) {
      showMessage('Username must be at least 3 characters', 'error');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      showMessage('Password is required', 'error');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      showMessage('Password must be at least 6 characters', 'error');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showMessage('Passwords do not match', 'error');
      setLoading(false);
      return;
    }

    // Try to save user
    const success = saveUser({
      username: formData.username,
      password: formData.password,
      role: formData.role
    });

    if (success) {
      showMessage('Registration successful! Please login.', 'success');
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'citizen'
      });
      
      // Call callback after 1.5 seconds
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } else {
      showMessage('Username already exists. Please choose another.', 'error');
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
        <h2>Create Account</h2>
        <p className="form-subtitle">Register as a citizen or responder</p>

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
              placeholder="Enter username (min 3 characters)"
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
              placeholder="Enter password (min 6 characters)"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="citizen">Citizen - Report incidents</option>
              <option value="responder">Responder - Update incident status</option>
            </select>
            <p className="role-description">
              {formData.role === 'citizen'
                ? 'Citizens can report new incidents'
                : 'Responders can update incident status and verify incidents'}
            </p>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
