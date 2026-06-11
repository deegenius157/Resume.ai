import React, { createContext, useContext, useState, useEffect } from 'react';

const ResumeContext = createContext();

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

export const ResumeProvider = ({ children }) => {
  const [currentResume, setCurrentResume] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      profession: '',
      photo: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  });

  const [activeTab, setActiveTab] = useState('Personal Info');
  const [isGenerating, setIsGenerating] = useState(false);

  const updatePersonalInfo = (info) => {
    setCurrentResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  const updateSummary = (summary) => {
    setCurrentResume((prev) => ({ ...prev, summary }));
  };

  // Modernized slice update helpers
  const addItem = (field, item) => {
    setCurrentResume((prev) => ({
      ...prev,
      [field]: [...prev[field], { ...item, id: Date.now() }],
    }));
  };

  const updateItem = (field, index, data) => {
    setCurrentResume((prev) => {
      const newList = [...prev[field]];
      newList[index] = { ...newList[index], ...data };
      return { ...prev, [field]: newList };
    });
  };

  const removeItem = (field, index) => {
    setCurrentResume((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const value = {
    currentResume,
    setCurrentResume,
    activeTab,
    setActiveTab,
    isGenerating,
    setIsGenerating,
    updatePersonalInfo,
    updateSummary,
    addItem,
    updateItem,
    removeItem,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};
