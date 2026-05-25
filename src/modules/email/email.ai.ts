import axios from "axios";

export const generateColdEmailAI = async (
  jobAnalysis: any,
  profile: any,
  matchResult: any,
  tone: string = "professional"
) => {
    const prompt = `
    You are an expert career coach helping job seekers write cold outreach emails to recruiters, HRs, founders, or hiring managers.
    
    Write a SHORT personalized cold email FROM the candidate TO the company.
    
    IMPORTANT RULES:
    - candidate is applying/interested in role
    - do NOT sound like recruiter
    - concise and natural
    - professional but human
    - avoid robotic AI wording
    - under 120 words
    - mention relevant matching skills
    - mention candidate background briefly
    - show interest in the role/company
    - include polite CTA
    - do NOT invent fake companies
    - do NOT invent fake experience
    - do NOT invent fake people names
    - use only provided information
    - if data missing, stay generic
    
    JOB ROLE:
    ${jobAnalysis?.role || "Software Engineer"}
    
    COMPANY:
    ${jobAnalysis?.company || "the company"}
    
    REQUIRED SKILLS:
    ${jobAnalysis?.skills?.join(", ") || "Not provided"}
    
    CANDIDATE NAME:
    ${profile?.name || "Candidate"}
    
    CANDIDATE SKILLS:
    ${profile?.skills?.join(", ") || "Not provided"}
    
    CANDIDATE EXPERIENCE:
    ${profile?.experience || "Not provided"}
    
    MATCH SCORE:
    ${matchResult?.score || 0}
    
    EMAIL TONE:
    ${tone}
    
    Return ONLY valid JSON:
    
    {
      "subject": "",
      "content": ""
    }
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

  const text =
    response.data.candidates[0].content.parts[0].text;

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
};