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

  // Automatically sync to localStorage whenever the users array changes
  useEffect(() => {
    localStorage.setItem('resume_builder_users', JSON.stringify(users));
  }, [users]);

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
          />
        );

      case 'signup':
        return (
          <SignupView
            onNavigate={setCurrentView}
            users={users}
            setUsers={setUsers}
          />
        );
      case 'dashboard':
      case 'selection':
        return (
          <SelectionHub
            setCurrentView={setCurrentView}
            currentUser={users?.[users.length - 1]}
            setUploadedData={setUploadedData}
          />
        );
      case 'workspace':
        return (
          <WorkspaceContainer
            onNavigate={setCurrentView}
            initialData={uploadedData}
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
