import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'signup'

  const switchToSignup = () => {
    setCurrentView('signup');
  };

  const switchToLogin = () => {
    setCurrentView('login');
  };

  return (
    <div className="app">
      {currentView === 'login' ? (
        <Login onSwitchToSignup={switchToSignup} />
      ) : (
        <Signup onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default App;