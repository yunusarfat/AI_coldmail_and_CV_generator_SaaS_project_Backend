// import axios from "axios";

// export const generateTailoredCV = async (
//   profile: any,
//   job: any
// ) => {
//   const prompt = `
// You are an expert ATS resume writer.

// Create a highly optimized ONE PAGE resume.

// IMPORTANT:
// - Do NOT invent fake information
// - Reorganize existing information
// - Emphasize relevant skills for this job

// Return ONLY valid JSON.

// FORMAT:

// {
//   "headline": "",
//   "summary": "",
//   "skills": [],
//   "experience": [],
//   "projects": [],
//   achievements,
// }

// PROFILE:
// ${JSON.stringify(profile)}

// JOB:
// ${JSON.stringify(job.jobAnalysis)}
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

//   const raw =
//     response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

//   const cleaned = raw
//     .replace(/```json/g, "")
//     .replace(/```/g, "")
//     .trim();

//   return JSON.parse(cleaned);
// };



// import axios from "axios";

// export const generateTailoredCV = async (profile: any, job: any) => {
//   const prompt = `
// You are an expert ATS resume writer.

// Create a highly optimized ONE PAGE resume.

// IMPORTANT:
// - Do NOT invent fake information
// - Only use provided data
// - Structure experience properly
// - Keep summary maximum 3 lines
// - Keep each project description max 3 lines
// - Always return structured experience and projects as objects
// - Always include education section if present in CV
// SUMMARY RULE:
// - Write a highly job-specific summary tailored ONLY to the target job
// - Must include job role, required skills, and matching experience
// - Must NOT be generic profile summary
// - Must reflect ATS keywords from JOB section
// - Maximum 3 lines only

// Return ONLY valid JSON.

// FORMAT:

// {
//   "headline": "",
//   "summary": "",
//   "skills": [],
//   "education": [
//     {
//       "institution": "",
//       "degree": "",
//       "dates": ""
//     }
//   ]
//   "experience": [
//     {
//       "title": "",
//       "company": "",
//       "dates": "",
//       "description": []
//     }
//   ],
//   "projects": [
//     {
//       "title": "",
//       "description": "",
//       "technologies": []
//     }
//   ],
//   "achievements": [],

// }

// PROFILE:
// ${JSON.stringify(profile)}

// JOB:
// ${JSON.stringify(job.jobAnalysis)}
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

//   const raw =
//     response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

//   const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

//   const parsed = JSON.parse(cleaned);

//   // 🔥 FIX: FORCE EXPERIENCE STRUCTURE HERE
//   const experience = [
//     {
//       title: profile.currentRole,
//       company: profile.company,
//       dates: `${profile.experienceYears} Years Experience`,
//       description: [
//         `Worked as ${profile.currentRole} at ${profile.company}`,
//         `Built projects using ${profile.skills?.join(", ") || ""}`,
//       ],
//     },
//   ];

//   return {
//     ...parsed,
//     experience: parsed.experience?.length ? parsed.experience : experience,
//   };
// };



import axios from "axios";
import OpenAI from "openai";

export const generateTailoredCV = async (profile: any, job: any) => {
  const prompt = `
You are an expert ATS resume writer.

Create a highly optimized ONE PAGE resume.

IMPORTANT:
- Do NOT invent fake information
- Only use provided data
- Structure experience properly
- Keep summary maximum 3 lines
- Keep each project description max 3 lines and max 2 projects
- Always return structured experience and projects as objects
- Always include education section if present in CV
- Show ONLY the most recent/latest education (last one only)

SUMMARY RULE:
- Write a highly job-specific summary tailored ONLY to the target job
- Must include job role, required skills, and matching experience
- Must NOT be generic profile summary
- Must reflect ATS keywords from JOB section
- Maximum 3 lines only

HEADLINE RULE:
- Must include email address (Gmail or provided address)
- Format: "Role | email@example.com"

Return ONLY valid JSON.

FORMAT:

{
  "headline": "",
  "summary": "",
  "skills": [],
  "education": [
    {
      "institution": "",
      "degree": "",
      "dates": ""
    }
  ],
  "experience": [
    {
      "title": "",
      "company": "",
      "dates": "",
      "description": []
    }
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "technologies": []
    }
  ],
  "achievements": [],
  
}

PROFILE:
${JSON.stringify(profile)}

JOB:
${JSON.stringify(job.jobAnalysis)}
`;

  // const response = await axios.post(
  //   `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  //   {
  //     contents: [
  //       {
  //         parts: [{ text: prompt }],
  //       },
  //     ],
  //   }
  // );

  // const raw =
  //   response.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  // const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();

  // const parsed = JSON.parse(cleaned);

  const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "You are an expert ATS resume writer. Return ONLY valid JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  const raw = response.choices[0]?.message?.content || "{}";

  const cleaned = raw
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);




  // 🔥 FIX: FORCE EXPERIENCE STRUCTURE HERE
  const experience = [
    {
      title: profile.currentRole,
      company: profile.company,
      dates: `${profile.experienceYears} Years Experience`,
      description: [
        `Worked as ${profile.currentRole} at ${profile.company}`,
        `Built projects using ${profile.skills?.join(", ") || ""}`,
      ],
    },
  ];

  // 🔥 FIX: ONLY SHOW MOST RECENT EDUCATION (LAST ONE)
  let education = parsed.education || [];
  if (profile.education && profile.education.length > 0) {
    // Use only the last/most recent education from profile
    const lastEducation = profile.education[profile.education.length - 1];
    education = [{
      institution: lastEducation.institution || lastEducation.school || "",
      degree: lastEducation.degree || "",
      dates: lastEducation.dates || lastEducation.year || "",
    }];
  } else if (education.length > 1) {
    // If multiple from parsed, take only last one
    education = [education[education.length - 1]];
  }

  // 🔥 FIX: ENSURE HEADLINE HAS EMAIL
  let headline = parsed.headline || `${profile.name || "Candidate"} | ${profile.currentRole || "Professional"}`;
  const email = profile.email || profile.contact?.email || "";

  if (email && !headline.includes(email)) {
    headline = `${headline} | ${email}`;
  } else if (!email && !headline.match(/[\w.-]+@[\w.-]+\.[a-z]{2,}/i)) {
    // If no email in profile, add placeholder (you might want to handle differently)
    headline = `${headline} | email@example.com`;
  }

  return {
    ...parsed,
    headline,
    education,
    experience: parsed.experience?.length ? parsed.experience : experience,
  };
};