import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import IncidentDashboard from './components/IncidentDashboard';
import { getCurrentUser, logout, saveUser } from './utils/storageUtils';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      // Create demo users if they don't exist
      createDemoUsers();
    }
    setLoading(false);
  }, []);

  // Create demo users for testing
  const createDemoUsers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if demo users already exist
    if (users.length === 0) {
      saveUser({
        username: 'citizen',
        password: 'password123',
        role: 'citizen'
      });
      saveUser({
        username: 'responder',
        password: 'password123',
        role: 'responder'
      });
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleRegisterSuccess = () => {
    setAuthMode('login');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // Show auth forms if not logged in
  if (!currentUser) {
    return (
      <div className="App">
        {authMode === 'login' ? (
          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        ) : (
          <RegisterForm
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
      </div>
    );
  }

  // Show dashboard if logged in
  return (
    <div className="App">
      <IncidentDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;
