import React, { useRef, useState, useEffect } from 'react';
import { Trash2, FileText } from 'lucide-react';

export default function SelectionHub({ setCurrentView, currentUser, setView, setUploadedData }) {
  // Fallback name if the user state isn't fully synced yet
  const userName = currentUser?.name || "Uthman";
  const fileInputRef = useRef(null);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('saved_resumes');
    if (saved) {
      try {
        setResumes(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved resumes", e);
      }
    }
  }, []);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      const updated = resumes.filter(r => r.id !== id);
      setResumes(updated);
      localStorage.setItem('saved_resumes', JSON.stringify(updated));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        let parsedData = null;
        if (file.name.endsWith('.json')) {
          parsedData = JSON.parse(text);
        } else {
          // Parse plain text resume
          const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

          // 1. Extract Full Name (first line that has text and no metadata indicators)
          let name = "";
          for (const line of lines) {
            if (!line.includes(':') && !line.includes('@') && !line.includes('|') && line.length < 50) {
              name = line;
              break;
            }
          }

          // 2. Extract Email
          const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          const email = emailMatch ? emailMatch[0] : '';

          // 3. Extract Phone
          const phoneMatch = text.match(/\+?\d[\d\s\-()]{8,18}\d/);
          const phone = phoneMatch ? phoneMatch[0] : '';

          // 4. Extract Location
          let location = "";
          const locMatch = text.match(/(?:Location|Address|Base|City|Current Base):\s*([^|\n]+)/i);
          if (locMatch) {
            location = locMatch[1].trim();
          } else {
            const locLine = lines.find(l => l.toLowerCase().includes('location:'));
            if (locLine) {
              const parts = locLine.split(':');
              location = parts[1].split('|')[0].trim();
            }
          }

          // 5. Extract Job Title / Profession
          let jobTitle = "";
          const profMatch = text.match(/(?:Job Title|Profession|Role|Title):\s*([^|\n]+)/i);
          if (profMatch) {
            jobTitle = profMatch[1].trim();
          } else {
            const roleLine = lines.find(l => l.toLowerCase().includes('profession:') || l.toLowerCase().includes('role:'));
            if (roleLine) {
              jobTitle = roleLine.split(':')[1].trim();
            } else {
              // Search for common keyword indicators in first 5 lines
              for (let i = 0; i < Math.min(5, lines.length); i++) {
                const l = lines[i];
                if (/developer|tester|designer|engineer|specialist|manager|analyst|writer/i.test(l) && !l.includes(':')) {
                  jobTitle = l;
                  break;
                }
              }
            }
          }

          // 6. Extract Professional Summary / Background Statement
          let summary = "";
          const summaryRegex = /(?:PROFESSIONAL SUMMARY|SUMMARY|EXECUTIVE SUMMARY|PROFESSIONAL NARRATIVE)\s*\n+([\s\S]*?)(?=\n+(?:EXPERIENCE|WORK EXPERIENCE|CORE SKILLS|SKILLS|TECHNICAL SKILLS|EDUCATION|PROJECTS|CERTIFICATIONS|$))/i;
          const summaryMatch = text.match(summaryRegex);
          if (summaryMatch) {
            summary = summaryMatch[1].trim();
          } else {
            const paragraphs = text.split(/\n\s*\n+/);
            for (const p of paragraphs) {
              if (p.trim().length > 100 && !p.toLowerCase().includes('experience') && !p.toLowerCase().includes('education')) {
                summary = p.trim();
                break;
              }
            }
          }

          // 7. Extract Skills
          const skillsRegex = /(?:CORE SKILLS|SKILLS|TECHNICAL SKILLS)\s*\n+([\s\S]*?)(?=\n+(?:EXPERIENCE|WORK EXPERIENCE|EDUCATION|PROJECTS|CERTIFICATIONS|SUMMARY|$))/i;
          const skillsMatch = text.match(skillsRegex);
          let skills = [];
          if (skillsMatch) {
            skills = skillsMatch[1]
              .split(/[,\n•-]/)
              .map(s => s.trim())
              .filter(s => s.length > 1 && s.length < 35)
              .map(name => ({ name }));
          }

          // 8. Extract Experience
          const expRegex = /(?:EXPERIENCE|WORK EXPERIENCE)\s*\n+([\s\S]*?)(?=\n+(?:EDUCATION|PROJECTS|CERTIFICATIONS|CORE SKILLS|SKILLS|SUMMARY|$))/i;
          const expMatch = text.match(expRegex);
          let experience = [];
          if (expMatch) {
            const expBlocks = expMatch[1].split(/\n\s*\n+/).filter(Boolean);
            experience = expBlocks.map(block => {
              const blockLines = block.split('\n').map(l => l.trim()).filter(Boolean);
              if (blockLines.length === 0) return null;

              let company = "";
              let title = "";
              let dates = "";
              let description = blockLines.slice(1).join('\n');

              const titleMatch = blockLines[0].match(/^([^|-]+)(?:[|-]\s*)(.*)$/);
              if (titleMatch) {
                title = titleMatch[1].trim();
                company = titleMatch[2].trim();
              } else {
                title = blockLines[0];
              }
              return { company, title, dates, description };
            }).filter(Boolean);
          }

          // 9. Extract Education
          const eduRegex = /(?:EDUCATION)\s*\n+([\s\S]*?)(?=\n+(?:EXPERIENCE|WORK EXPERIENCE|PROJECTS|CERTIFICATIONS|CORE SKILLS|SKILLS|SUMMARY|$))/i;
          const eduMatch = text.match(eduRegex);
          let education = [];
          if (eduMatch) {
            const eduBlocks = eduMatch[1].split(/\n\s*\n+/).filter(Boolean);
            education = eduBlocks.map(block => {
              const blockLines = block.split('\n').map(l => l.trim()).filter(Boolean);
              if (blockLines.length === 0) return null;
              let school = blockLines[0];
              let degree = blockLines[1] || "";
              let dates = "";
              return { school, degree, dates };
            }).filter(Boolean);
          }

          parsedData = {
            fullName: name,
            email,
            phone,
            location,
            jobTitle,
            summary,
            skills,
            experience,
            education
          };
        }
        if (typeof setUploadedData === 'function') {
          setUploadedData(parsedData);
        }
        setCurrentView('workspace');
      } catch (err) {
        console.error("Error reading/parsing file:", err);
        alert("Failed to parse file. Please upload a valid JSON or text document.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 flex flex-col" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* NAVBAR */}
      <header className="border-b border-slate-100 px-12 py-4 flex items-center justify-between bg-white">
        <button
          className="flex items-center gap-1 font-extrabold text-xl tracking-tight text-black cursor-pointer focus:outline-none hover:opacity-85 transition"
          onClick={() => window.location.reload()}
        >
          resume.ai
        </button>

        <div className="flex items-center gap-6">
          <span className="text-xs font-semibold text-slate-500">Hi, {userName}</span>
          <button
            onClick={() => setCurrentView('landing')}
            className="border border-slate-200 text-slate-700 text-xs font-bold px-5 py-2 rounded-full hover:bg-slate-50 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* SELECTION BODY CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-12 pt-16 flex flex-col gap-8">
        
        {/* Header section */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">Dashboard</h2>
          <p className="text-xs font-black text-slate-400 mt-2 uppercase tracking-[0.2em] opacity-60">Manage your documents and career records</p>
        </div>

        {/* Grid and Action Cards */}
        <div className="space-y-8">
          <div className="flex flex-wrap gap-6 items-start justify-start">
            {/* CREATE RESUME CARD */}
            <button
              onClick={() => {
                setUploadedData(null);
                setCurrentView('workspace');
              }}
              className="w-44 h-56 bg-white border border-slate-100 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:border-slate-200 flex flex-col items-center justify-center gap-4 transition group text-center cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold shadow-sm shadow-blue-200 group-hover:scale-105 transition-transform">
                +
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition">
                Create Resume
              </span>
            </button>

            {/* UPLOAD EXISTING CARD */}
            <button
              onClick={() => {
                fileInputRef.current?.click();
              }}
              className="w-44 h-56 bg-white border border-slate-100 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:border-slate-200 flex flex-col items-center justify-center gap-4 transition group text-center cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center text-lg shadow-sm shadow-purple-200 group-hover:scale-105 transition-transform">
                ☁️
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition">
                Upload Existing
              </span>
            </button>
          </div>

          {/* History Grid */}
          {resumes.length > 0 && (
            <div className="space-y-6">
              <div className="border-t border-slate-100 pt-8">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Saved Resumes</h3>
                <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest opacity-60">Pick up editing from your past draft history</p>
              </div>
              
              <div className="flex flex-wrap gap-6 items-start justify-start">
                {resumes.map((resume) => (
                  <div key={resume.id} className="relative group w-44 h-56 bg-white border border-slate-100 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:border-slate-200 flex flex-col items-center justify-center gap-3 transition text-center cursor-pointer">
                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(resume.id);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition cursor-pointer z-10"
                    >
                      <Trash2 size={14} />
                    </button>

                    {/* Card Clickable Area */}
                    <div
                      onClick={() => {
                        const payload = resume.resumeData || resume.payload;
                        setUploadedData(payload);
                        setCurrentView('workspace');
                      }}
                      className="w-full h-full flex flex-col items-center justify-center p-4 gap-3"
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                        <FileText size={20} className="text-[#10B981]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-[11px] font-black text-slate-700 truncate max-w-[140px] uppercase tracking-wider">{resume.title}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          {resume.updatedAt ? `Updated on ${resume.updatedAt}` : resume.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,.txt"
          className="hidden"
        />

      </main>
    </div>
  );
}
