import React, { useState, useEffect } from 'react';
import { ResumeProvider } from './context/ResumeContext';
import { WorkspaceContainer } from './components/Workspace/WorkspaceContainer';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginView, SignupView } from './components/Auth/AuthViews';
import SelectionHub from './components/Hub/SelectionHub';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  // Persist users list using localStorage to survive reloads and HMR
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('resume_builder_users');
    if (savedUsers) {
      try {
        return JSON.parse(savedUsers);
      } catch (e) {
        console.error("Error parsing saved users:", e);
      }
    }
    // Default fallback account if storage is pristine
    return [{ fullName: "Uthman", email: "geniusuthman@gmail.com", password: "password123" }];
  });

  // Track active logged-in user
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('resume_builder_current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Error parsing current user:", e);
      }
    }
    return null;
  });

  // Automatically sync to localStorage whenever the users array changes
  useEffect(() => {
    localStorage.setItem('resume_builder_users', JSON.stringify(users));
  }, [users]);

  // Sync active user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('resume_builder_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('resume_builder_current_user');
    }
  }, [currentUser]);

  const [uploadedData, setUploadedData] = useState(null);

  // --- KEEP YOUR USESTATES / USEEFFECTS AT THE TOP HERE ---

  // 1. THE REFACTORED CONDITIONAL ROUTER (Nicely closed)
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginView
            onNavigate={setCurrentView}
            users={users}
            setUsers={setUsers}
            setCurrentUser={setCurrentUser}
          />
        );

      case 'signup':
        return (
          <SignupView
            onNavigate={setCurrentView}
            users={users}
            setUsers={setUsers}
            setCurrentUser={setCurrentUser}
          />
        );
      case 'dashboard':
      case 'selection':
        return (
          <SelectionHub
            setCurrentView={setCurrentView}
            currentUser={currentUser}
            setUploadedData={setUploadedData}
          />
        );
      case 'workspace':
        return (
          <WorkspaceContainer
            onNavigate={setCurrentView}
            initialData={uploadedData}
            currentUser={currentUser}
          />
        );
      default:
        return <LandingPage setCurrentView={setCurrentView} />;
    }
  };

  // 2. THE MAIN APP COMPONENT RETURN STATEMENT (Separate and clean)
  return (
    <ResumeProvider>
      <div className="min-h-screen bg-white">
        {renderView()}
      </div>
    </ResumeProvider>
  );
}

export default App;
