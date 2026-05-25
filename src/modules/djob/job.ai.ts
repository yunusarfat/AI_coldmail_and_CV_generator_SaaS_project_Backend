// import axios from "axios";

// export const analyzeJobWithAI = async (text: string) => {
//   const prompt = `
//   You are an ATS-grade job intelligence engine.
  
//   Extract structured hiring data from JOB DESCRIPTION.
  
//   IMPORTANT:
//   - This is recruitment intent text
//   - You MUST infer missing data intelligently
//   - NEVER return empty arrays if data exists
  
//   Return ONLY valid JSON:
  
//   {
//     "role": "main job title",
//     "skills": ["technical skills"],
//     "keywords": ["ATS keywords"],
//     "tone": "formal | dynamic | corporate | startup",
//     "seniority": "intern | junior | mid-level | senior | lead"
//   }
  
//   EXTRA RULES:
//   - Skills = ONLY technical tools (React, Node.js, AWS)
//   - Keywords = hiring signals (startup, scalable, API, frontend, backend)
//   - Infer role even if not explicitly stated
//   - Be aggressive in extraction (do NOT be safe/empty)
  
//   JOB DESCRIPTION:
//   ${text}
//   `;

//   const response = await axios.post(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//     {
//       contents: [
//         {
//           parts: [{ text: prompt }],
//         },
//       ],
//     }
//   );

  
//   const raw =
//   response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

//   const cleaned = raw
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();
//     console.log("RAW GEMINI:", response.data);

//     return JSON.parse(cleaned);
//   };






import axios from "axios";


export const analyzeJobWithAI = async (text: string) => {
  try {
    
    const prompt = `
    You are an ATS-grade job intelligence engine.

Return ONLY JSON:
{
  "role": "",
  "skills": [],
  "keywords": [],
  "tone": "",
  "seniority": ""
}

JOB:
${text}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    console.log("🔥 RAW RESPONSE:", JSON.stringify(response.data, null, 2));

    const raw =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    console.log("🔥 RAW TEXT:", raw);

    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(cleaned);

    console.log("🔥 PARSED:", parsed);

    return parsed;
  } catch (err: any) {
    console.log("❌ GEMINI ERROR:", err?.response?.data || err.message);

    return {
      role: "",
      skills: [],
      keywords: [],
      tone: "",
      seniority: "",
    };
  }
};