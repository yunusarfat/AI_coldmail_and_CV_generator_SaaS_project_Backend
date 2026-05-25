// import axios from "axios";

// export const extractProfileFromText = async (text: string) => {
//   const prompt = `
// You are an AI resume parser.

// Convert the following CV text into structured JSON.

// Return ONLY valid JSON in this format:

// {
//   "name": "",
//   "email": "",
//   "location": "",
//   "currentRole": "",
//   "company": "",
//   "experienceYears": 0,
//   "skills": [],
//   "projects": [],
//   "achievements": []
// }

// CV TEXT:
// ${text}
// `;

//   const response = await axios.post(
//     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//     {
//       contents: [
//         {
//           parts: [{ text: prompt }],
//         },
//       ],
//     }
//   );

//   const output =
//     response.data.candidates?.[0]?.content?.parts?.[0]?.text;

//     const cleanOutput = (output: string) => {
//       return output
//         .replace(/```json/g, "")
//         .replace(/```/g, "")
//         .trim();
//     };
    
//     const cleaned = cleanOutput(output);
    
//     return JSON.parse(cleaned);
// };



import axios from "axios";

const cleanOutput = (output: string) => {
  return output.replace(/```json/g, "").replace(/```/g, "").trim();
};

export const extractProfileFromText = async (text: string) => {
  try {
    await new Promise((res) => setTimeout(res, 500)); // rate limit safety

    const prompt = `
You are an AI resume parser.

Convert the following CV text into structured JSON.If project links are not available, return empty string.

Return ONLY valid JSON:

{
  "name": "",
  "email": "",
  "location": "",
  "currentRole": "",
  "company": "",
  "experienceYears": 0,
  "skills": [],
  "projects": [
  {
    "title": "",
    "description": "",
    "github": "",
    "liveLink": ""
  }
],
  "achievements": []
}

CV TEXT:
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

    const output =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    const cleaned = cleanOutput(output);

    return JSON.parse(cleaned);
  } catch (error: any) {
    console.log("❌ Gemini Profile Error:", error?.response?.data || error.message);

    return {
      name: "",
      email: "",
      location: "",
      currentRole: "",
      company: "",
      experienceYears: 0,
      skills: [],
      projects: [],
      achievements: []
    };
  }
};