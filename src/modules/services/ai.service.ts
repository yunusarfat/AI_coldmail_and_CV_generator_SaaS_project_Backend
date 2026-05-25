import axios from "axios";

export const analyzeJob = async (desiredPost: string) => {
  const prompt = `
You are a job analysis AI.

Convert this job description into structured JSON ONLY.

Job Description:
${desiredPost}

Return ONLY valid JSON in this format:
{
  "role": "",
  "skills": [],
  "keywords": [],
  "tone": "",
  "seniority": ""
}
`;

  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    }
  );

  const text =
    response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  try {
    return JSON.parse(text);
  } catch (err) {
    return {
      role: "",
      skills: [],
      keywords: [],
      tone: "",
      seniority: "",
    };
  }
};