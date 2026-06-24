import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Backend API logic implemented as Vite middleware
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', '');
  const GEMINI_API_KEY = env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
  const GEMINI_MODEL = 'gemini-2.0-flash-lite'; // Switched to lite model - higher free tier quota
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  return {
    envDir: '../',
    plugins: [
      react(),
    {
      name: 'api-server-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          
          // 1. ENDPOINT: /api/parse-resume (Native PDF.js Extraction)
          if (req.url === '/api/parse-resume' && req.method === 'POST') {
            const body = [];
            req.on('data', chunk => body.push(chunk));
            req.on('end', async () => {
              try {
                const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
                const buffer = Buffer.concat(body);
                const data = new Uint8Array(buffer);
                const loadingTask = pdfjs.getDocument({ data, verbosity: 0 });
                const pdfDocument = await loadingTask.promise;
                let rawText = "";

                for (let i = 1; i <= pdfDocument.numPages; i++) {
                  const page = await pdfDocument.getPage(i);
                  const textContent = await page.getTextContent();
                  const pageText = textContent.items.map(item => item.str).join(" ");
                  rawText += pageText + "\n";
                }

                const geminiResponse = await fetch(GEMINI_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{
                      parts: [{
                        text: `You are an expert resume parsing engine. Analyze this raw text from a candidate's resume and extract the details into a clean JSON structure matching this format exactly:
                        {
                          "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "profession": "" },
                          "summary": "",
                          "experience": [ { "company": "", "title": "", "dates": "", "description": "" } ],
                          "education": [ { "school": "", "degree": "", "dates": "" } ],
                          "skills": []
                        }
                        Return ONLY the raw JSON string. Do not include markdown blocks, backticks, or "json" tags.
                        
                        Raw Resume Text:
                        ${rawText}`
                      }]
                    }]
                  })
                });

                const geminiData = await geminiResponse.json();

                if (geminiData.error?.code === 429) {
                  const retryInfo = geminiData.error.details?.find(d => d['@type']?.includes('RetryInfo'));
                  const delay = retryInfo?.retryDelay || '30s';
                  res.writeHead(429, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: `AI quota limit reached. Please wait ${delay} and try again.` }));
                  return;
                }

                if (!geminiData.candidates || !geminiData.candidates[0]) {
                  console.error("Gemini parse error:", JSON.stringify(geminiData));
                  throw new Error("AI extraction failed: Invalid response from Gemini.");
                }

                const cleanJsonText = geminiData.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(cleanJsonText);
                return;

              } catch (error) {
                console.error("Extraction Error:", error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "The server failed to parse the PDF." }));
              }
            });
            return;
          }

          // 2. ENDPOINT: /api/enhance (AI Content Refinement)
          if (req.url === '/api/enhance' && req.method === 'POST') {
            try {
              // Collect the data chunks using async iterator
              const chunks = [];
              for await (const chunk of req) {
                chunks.push(chunk);
              }
              const rawBody = Buffer.concat(chunks).toString();
              
              // Safely handle both JSON objects and raw strings
              let textToProcess = "";
              try {
                const parsedJson = JSON.parse(rawBody);
                textToProcess = parsedJson.text || rawBody;
              } catch (jsonErr) {
                textToProcess = rawBody;
              }

              const geminiResponse = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{
                    parts: [{
                      text: `You are a professional resume writer. Review and rewrite the following phrase or paragraph to look highly professional, clear, and bulletproof for an ATS-optimized professional resume. Fix any spelling or grammar issues.
                      
                      Text to rewrite:
                      ${textToProcess}
                      
                      Return ONLY the rewritten text result. Do not include markdown formatting, quote marks, introductory comments, or backticks.`
                    }]
                  }]
                })
              });

              const geminiData = await geminiResponse.json();

              if (geminiData.error?.code === 429) {
                const retryInfo = geminiData.error.details?.find(d => d['@type']?.includes('RetryInfo'));
                const delay = retryInfo?.retryDelay || '30s';
                res.writeHead(429, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: `⏳ AI quota limit reached. Please wait ${delay} and try again.` }));
                return;
              }

              if (!geminiData.candidates || !geminiData.candidates[0]) {
                console.error("Gemini enhance error:", JSON.stringify(geminiData));
                throw new Error("AI refinement failed: Invalid response from Gemini.");
              }

              const enhancedTextOutput = geminiData.candidates[0].content.parts[0].text.trim();

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ enhancedText: enhancedTextOutput }));
              return;

            } catch (error) {
              console.error("AI Enhance Server Error:", error);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: "Failed to connect to AI service." }));
              return;
            }
          }

          // Fallback to standard Vite asset loading
          next();
        });
      }
    }
    ],
  };
})

