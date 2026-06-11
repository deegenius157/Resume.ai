const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBZs0ahgXKeHyMMKfx0h8beiFFBHrUEkcU";

// Utility 1: Text Optimization Engine (Summaries, Experience Bullet Points)
export const enhanceTextWithAI = async (textContext, fieldType) => {
  const prompt = `You are an expert recruiter. Optimize this raw draft description for a resume ${fieldType} section into three high-impact sentences using corporate action verbs. Return ONLY the polished text block string result: "${textContext}"`;
  
  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Optimization Failure:", error);
    return textContext;
  }
};

// Utility 2: Document Parsing & Translation Engine (File Imports)
export const parseDocumentWithAI = async (rawExtractedText) => {
  const parsePrompt = `Analyze this unformatted raw text from an old resume file. Extract, organize, and output a strict, minified raw JSON object matching this exact architectural template keys. Do not include markdown code block wrappers like \`\`\`json. Text data to parse: ${rawExtractedText}`;
  
  // JSON structural payload passed inside the instruction matrix:
  // { personalInfo: { fullName:'', email:'', phone:'', location:'', profession:'' }, objective:'', experience:[], education:[], projects:[], skills:[] }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: parsePrompt }] }] })
    });
    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("AI Document Parsing Failure:", error);
    throw error;
  }
};