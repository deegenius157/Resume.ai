import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ResumeProvider } from './context/ResumeContext';
import { WorkspaceContainer } from './components/Workspace/WorkspaceContainer';
import { LandingPage } from './components/Landing/LandingPage';
import { LoginView, SignupView } from './components/Auth/AuthViews';
import SelectionHub from './components/Hub/SelectionHub';
import { supabase } from './supabaseClient';
import JobsPage from './components/JobsPage';
import JobDetailsPage from './components/JobDetailsPage';
import BlogPage from './components/BlogPage';
import BlogDetailsPage from './components/BlogDetailsPage';
import AdminDashboard from './components/AdminDashboard';


const HomeView = ({ renderView, setCurrentView, currentUser }) => {
  useEffect(() => {
    const redirectToWorkspace = localStorage.getItem('redirect_to_workspace');
    if (redirectToWorkspace === 'true') {
      localStorage.removeItem('redirect_to_workspace');
      if (currentUser) {
        setCurrentView('workspace');
      } else {
        setCurrentView('login');
      }
    }
  }, [currentUser, setCurrentView]);

  return <div className="min-h-screen bg-white">{renderView()}</div>;
};

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);

  // Monitor Supabase auth state dynamically
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
    });

    // Listen to changes in auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      const redirectToWorkspace = localStorage.getItem('redirect_to_workspace');
      if (redirectToWorkspace === 'true') {
        localStorage.removeItem('redirect_to_workspace');
        setCurrentView('workspace');
      }
    }
  }, [currentUser]);

  const [uploadedData, setUploadedData] = useState(null);

  // 1. THE REFACTORED CONDITIONAL ROUTER (Nicely closed)
  const renderView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginView
            onNavigate={setCurrentView}
            setCurrentUser={setCurrentUser}
          />
        );

      case 'signup':
        return (
          <SignupView
            onNavigate={setCurrentView}
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView renderView={renderView} setCurrentView={setCurrentView} currentUser={currentUser} />} />
          
          {/* SEO Job Board & Blog routes */}
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailsPage />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </ResumeProvider>
  );
}

export default App;
