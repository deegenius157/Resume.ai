import React, { useState, useEffect, useRef } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Sparkles, User, Briefcase, GraduationCap, Award, Trash2, Plus, Mail, Phone, MapPin, FileText, Wand2, Upload, LogOut, Palette, Grid3x2, Check, Download, ArrowLeft } from 'lucide-react';

export const WorkspaceContainer = ({ onNavigate, initialData, currentUser }) => {
  const { currentResume, setCurrentResume, updatePersonalInfo, addItem, updateItem, removeItem, updateSummary } = useResume();
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [themeColor, setThemeColor] = useState('#10b981');
  const [showAccentPicker, setShowAccentPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('classic_executive');
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileView, setMobileView] = useState('edit');
  const resumeCanvasRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      const mappedPersonalInfo = {
        fullName: initialData.personalInfo?.fullName || initialData.fullName || initialData.personalInfo?.name || initialData.name || '',
        profession: initialData.personalInfo?.profession || initialData.profession || initialData.personalInfo?.jobTitle || initialData.jobTitle || initialData.personalInfo?.role || initialData.role || '',
        email: initialData.personalInfo?.email || initialData.email || '',
        phone: initialData.personalInfo?.phone || initialData.phone || initialData.personalInfo?.contact || initialData.contact || '',
        location: initialData.personalInfo?.location || initialData.location || initialData.personalInfo?.base || initialData.base || '',
        website: initialData.personalInfo?.website || initialData.website || '',
        linkedin: initialData.personalInfo?.linkedin || initialData.linkedin || '',
        photo: initialData.personalInfo?.photo || initialData.photo || ''
      };

      if (initialData.themeColor) {
        setThemeColor(initialData.themeColor);
      }
      if (initialData.selectedTemplate) {
        setSelectedTemplate(initialData.selectedTemplate);
      }

      setCurrentResume((prev) => ({
        ...prev,
        id: initialData.id || prev.id || '',
        personalInfo: {
          ...prev.personalInfo,
          ...mappedPersonalInfo
        },
        summary: initialData.summary || prev.summary || '',
        experience: initialData.experience || prev.experience || [],
        education: initialData.education || prev.education || [],
        skills: initialData.skills || prev.skills || [],
        projects: initialData.projects || prev.projects || [],
        certifications: initialData.certifications || prev.certifications || [],
      }));
    }
  }, [initialData, setCurrentResume]);

  const tabs = [
    { name: 'Personal Info', icon: <User size={18} /> },
    { name: 'Summary', icon: <FileText size={18} /> },
    { name: 'Experience', icon: <Briefcase size={18} /> },
    { name: 'Education', icon: <GraduationCap size={18} /> },
    { name: 'Skills', icon: <Award size={18} /> }
  ];

  const handleAddNew = (type) => {
    const templates = {
      experience: { company: '', title: '', dates: '', description: '' },
      education: { school: '', degree: '', dates: '', gpa: '' },
      skills: { name: '' }
    };
    addItem(type.toLowerCase(), templates[type.toLowerCase()]);
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.body.appendChild(script);
    });
  };

  const handleSaveCurrentTabData = () => {
    try {
      const storageKey = currentUser?.email ? `saved_resumes_${currentUser.email.toLowerCase()}` : 'saved_resumes';
      const savedResumesRaw = localStorage.getItem(storageKey);
      let savedResumes = [];
      if (savedResumesRaw) {
        try {
          savedResumes = JSON.parse(savedResumesRaw);
        } catch (e) {
          console.error("Error parsing saved resumes", e);
        }
      }

      const resumeId = currentResume.id || `resume_${Date.now()}`;
      if (!currentResume.id) {
        setCurrentResume(prev => ({ ...prev, id: resumeId }));
      }

      const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
      const timestamp = `Updated on ${formattedDate}`;

      const title = currentResume.personalInfo.fullName 
        ? `${currentResume.personalInfo.fullName}'s Resume`
        : 'Untitled Resume';

      const resumeRecord = {
        id: resumeId,
        title: title,
        timestamp: timestamp,
        payload: {
          ...currentResume,
          id: resumeId,
          themeColor: themeColor,
          selectedTemplate: selectedTemplate
        }
      };

      const existingIdx = savedResumes.findIndex(r => r.id === resumeId);
      if (existingIdx > -1) {
        savedResumes[existingIdx] = resumeRecord;
      } else {
        savedResumes.unshift(resumeRecord);
      }

      localStorage.setItem(storageKey, JSON.stringify(savedResumes));
      alert("Progress saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving progress: " + err.message);
    }
  };

  const handleExportPDF = async () => {
    let styleRestorers = [];
    let tempStyle = null;
    let inlineStyleRestorers = [];
    let originalAdopted = null;
    try {
      setIsDownloading(true);

      // Streamlined auto-save inside the PDF handler
      const resumeId = currentResume.id || `resume_${Date.now()}`;
      if (!currentResume.id) {
        setCurrentResume(prev => ({ ...prev, id: resumeId }));
      }

      const newResumeRecord = {
        id: resumeId,
        title: document.querySelector('input[name="fullName"]')?.value || currentResume?.personalInfo?.fullName || 'My Resume',
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
        resumeData: {
          ...currentResume,
          id: resumeId,
          themeColor: themeColor,
          selectedTemplate: selectedTemplate
        }
      };

      const storageKey = currentUser?.email ? `saved_resumes_${currentUser.email.toLowerCase()}` : 'saved_resumes';
      const existingResumes = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const existingIdx = existingResumes.findIndex(r => r.id === resumeId);
      let updatedResumes;
      if (existingIdx > -1) {
        existingResumes[existingIdx] = newResumeRecord;
        updatedResumes = [...existingResumes];
      } else {
        updatedResumes = [newResumeRecord, ...existingResumes];
      }
      localStorage.setItem(storageKey, JSON.stringify(updatedResumes));

      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js');
      
      const element = resumeCanvasRef.current;

      const isSameOrigin = (url) => {
        if (!url) return false;
        try {
          const parsed = new URL(url, window.location.href);
          return parsed.origin === window.location.origin;
        } catch (e) {
          return false;
        }
      };

      const convertOklabToRgb = (l, a, bVal, alpha) => {
        const l_ = l + 0.3963377774 * a + 0.2158037573 * bVal;
        const m_ = l - 0.1055613458 * a - 0.0638541728 * bVal;
        const s_ = l - 0.0894841775 * a - 1.291485548 * bVal;

        const l_3 = l_ * l_ * l_;
        const m_3 = m_ * m_ * m_;
        const s_3 = s_ * s_ * s_;

        const rLin = 4.0767416621 * l_3 - 3.3077115913 * m_3 + 0.2309699292 * s_3;
        const gLin = -1.2684380046 * l_3 + 2.6097574011 * m_3 - 0.3413193965 * s_3;
        const bLin = -0.0041960863 * l_3 - 0.7034186147 * m_3 + 1.707614701 * s_3;

        const toSrgb = (x) => {
          if (x <= 0.0031308) return Math.max(0, x * 12.92);
          return Math.min(1, 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
        };

        const r = Math.round(toSrgb(rLin) * 255);
        const g = Math.round(toSrgb(gLin) * 255);
        const b = Math.round(toSrgb(bLin) * 255);

        if (alpha !== undefined && !isNaN(alpha)) {
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }
        return `rgb(${r}, ${g}, ${b})`;
      };

      const replaceOkColorWithRgb = (cssText) => {
        if (!cssText) return cssText;
        
        let result = cssText.replace(/oklch\(([^)]+)\)/gi, (match, inner) => {
          try {
            const parts = inner.replace(/[,/]/g, ' ').trim().split(/\s+/);
            if (parts.length < 3) return match;

            let lStr = parts[0];
            let cStr = parts[1];
            let hStr = parts[2];
            let aStr = parts[3];

            let l = parseFloat(lStr);
            if (lStr.endsWith('%')) l = l / 100;

            let c = parseFloat(cStr);
            if (cStr.endsWith('%')) c = c / 100;

            let h = 0;
            if (hStr !== 'none') {
              h = parseFloat(hStr);
              if (hStr.endsWith('deg')) h = parseFloat(hStr.slice(0, -3));
            }

            let alpha = undefined;
            if (aStr) {
              alpha = parseFloat(aStr);
              if (aStr.endsWith('%')) alpha = alpha / 100;
            }

            const hRad = (h * Math.PI) / 180;
            const a = c * Math.cos(hRad);
            const bVal = c * Math.sin(hRad);

            return convertOklabToRgb(l, a, bVal, alpha);
          } catch (e) {
            return '#ffffff';
          }
        });

        result = result.replace(/oklab\(([^)]+)\)/gi, (match, inner) => {
          try {
            const parts = inner.replace(/[,/]/g, ' ').trim().split(/\s+/);
            if (parts.length < 3) return match;

            let lStr = parts[0];
            let aStr = parts[1];
            let bStr = parts[2];
            let alphaStr = parts[3];

            let l = parseFloat(lStr);
            if (lStr.endsWith('%')) l = l / 100;

            let a = parseFloat(aStr);
            if (aStr.endsWith('%')) a = a / 100;

            let bVal = parseFloat(bStr);
            if (bStr.endsWith('%')) bVal = bVal / 100;

            let alpha = undefined;
            if (alphaStr) {
              alpha = parseFloat(alphaStr);
              if (alphaStr.endsWith('%')) alpha = alpha / 100;
            }

            return convertOklabToRgb(l, a, bVal, alpha);
          } catch (e) {
            return '#ffffff';
          }
        });

        return result;
      };

      // 1. Scan and find all stylesheets, including dynamic ones
      let combinedCss = '';
      const sheets = Array.from(document.styleSheets);

      for (const sheet of sheets) {
        if (!sheet.ownerNode) continue;
        const el = sheet.ownerNode;

        let cssText = '';
        let canRead = false;

        // Try CSSOM rules first (handles Vite/Tailwind dynamic stylesheets)
        try {
          if (sheet.cssRules) {
            cssText = Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
            canRead = true;
          }
        } catch (e) {
          // Cross-origin sheet rules are blocked by CORS
        }

        // Fallback to innerHTML for style tags
        if (!canRead && el.tagName === 'STYLE') {
          cssText = el.innerHTML;
          canRead = true;
        }

        // Fallback to fetch for same-origin links
        if (!canRead && el.tagName === 'LINK' && el.href) {
          if (isSameOrigin(el.href)) {
            try {
              const res = await fetch(el.href);
              if (res.ok) {
                cssText = await res.text();
                canRead = true;
              }
            } catch (fetchErr) {
              console.warn('Failed to fetch link stylesheet', el.href, fetchErr);
            }
          }
        }

        if (canRead && cssText) {
          const hasOkColor = cssText.includes('oklch') || cssText.includes('oklab');
          if (hasOkColor) {
            styleRestorers.push({
              element: el,
              parent: el.parentNode,
              nextSibling: el.nextSibling
            });
            combinedCss += cssText + '\n';
          }
        }
      }

      // Handle adoptedStyleSheets
      if (document.adoptedStyleSheets && document.adoptedStyleSheets.length > 0) {
        originalAdopted = Array.from(document.adoptedStyleSheets);
        for (const sheet of originalAdopted) {
          try {
            if (sheet.cssRules) {
              const cssText = Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
              if (cssText.includes('oklch') || cssText.includes('oklab')) {
                combinedCss += cssText + '\n';
              }
            }
          } catch (e) {
            // Ignore
          }
        }
        document.adoptedStyleSheets = [];
      }

      // 2. Remove oklch/oklab containing stylesheets from DOM
      styleRestorers.forEach(restore => {
        restore.element.remove();
      });

      // 3. Inject cleaned stylesheet tag into parent document
      const cleanCss = replaceOkColorWithRgb(combinedCss);
      tempStyle = document.createElement('style');
      tempStyle.id = 'temp-clean-styles';
      tempStyle.innerHTML = cleanCss;
      document.head.appendChild(tempStyle);

      // 4. Clean inline styles and attributes of parent DOM elements temporarily
      const targets = element.querySelectorAll('*');
      const allElements = [element, ...Array.from(targets)];
      allElements.forEach(el => {
        if (el.hasAttribute('style')) {
          const styleAttr = el.getAttribute('style');
          if (styleAttr.includes('oklch') || styleAttr.includes('oklab')) {
            inlineStyleRestorers.push({ element: el, type: 'style', original: styleAttr });
            el.setAttribute('style', replaceOkColorWithRgb(styleAttr));
          }
        }
        ['fill', 'stroke'].forEach(attr => {
          if (el.hasAttribute(attr)) {
            const val = el.getAttribute(attr);
            if (val.includes('oklch') || val.includes('oklab')) {
              inlineStyleRestorers.push({ element: el, type: attr, original: val });
              el.setAttribute(attr, replaceOkColorWithRgb(val));
            }
          }
        });
      });

      const options = {
        margin: [10, 10, 10, 10],
        filename: 'My_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false,
          letterRendering: true,
          onclone: (clonedDoc) => {
            // Remove all stylesheets from clonedDoc
            const existingStyles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
            existingStyles.forEach(styleEl => styleEl.remove());

            if (clonedDoc.adoptedStyleSheets) {
              clonedDoc.adoptedStyleSheets = [];
            }

            // Inject the clean styles
            const newStyle = clonedDoc.createElement('style');
            newStyle.innerHTML = cleanCss;
            clonedDoc.head.appendChild(newStyle);

            const clonedElements = clonedDoc.querySelectorAll('*');
            clonedElements.forEach(el => {
              if (el.hasAttribute('style')) {
                const styleAttr = el.getAttribute('style');
                if (styleAttr.includes('oklch') || styleAttr.includes('oklab')) {
                  el.setAttribute('style', replaceOkColorWithRgb(styleAttr));
                }
              }

              ['fill', 'stroke'].forEach(attr => {
                if (el.hasAttribute(attr)) {
                  const val = el.getAttribute(attr);
                  if (val.includes('oklch') || val.includes('oklab')) {
                    el.setAttribute(attr, replaceOkColorWithRgb(val));
                  }
                }
              });

              try {
                const view = el.ownerDocument.defaultView || window;
                const computedStyle = view.getComputedStyle(el);
                const colorProps = [
                  'backgroundColor', 'color', 'borderColor',
                  'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
                  'outlineColor', 'fill', 'stroke'
                ];
                colorProps.forEach(prop => {
                  if (computedStyle[prop] && (computedStyle[prop].includes('oklch') || computedStyle[prop].includes('oklab'))) {
                    el.style[prop] = replaceOkColorWithRgb(computedStyle[prop]);
                  }
                });
              } catch (computedErr) {
                // Ignore
              }
            });
          }
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      setTimeout(async () => {
        try {
          await window.html2pdf().set(options).from(element).save();
        } catch (pdfErr) {
          console.error(pdfErr);
          alert('PDF generation error: ' + pdfErr.message);
        } finally {
          if (tempStyle) tempStyle.remove();
          styleRestorers.forEach(restore => {
            if (restore.parent) {
              restore.parent.insertBefore(restore.element, restore.nextSibling);
            }
          });
          if (originalAdopted) {
            document.adoptedStyleSheets = originalAdopted;
          }
          inlineStyleRestorers.forEach(restore => {
            if (restore.type === 'style') {
              restore.element.setAttribute('style', restore.original);
            } else {
              restore.element.setAttribute(restore.type, restore.original);
            }
          });
          setIsDownloading(false);
        }
      }, 100);

    } catch (err) {
      console.error(err);
      alert('Failed to export PDF: ' + err.message);
      if (tempStyle) tempStyle.remove();
      styleRestorers.forEach(restore => {
        if (restore.parent) {
          restore.parent.insertBefore(restore.element, restore.nextSibling);
        }
      });
      if (originalAdopted) {
        document.adoptedStyleSheets = originalAdopted;
      }
      inlineStyleRestorers.forEach(restore => {
        if (restore.type === 'style') {
          restore.element.setAttribute('style', restore.original);
        } else {
          restore.element.setAttribute(restore.type, restore.original);
        }
      });
      setIsDownloading(false);
    }
  };

  const SaveActionBar = () => (
    <div className="flex justify-end items-center mt-12 border-t border-slate-100 pt-6">
      <button
        onClick={handleSaveCurrentTabData}
        className="bg-[#1e293b] hover:bg-[#10B981] text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 py-4 rounded-xl shadow-lg transition-all active:scale-95"
      >
        Save Changes
      </button>
    </div>
  );

  const handleAIEnhance = async (textToEnhance, type, setSummary) => {
    if (!textToEnhance || textToEnhance.trim() === "") {
      alert("Please type a short draft first so the AI has context to enhance!");
      return;
    }
    try {
      setIsEnhancing(true);

      const promptText = type === 'summary'
        ? "Act as an expert resume writer. Rewrite and drastically improve the following professional summary text to make it sound highly polished, impactful, and professional. \n\nCRITICAL REQUIREMENT: Return ONLY the single best rewritten paragraph. Do not include introductory text, do not include bullet points, do not list multiple options, and do not provide choices. Return only the final polished text itself:\n\n" + textToEnhance
        : "Act as an expert career coach. Rewrite the following job experience description to make it sound highly professional, action-oriented, and impactful for a resume.\n\nCRITICAL REQUIREMENT: Return ONLY a single polished version of the text. Do not provide multiple choices, do not say 'Here are some options:', and do not include any conversational filler. Return only the upgraded text:\n\n" + textToEnhance;

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

      // We use gemini-2.5-flash as the active model with fallback to gemini-1.5-flash if needed
      let response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: promptText
              }]
            }]
          })
      });

      let data = await response.json();

      if (data.error && data.error.code === 404) {
        // Fallback to gemini-1.5-flash
        const fallbackResponse = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: promptText
                }]
              }]
            })
        });
        data = await fallbackResponse.json();
      }

      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }

      const polishedText = data.candidates[0].content.parts[0].text;
      console.log(polishedText);

      if (polishedText) {
        const cleanText = polishedText.replace(/```json|```/g, '').trim();
        setSummary(cleanText);
      } else {
        throw new Error("AI refinement failed: Invalid response format.");
      }
    } catch (err) {
      alert("Network Error: " + err.message);
    } finally {
      setIsEnhancing(false);
    }
  };

  const setSummary = (enhancedText) => {
    updateSummary(enhancedText);
  };

  const handleTemplateChange = (layoutId) => {
    setSelectedTemplate(layoutId);
  };

  const renderClassicTemplate = () => (
    <div className="flex-1 space-y-12">
      {currentResume.summary && (
        <section>
          <h3 className="text-[12px] font-black text-slate-900 border-b-2 border-slate-100 pb-2 mb-4 uppercase tracking-[0.2em] flex justify-between items-center">
            Executive Summary 
            <span className="w-8 h-1 rounded-full" style={{ backgroundColor: themeColor, opacity: 0.2 }} />
          </h3>
          <p className="text-[11px] leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">{currentResume.summary}</p>
        </section>
      )}
      {currentResume.experience.length > 0 && (
        <section>
          <h3 className="text-[12px] font-black text-slate-900 border-b-2 border-slate-100 pb-2 mb-6 uppercase tracking-[0.2em] flex justify-between items-center">
            Experience 
            <span className="w-8 h-1 rounded-full" style={{ backgroundColor: themeColor, opacity: 0.2 }} />
          </h3>
          <div className="space-y-8">
            {currentResume.experience.map((exp, idx) => (exp.company || exp.title) && (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{exp.title}</h4>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">{exp.dates}</span>
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest mb-3" style={{ color: themeColor }}>{exp.company}</p>
                <p className="text-[11px] leading-relaxed text-slate-600 font-medium mt-3 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {currentResume.education.length > 0 && (
        <section>
          <h3 className="text-[12px] font-black text-slate-900 border-b-2 border-slate-100 pb-2 mb-6 uppercase tracking-[0.2em] flex justify-between items-center">
            Education 
            <span className="w-8 h-1 rounded-full" style={{ backgroundColor: themeColor, opacity: 0.2 }} />
          </h3>
          <div className="space-y-6">
            {currentResume.education.map((edu, idx) => (edu.school || edu.degree) && (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{edu.degree}</h4>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">{edu.dates}</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{edu.school}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {currentResume.skills.length > 0 && (
        <section>
          <h3 className="text-[12px] font-black text-slate-900 border-b-2 border-slate-100 pb-2 mb-4 uppercase tracking-[0.2em] flex justify-between items-center">
            Expertise 
            <span className="w-8 h-1 rounded-full" style={{ backgroundColor: themeColor, opacity: 0.2 }} />
          </h3>
          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 font-black text-slate-500 leading-tight">
            {currentResume.skills.map((skill, idx) => (
              <span key={idx} className="text-[9px] uppercase tracking-widest hover:text-slate-800 transition-colors flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }} />
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderModernTemplate = () => (
    <div className="flex flex-col flex-1 text-slate-800">
      {/* Modern Header - No colored banner, clean left-aligned layout */}
      <div className="border-b pb-8 mb-8 flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight uppercase" style={{ color: themeColor }}>
            {currentResume.personalInfo.fullName || 'YOUR NAME'}
          </h1>
          {currentResume.personalInfo.profession && (
            <p className="text-xs font-black tracking-[0.3em] uppercase text-slate-400">{currentResume.personalInfo.profession}</p>
          )}
        </div>
        
        {currentResume.personalInfo.photo && (
          <div 
            className="w-20 h-20 rounded-full border-2 shadow-md overflow-hidden shrink-0 ml-8 transition-all duration-300" 
            style={{ backgroundColor: themeColor, borderColor: themeColor }}
          >
            <img 
              src={currentResume.personalInfo.photo} 
              className="w-full h-full object-cover" 
              style={{ mixBlendMode: 'normal', filter: 'none' }} 
              alt="Profile" 
            />
          </div>
        )}
      </div>

      {/* Two-Column split body */}
      <div className="flex-1 flex gap-10">
        {/* Left Column (1/3) - Sidebar (Info & Education) */}
        <div className="w-1/3 space-y-8 border-r border-slate-100 pr-6">
          <section className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: themeColor }}>Contact</h4>
            <div className="space-y-2.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
              {currentResume.personalInfo.email && (
                <span className="flex items-center gap-2.5 truncate"><Mail size={12} className="opacity-60 shrink-0" style={{ color: themeColor }} />{currentResume.personalInfo.email}</span>
              )}
              {currentResume.personalInfo.phone && (
                <span className="flex items-center gap-2.5 truncate"><Phone size={12} className="opacity-60 shrink-0" style={{ color: themeColor }} />{currentResume.personalInfo.phone}</span>
              )}
              {currentResume.personalInfo.location && (
                <span className="flex items-center gap-2.5 truncate"><MapPin size={12} className="opacity-60 shrink-0" style={{ color: themeColor }} />{currentResume.personalInfo.location}</span>
              )}
              {currentResume.personalInfo.website && (
                <span className="flex items-center gap-2.5 truncate"><FileText size={12} className="opacity-60 shrink-0" style={{ color: themeColor }} />{currentResume.personalInfo.website}</span>
              )}
            </div>
          </section>

          {currentResume.education.length > 0 && (
            <section className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: themeColor }}>Education</h4>
              <div className="space-y-3.5">
                {currentResume.education.map((edu, idx) => (edu.school || edu.degree) && (
                  <div key={idx} className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-800 font-black truncate max-w-[70%]">{edu.degree}</span>
                      <span className="text-[8px] font-bold text-slate-400 shrink-0">{edu.dates}</span>
                    </div>
                    <div className="text-slate-400 font-bold mt-1">{edu.school}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (2/3) - Main Content */}
        <div className="w-2/3 space-y-8">
          {currentResume.summary && (
            <section className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] pb-1 border-b" style={{ color: themeColor }}>Summary</h4>
              <p className="text-[11px] leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">{currentResume.summary}</p>
            </section>
          )}

          {currentResume.experience.length > 0 && (
            <section className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] pb-1 border-b" style={{ color: themeColor }}>Experience</h4>
              <div className="space-y-6">
                {currentResume.experience.map((exp, idx) => (exp.company || exp.title) && (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <h5 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{exp.title}</h5>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{exp.dates}</span>
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: themeColor }}>{exp.company}</p>
                    <p className="text-[10px] leading-relaxed text-slate-600 font-medium mt-1 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {currentResume.skills.length > 0 && (
            <section className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] pb-1 border-b" style={{ color: themeColor }}>Skills</h4>
              <div className="flex flex-wrap gap-2 pt-2">
                {currentResume.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: themeColor }} />
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="flex flex-1 mx-[-3.5rem] my-[-3.5rem] min-h-[297mm]">
      {/* Colored Left Sidebar (1/3 of the layout) */}
      <div 
        className="w-[35%] p-10 text-white flex flex-col items-center justify-start gap-8 select-none transition-all duration-300" 
        style={{ backgroundColor: themeColor }}
      >
        {currentResume.personalInfo.photo ? (
          <div 
            className="w-28 h-28 rounded-full border-4 shadow-2xl overflow-hidden mt-4 shrink-0 transition-all duration-300"
            style={{ backgroundColor: themeColor, borderColor: themeColor }}
          >
            <img 
              src={currentResume.personalInfo.photo} 
              className="w-full h-full object-cover" 
              style={{ mixBlendMode: 'normal', filter: 'none' }} 
              alt="Profile" 
            />
          </div>
        ) : (
          <div 
            className="w-20 h-20 rounded-full border-4 flex items-center justify-center shrink-0 mt-4 text-white/90 transition-all duration-300"
            style={{ backgroundColor: themeColor, borderColor: themeColor }}
          >
            <User size={36} />
          </div>
        )}

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tight uppercase leading-none">{currentResume.personalInfo.fullName || 'YOUR NAME'}</h2>
          {currentResume.personalInfo.profession && (
            <p className="text-[9px] font-black tracking-[0.25em] uppercase text-white/80">{currentResume.personalInfo.profession}</p>
          )}
        </div>

        <div className="w-full h-px bg-white/20 my-2" />

        {/* Contact Info block inside sidebar */}
        <div className="w-full space-y-4 text-[9px] font-bold tracking-widest uppercase">
          <h4 className="text-[10px] font-black tracking-[0.2em] text-white/90 border-b border-white/10 pb-1.5">Info</h4>
          <div className="space-y-3 text-white/80">
            {currentResume.personalInfo.email && (
              <span className="flex items-center gap-2.5 truncate"><Mail size={12} className="text-white shrink-0" />{currentResume.personalInfo.email}</span>
            )}
            {currentResume.personalInfo.phone && (
              <span className="flex items-center gap-2.5 truncate"><Phone size={12} className="text-white shrink-0" />{currentResume.personalInfo.phone}</span>
            )}
            {currentResume.personalInfo.location && (
              <span className="flex items-center gap-2.5 truncate"><MapPin size={12} className="text-white shrink-0" />{currentResume.personalInfo.location}</span>
            )}
            {currentResume.personalInfo.website && (
              <span className="flex items-center gap-2.5 truncate"><FileText size={12} className="text-white shrink-0" />{currentResume.personalInfo.website}</span>
            )}
          </div>
        </div>

        {/* Education inside sidebar */}
        {currentResume.education.length > 0 && (
          <div className="w-full space-y-4 uppercase">
            <h4 className="text-[10px] font-black tracking-[0.2em] text-white/90 border-b border-white/10 pb-1.5">Education</h4>
            <div className="space-y-3.5 text-white/80">
              {currentResume.education.map((edu, idx) => (edu.school || edu.degree) && (
                <div key={idx} className="text-[9px] font-bold tracking-widest text-white/80">
                  <div className="flex justify-between items-baseline">
                    <span className="font-black text-white truncate max-w-[70%]">{edu.degree}</span>
                    <span className="text-[8px] opacity-60 text-white font-bold shrink-0">{edu.dates}</span>
                  </div>
                  <div className="text-[8px] text-white/70 mt-1">{edu.school}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content pane on the right (2/3 of the layout) */}
      <div className="w-[65%] p-12 bg-white flex flex-col gap-10">
        {currentResume.summary && (
          <section className="space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 border-slate-100 flex justify-between items-center" style={{ color: themeColor }}>
              Executive Summary
            </h3>
            <p className="text-[11px] leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">{currentResume.summary}</p>
          </section>
        )}

        {currentResume.experience.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 border-slate-100 flex justify-between items-center" style={{ color: themeColor }}>
              Experience
            </h3>
            <div className="space-y-6">
              {currentResume.experience.map((exp, idx) => (exp.company || exp.title) && (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{exp.title}</h4>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">{exp.dates}</span>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: themeColor }}>{exp.company}</p>
                  <p className="text-[10px] leading-relaxed text-slate-600 font-medium mt-1 whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {currentResume.skills.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 border-slate-100 flex justify-between items-center" style={{ color: themeColor }}>
              Expertise
            </h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {currentResume.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="text-[8px] font-black tracking-widest bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100 transition-all uppercase"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex bg-slate-50 overflow-hidden text-slate-800 font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Backdrop for mobile drawer */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 1. 🟢 SIDEBAR REBRANDED */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 flex flex-col p-6 gap-3 shrink-0 shadow-2xl transition-transform duration-300 transform md:translate-x-0 md:relative ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button
          onClick={() => {
            setIsMenuOpen(false);
            onNavigate('dashboard');
          }}
          className="flex items-center gap-1.5 px-2 mb-12 hover:opacity-85 transition cursor-pointer text-left focus:outline-none"
        >
          <div className="bg-[#10B981] p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase italic text-slate-100">
            resume.ai
          </span>
        </button>

        <nav className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-x-visible whitespace-nowrap md:whitespace-normal pb-2 md:pb-0 flex-1 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                setActiveTab(tab.name);
                setIsMenuOpen(false);
              }}
              className={`inline-flex md:flex items-center gap-3 text-left px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 shrink-0 ${activeTab === tab.name
                ? 'bg-[#10B981] text-white shadow-xl shadow-emerald-900/40 translate-x-0 md:translate-x-1'
                : 'text-slate-500 hover:bg-slate-800 hover:text-slate-100'
                }`}
            >
              <span className={activeTab === tab.name ? 'text-white' : 'text-slate-600'}>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>

        <button
          onClick={() => {
            setIsMenuOpen(false);
            onNavigate('landing');
          }}
          className="mt-auto flex items-center gap-3 px-5 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-red-500/10 hover:text-red-500 transition-all group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Logout
        </button>
      </div>

      {/* 2. 🟢 MIDDLE EDITOR REBRANDED */}
      <div className={`flex-1 bg-white p-6 md:p-12 overflow-y-auto shadow-inner border-r border-slate-100 pb-24 lg:pb-12 ${mobileView === 'edit' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'}`}>
        <div className="max-w-2xl mx-auto w-full">
          {/* Mobile Menu Top Bar */}
          <div className="flex items-center justify-between md:hidden mb-6">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 -ml-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-sm font-black uppercase tracking-widest text-[#10B981]">resume.ai</span>
          </div>

          {/* Back to Dashboard Link Button */}
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-800 text-xs font-bold uppercase tracking-widest transition-colors duration-200 mb-8 cursor-pointer focus:outline-none"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </button>

          <div className="flex items-center justify-between mb-12 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-[28px] font-black text-slate-900 uppercase tracking-tighter leading-none">{activeTab}</h2>
              <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-[0.2em] opacity-60">{activeTab === 'Summary' ? 'Craft your narrative' : 'Refine your career profile'}</p>
            </div>
            {activeTab === 'Summary' && (
              <button
                disabled={isEnhancing}
                onClick={() => handleAIEnhance(currentResume?.summary, 'summary', setSummary)}
                className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-[#10B981] border border-emerald-100 rounded-full hover:bg-[#10B981] hover:text-white transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                <Wand2 size={14} className={isEnhancing ? 'animate-spin' : ''} />
                {isEnhancing ? 'Enhancing...' : 'AI Enhance'}
              </button>
            )}
            {['Experience', 'Education'].includes(activeTab) && (
              <button
                onClick={() => handleAddNew(activeTab)}
                className="flex items-center gap-2 px-6 py-3 text-[10px] font-black bg-[#10B981] text-white rounded-full shadow-xl shadow-emerald-100 hover:bg-[#0E9F6E] transition-all uppercase tracking-[0.15em] active:scale-95"
              >
                <Plus size={14} /> Add {activeTab}
              </button>
            )}
          </div>

          {/* Global Theme & Accent Toolbar */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-3xl border border-slate-100 mb-8 relative">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Workspace Theme</span>
            </div>
            
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => {
                  setShowTemplatePicker(prev => !prev);
                  setShowAccentPicker(false);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  showTemplatePicker 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-950/20' 
                    : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'
                }`}
              >
                <Grid3x2 size={14} /> Template
              </button>
              
              <button
                id="accent-picker-btn"
                onClick={() => {
                  setShowAccentPicker(prev => !prev);
                  setShowTemplatePicker(false);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  showAccentPicker 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-950/20' 
                    : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-800'
                }`}
              >
                <Palette size={14} style={{ color: themeColor }} /> Accent
              </button>

              {/* Accent Color Picker Popover */}
              {showAccentPicker && (
                <div className="absolute top-full mt-3 right-0 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-2xl z-50 w-72 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Accent Color</span>
                    <button onClick={() => setShowAccentPicker(false)} className="text-slate-300 hover:text-slate-600 transition-colors cursor-pointer">
                      <Plus size={16} className="rotate-45" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { name: 'Blue', hex: '#2563eb' },
                      { name: 'Indigo', hex: '#4f46e5' },
                      { name: 'Purple', hex: '#9333ea' },
                      { name: 'Green', hex: '#10b981' },
                      { name: 'Red', hex: '#ef4444' },
                      { name: 'Orange', hex: '#f97316' },
                      { name: 'Teal', hex: '#0d9488' },
                      { name: 'Pink', hex: '#ec4899' },
                      { name: 'Gray', hex: '#4b5563' },
                      { name: 'Black', hex: '#1f2937' }
                    ].map((color) => {
                      const isActive = themeColor === color.hex;
                      return (
                        <div key={color.name} className="flex flex-col items-center">
                          <button
                            onClick={() => setThemeColor(color.hex)}
                            className="w-10 h-10 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 shadow-md flex items-center justify-center border-2 border-white focus:outline-none"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          >
                            {isActive && <Check size={16} className="text-white drop-shadow-md stroke-[3]" />}
                          </button>
                          <span className="text-[8px] font-black text-slate-400 mt-1.5 uppercase tracking-widest truncate max-w-full">{color.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Template Picker Popover */}
              {showTemplatePicker && (
                <div className="absolute top-full mt-3 right-0 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-2xl z-50 w-64 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Layout Template</span>
                    <button onClick={() => setShowTemplatePicker(false)} className="text-slate-300 hover:text-slate-600 transition-colors cursor-pointer">
                      <Plus size={16} className="rotate-45" />
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { id: 'classic_executive', label: 'Classic Executive' },
                      { id: 'modern_minimal', label: 'Modern Minimal' },
                      { id: 'creative_portfolio', label: 'Creative Portfolio' }
                    ].map((tpl) => {
                      const isActive = selectedTemplate === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          onClick={() => {
                            handleTemplateChange(tpl.id);
                            setShowTemplatePicker(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border cursor-pointer ${
                            isActive 
                              ? 'border-slate-200 font-extrabold shadow-sm' 
                              : 'hover:bg-slate-50 text-slate-600 border-slate-100'
                          }`}
                          style={{
                            backgroundColor: isActive ? `${themeColor}15` : undefined,
                            color: isActive ? themeColor : undefined,
                            borderColor: isActive ? themeColor : undefined
                          }}
                        >
                          {tpl.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-10 animate-in fade-in duration-700">
            {activeTab === 'Personal Info' && (
              <div className="space-y-8">
                <div className="flex flex-col gap-3 mb-8">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile Avatar</label>
                  <div 
                    onClick={() => document.getElementById('photo-upload').click()} 
                    className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 border-dashed hover:bg-white transition-all cursor-pointer group shadow-sm"
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = themeColor}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => updatePersonalInfo({ photo: reader.result }); reader.readAsDataURL(file); } }} />
                    <div 
                      className="w-16 h-16 rounded-full border-2 flex justify-center items-center text-white overflow-hidden shadow-md group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: themeColor, borderColor: themeColor }}
                    >
                      {currentResume.personalInfo.photo ? (
                        <img 
                          src={currentResume.personalInfo.photo} 
                          className="w-full h-full object-cover" 
                          style={{ mixBlendMode: 'normal', filter: 'none' }} 
                          alt="Profile" 
                        />
                      ) : <User size={28} />}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5" style={{ color: themeColor }}><Upload size={14} /> Update Media Asset</span>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest opacity-60">High resolution PNG or JPG preferred</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Name</label>
                    <input type="text" name="fullName" value={currentResume?.personalInfo?.fullName || ''} onChange={(e) => updatePersonalInfo({ fullName: e.target.value })} placeholder="John Snow" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-3.5 text-xs font-bold outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Title</label>
                    <input type="text" value={currentResume?.personalInfo?.profession || ''} onChange={(e) => updatePersonalInfo({ profession: e.target.value })} placeholder="Lead Designer" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-3.5 text-xs font-bold outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition shadow-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Secure</label>
                    <input type="email" value={currentResume?.personalInfo?.email || ''} onChange={(e) => updatePersonalInfo({ email: e.target.value })} placeholder="hello@domain.com" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-3.5 text-xs font-bold outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition shadow-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Line</label>
                    <input type="tel" value={currentResume?.personalInfo?.phone || ''} onChange={(e) => updatePersonalInfo({ phone: e.target.value })} placeholder="+1 (555) 000-0000" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-3.5 text-xs font-bold outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition shadow-sm" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Base</label>
                  <input type="text" value={currentResume?.personalInfo?.location || ''} onChange={(e) => updatePersonalInfo({ location: e.target.value })} placeholder="San Francisco, CA" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-3.5 text-xs font-bold outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition shadow-sm" />
                </div>
                <SaveActionBar />
              </div>
            )}

            {activeTab === 'Summary' && (
              <div className="space-y-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Professional Narrative</label>
                  <textarea rows={10} value={currentResume?.summary || ''} onChange={(e) => updateSummary(e.target.value)} placeholder="Synthesis of your career achievements..." className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-8 text-sm leading-relaxed text-slate-700 shadow-sm focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none h-64 resize-none transition-all font-medium" />
                </div>
                <SaveActionBar />
              </div>
            )}

            {activeTab === 'Experience' && (
              <div className="space-y-8">
                {currentResume.experience.length === 0 ? (
                  <div className="p-16 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 text-center bg-slate-50/50">
                    <Briefcase size={48} strokeWidth={1} className="mb-6 opacity-30" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Chronological history empty.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {currentResume.experience.map((exp, index) => (
                      <div key={exp.id} className="p-8 bg-white border border-slate-100 rounded-[2rem] relative group flex flex-col gap-6 shadow-xl shadow-slate-200/40 hover:border-[#10B981]/30 transition-all">
                        <button onClick={() => removeItem('experience', index)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Organization</label>
                            <input type="text" placeholder="Apple Inc." value={exp.company} onChange={(e) => updateItem('experience', index, { company: e.target.value })} className="bg-slate-50 border-none rounded-xl px-5 py-3 text-xs outline-none font-bold focus:ring-2 focus:ring-[#10B981]/20" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Position</label>
                            <input type="text" placeholder="Senior Analyst" value={exp.title} onChange={(e) => updateItem('experience', index, { title: e.target.value })} className="bg-slate-50 border-none rounded-xl px-5 py-3 text-xs outline-none font-bold focus:ring-2 focus:ring-[#10B981]/20" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Tenure</label>
                          <input type="text" placeholder="Jan 2020 — Present" value={exp.dates} onChange={(e) => updateItem('experience', index, { dates: e.target.value })} className="bg-slate-50 border-none rounded-xl px-5 py-3 text-xs outline-none font-bold focus:ring-2 focus:ring-[#10B981]/20" />
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Impact Summary</label>
                            <button disabled={isEnhancing} onClick={() => handleAIEnhance(exp.description, 'experience', (enhancedText) => {
                              setCurrentResume((prev) => {
                                const newExperience = prev.experience.map((item, i) =>
                                  i === index ? { ...item, description: enhancedText } : item
                                );
                                return { ...prev, experience: newExperience };
                              });
                            })} className="text-[9px] font-black bg-[#E8F9EE] text-[#10B981] px-3 py-1.5 rounded-full border border-emerald-100 transition-all flex items-center gap-1.5 shadow-sm hover:bg-[#10B981] hover:text-white uppercase tracking-tighter">
                              <Wand2 size={12} className={isEnhancing ? 'animate-spin' : ''} /> {isEnhancing ? 'Processing...' : 'AI Refine'}
                            </button>
                          </div>
                          <textarea placeholder="Synthesize your contributions..." value={exp.description} onChange={(e) => updateItem('experience', index, { description: e.target.value })} className="bg-slate-50 border-none rounded-[1.5rem] px-5 py-4 text-sm outline-none font-medium resize-none h-40 focus:ring-2 focus:ring-[#10B981]/20 leading-relaxed" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {currentResume.experience.length > 0 && <SaveActionBar />}
              </div>
            )}

            {activeTab === 'Education' && (
              <div className="space-y-8">
                {currentResume.education.length === 0 ? (
                  <div className="p-16 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 text-center bg-slate-50/50">
                    <GraduationCap size={48} strokeWidth={1} className="mb-6 opacity-30" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">No academic background.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentResume.education.map((edu, index) => (
                      <div key={edu.id} className="p-8 bg-white border border-slate-100 rounded-[2rem] relative group flex flex-col gap-6 shadow-xl shadow-slate-200/40 hover:border-[#10B981]/30 transition-all">
                        <button onClick={() => removeItem('education', index)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Institution</label>
                            <input type="text" placeholder="Harvard University" value={edu.school} onChange={(e) => updateItem('education', index, { school: e.target.value })} className="bg-slate-50 border-none rounded-xl px-5 py-3 text-xs outline-none font-bold focus:ring-2 focus:ring-[#10B981]/20" />
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Certification</label>
                            <input type="text" placeholder="MS in Data Science" value={edu.degree} onChange={(e) => updateItem('education', index, { degree: e.target.value })} className="bg-slate-50 border-none rounded-xl px-5 py-3 text-xs outline-none font-bold focus:ring-2 focus:ring-[#10B981]/20" />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Completion</label>
                          <input type="text" placeholder="May 2021" value={edu.dates} onChange={(e) => updateItem('education', index, { dates: e.target.value })} className="bg-slate-50 border-none rounded-xl px-5 py-3 text-xs outline-none font-bold focus:ring-2 focus:ring-[#10B981]/20" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {currentResume.education.length > 0 && <SaveActionBar />}
              </div>
            )}

            {activeTab === 'Skills' && (
              <div className="space-y-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Skillset Matrix</label>
                  <div className="flex gap-3">
                    <input id="skill-add" type="text" placeholder="Identify an expertise..." onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value) { addItem('skills', { name: e.target.value }); e.target.value = ''; } }} className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm outline-none font-black text-slate-700 shadow-inner focus:ring-2 focus:ring-[#10B981]/20" />
                    <button onClick={() => { const inp = document.getElementById('skill-add'); if (inp.value) { addItem('skills', { name: inp.value }); inp.value = ''; } }} className="bg-[#10B981] hover:bg-[#0E9F6E] text-white px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/10 transition-all active:scale-95">Verify & Add</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 p-2">
                  {currentResume.skills.map((skill, index) => (
                    <div key={skill.id} className="flex items-center gap-3 bg-slate-900 text-white pl-5 pr-3 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-[#10B981] transition-all hover:-translate-y-1">
                      {skill.name}
                      <button onClick={() => removeItem('skills', index)} className="p-1 text-slate-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
                <SaveActionBar />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. 🟢 RIGHT PREVIEW REBRANDED */}
      <div className={`bg-slate-100 flex-col shrink-0 relative border-l border-slate-200 pb-24 lg:pb-0 ${mobileView === 'preview' ? 'flex w-full' : 'hidden lg:flex lg:w-[48%]'}`}>
        {/* Fixed Header Bar at the top of the preview pane */}
        <div className="bg-slate-100/90 backdrop-blur-md px-12 py-4 z-30 flex justify-end items-center border-b border-slate-200/60 shadow-sm shrink-0">
          <button
            disabled={isDownloading}
            onClick={handleExportPDF}
            className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <Download size={13} className={isDownloading ? "animate-bounce" : ""} />
            {isDownloading ? '⏳ Processing PDF...' : 'Export as PDF'}
          </button>
        </div>

        {/* Scrollable container for the resume canvas card */}
        <div className="flex-1 p-12 overflow-y-auto flex justify-center items-start">
          <div id="resume-canvas" ref={resumeCanvasRef} className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-2xl p-14 rounded-sm border border-slate-200 flex flex-col font-sans relative overflow-hidden">
            {selectedTemplate === 'classic_executive' && (
              <>
                {/* Executive Accent Line */}
                <div className="absolute top-0 left-0 w-full h-1.5" style={{ backgroundColor: themeColor }} />

                {(currentResume.personalInfo.fullName || currentResume.personalInfo.profession || currentResume.personalInfo.photo || currentResume.personalInfo.email) && (
                  <div 
                    className="mx-[-3.5rem] mt-[-3.5rem] p-12 mb-12 flex justify-between items-center text-white relative transition-all duration-300"
                    style={{ backgroundColor: themeColor }}
                  >
                    <div className="flex-1 text-left">
                      <h1 className="text-4xl font-black tracking-tight uppercase leading-none">{currentResume.personalInfo.fullName || 'YOUR NAME'}</h1>
                      {currentResume.personalInfo.profession && (
                        <p className="text-[11px] font-black tracking-[0.25em] uppercase text-white/90 mt-2">{currentResume.personalInfo.profession}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-6 text-[9px] font-black tracking-widest text-white/80 uppercase">
                        <div className="space-y-2">
                          {currentResume.personalInfo.email && (
                            <span className="flex items-center gap-2"><Mail size={12} className="text-white/70 shrink-0" />{currentResume.personalInfo.email}</span>
                          )}
                          {currentResume.personalInfo.location && (
                            <span className="flex items-center gap-2"><MapPin size={12} className="text-white/70 shrink-0" />{currentResume.personalInfo.location}</span>
                          )}
                        </div>
                        <div className="space-y-2">
                          {currentResume.personalInfo.phone && (
                            <span className="flex items-center gap-2"><Phone size={12} className="text-white/70 shrink-0" />{currentResume.personalInfo.phone}</span>
                          )}
                          {currentResume.personalInfo.website && (
                            <span className="flex items-center gap-2"><FileText size={12} className="text-white/70 shrink-0" />{currentResume.personalInfo.website}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {currentResume.personalInfo.photo && (
                      <div 
                        className="w-24 h-24 rounded-full border-4 shadow-xl overflow-hidden shrink-0 ml-8 transition-all duration-300" 
                        style={{ borderColor: themeColor, backgroundColor: themeColor }}
                      >
                        <img 
                          src={currentResume.personalInfo.photo} 
                          className="w-full h-full object-cover" 
                          style={{ mixBlendMode: 'normal', filter: 'none' }} 
                          alt="Profile" 
                        />
                      </div>
                    )}
                  </div>
                )}
                {renderClassicTemplate()}
              </>
            )}

            {selectedTemplate === 'modern_minimal' && renderModernTemplate()}

            {selectedTemplate === 'creative_portfolio' && renderCreativeTemplate()}

            <div className="mt-auto pt-16 text-center"><div className="inline-block px-6 py-2 bg-slate-50 rounded-full text-[9px] font-black tracking-[0.3em] text-slate-400 uppercase italic">Engineered by Resume.AI</div></div>
          </div>
        </div>
      </div>

      {/* Sleek mobile sticky toggle bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200/80 p-3 flex justify-around items-center z-50 lg:hidden shadow-lg">
        <button
          onClick={() => setMobileView('edit')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
            mobileView === 'edit'
              ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-500/20 active:scale-95'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <span>📝</span> Edit Form
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
            mobileView === 'preview'
              ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-500/20 active:scale-95'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <span>👁️</span> Live Preview
        </button>
      </div>

    </div>
  );
};