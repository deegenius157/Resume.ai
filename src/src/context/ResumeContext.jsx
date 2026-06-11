import React, { createContext, useContext, useState } from 'react';

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]); // Tracks dashboard document list
  const [currentResume, setCurrentResume] = useState({
    title: '',
    isPublic: false,
    accentColor: '#3b82f6',
    templateType: 'classic',
    personalInfo: { fullName: '', email: '', phone: '', location: '', profession: '', linkedin: '', website: '', profileImage: '' },
    objective: '',
    experience: [],
    education: [],
    projects: [],
    skills: []
  });

  const updatePersonalInfo = (fields) => {
    setCurrentResume(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, ...fields } }));
  };

  return (
    <ResumeContext.Provider value={{ resumes, setResumes, currentResume, setCurrentResume, updatePersonalInfo }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);