import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { enhanceTextWithAI } from '../../services/gemini';
import { Sparkles, ArrowRight, ArrowLeft, Download, Share2 } from 'lucide-react';

export const WorkspaceContainer = () => {
  const { currentResume, setCurrentResume, updatePersonalInfo } = useResume();
  const [activeStep, setActiveStep] = useState(0);

  const steps = ["Personal Info", "Summary", "Experience", "Education", "Projects", "Skills"];

  const handleAIEnhanceSummary = async () => {
    const result = await enhanceTextWithAI(currentResume.objective, "Summary");
    setCurrentResume(prev => ({ ...prev, objective: result }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Workspace Sub-Navbar Actions */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Document Workspace: <span className="text-emerald-600">{currentResume.title || 'Draft'}</span></h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition">
            <Share2 size={18} /> Public/Private Link
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm">
            <Download size={18} /> Download Asset
          </button>
        </div>
      </header>

      {/* Primary Split-Pane Viewport Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Modular Context Input Stepper Panel */}
        <div className="w-1/2 p-8 overflow-y-auto border-r bg-white">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-sm font-semibold tracking-wide uppercase text-emerald-600">Step {activeStep + 1} of {steps.length} — {steps[activeStep]}</span>
            <div className="flex gap-2">
              <button disabled={activeStep === 0} onClick={() => setActiveStep(p => p - 1)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50"><ArrowLeft size={16} /></button>
              <button disabled={activeStep === steps.length - 1} onClick={() => setActiveStep(p => p + 1)} className="p-2 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50"><ArrowRight size={16} /></button>
            </div>
          </div>

          {/* Conditional Steps Sub-Form Element Blocks */}
          {activeStep === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input type="text" value={currentResume.personalInfo.fullName} onChange={(e) => updatePersonalInfo({ fullName: e.target.value })} className="w-full rounded-lg border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Alex Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Profession / Target Title</label>
                <input type="text" value={currentResume.personalInfo.profession} onChange={(e) => updatePersonalInfo({ profession: e.target.value })} className="w-full rounded-lg border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Full Stack Developer" />
              </div>
              {/* Other structural text input elements extend identically below... */}
            </div>
          )}

          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-700">Professional Objective Summary</label>
                <button onClick={handleAIEnhanceSummary} className="flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1.5 rounded-md transition">
                  <Sparkles size={12} /> AI Enhance
                </button>
              </div>
              <textarea rows={6} value={currentResume.objective} onChange={(e) => setCurrentResume(prev => ({ ...prev, objective: e.target.value }))} className="w-full rounded-lg border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Write a compelling professional description statement..." />
            </div>
          )}
          
          {/* Subsequent experience/education item array mappers render downstream dynamically */}
        </div>

        {/* Right Side: Live Dynamic Resume CSS Template Canvas Render Sheet Preview */}
        <div className="w-1/2 p-8 bg-slate-200 overflow-y-auto flex justify-center items-start">
          <div id="printable-resume-canvas" className="w-[210mm] min-h-[297mm] bg-white shadow-xl p-12 text-slate-800 border" style={{ borderColor: currentResume.accentColor }}>
            {/* Template Header Profile Presentation Layout */}
            <div className="flex justify-between items-start border-b pb-6 mb-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight" style={{ color: currentResume.accentColor }}>{currentResume.personalInfo.fullName || "Your Name"}</h2>
                <p className="text-lg font-medium text-slate-500 mt-1">{currentResume.personalInfo.profession || "Target Profession"}</p>
              </div>
              {currentResume.personalInfo.profileImage && (
                <img src={currentResume.personalInfo.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-slate-200" />
              )}
            </div>

            {/* Document Body Layout Split Sections Grid */}
            <div className="space-y-6">
              {currentResume.objective && (
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Professional Summary</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{currentResume.objective}</p>
                </div>
              )}
              {/* Dynamic array looping views for experience, education, and skills maps directly to layout canvas blocks */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};