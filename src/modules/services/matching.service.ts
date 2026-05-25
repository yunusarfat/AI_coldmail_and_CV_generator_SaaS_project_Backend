// import { Profile } from "../profile/profile.model";
// import { dJob } from "../djob/job.model";

// export const matchProfileWithJob = async (profileId: string) => {
//   const profile = await Profile.findById(profileId);
//   if (!profile) throw new Error("Profile not found");

//   const job = await dJob.findById(profile.jobId);
//   if (!job || !job.jobAnalysis) {
//     throw new Error("Job or jobAnalysis not found");
//   }

//   const jobSkills = job.jobAnalysis.skills || [];
//   const jobKeywords = job.jobAnalysis.keywords || [];

//   const profileSkills = profile.skills || [];
//   const profileText = (profile.rawText || "").toLowerCase();

//   let score = 0;
//   let hooks: string[] = [];

//   // -------------------------
//   // 1. SKILL MATCH (70%)
//   // -------------------------
//   let skillMatchCount = 0;

//   profileSkills.forEach((skill) => {
//     if (jobSkills.includes(skill)) {
//       skillMatchCount++;
//       hooks.push(`Strong experience in ${skill}`);
//     }
//   });

//   const skillScore =
//     jobSkills.length > 0 ? skillMatchCount / jobSkills.length : 0;

//   score += skillScore * 0.7;

//   // -------------------------
//   // 2. KEYWORD MATCH (20%)
//   // -------------------------
//   let keywordMatchCount = 0;

//   jobKeywords.forEach((keyword) => {
//     if (profileText.includes(keyword.toLowerCase())) {
//       keywordMatchCount++;
//       hooks.push(`Relevant experience in ${keyword}`);
//     }
//   });

//   const keywordScore =
//     jobKeywords.length > 0 ? keywordMatchCount / jobKeywords.length : 0;

//   score += keywordScore * 0.2;

//   // -------------------------
//   // 3. EXPERIENCE BONUS (10%)
//   // -------------------------
//   if (profile.experienceYears && profile.experienceYears >= 3) {
//     score += 0.1;
//     hooks.push("Strong professional experience");
//   }

//   // -------------------------
//   // FINALIZE
//   // -------------------------
//   score = Math.min(score, 1);

//   profile.matchScore = score;
//   profile.hooks = hooks;

//   await profile.save();

//   return {
//     profileId: profile._id,
//     score,
//     hooks,
//   };
// };




import { Profile } from "../profile/profile.model";
import { dJob } from "../djob/job.model";

export const matchProfileWithJob = async (profileId: string) => {
  // -----------------------------------
  // GET PROFILE
  // -----------------------------------
  const profile = await Profile.findById(profileId);

  if (!profile) {
    throw new Error("Profile not found");
  }

  // -----------------------------------
  // GET RELATED JOB
  // -----------------------------------
  const job = await dJob.findById(profile.jobId);

  if (!job || !job.jobAnalysis) {
    throw new Error("Job or jobAnalysis not found");
  }

  // -----------------------------------
  // NORMALIZED DATA
  // -----------------------------------
  const jobSkills = (job.jobAnalysis.skills || []).map((s: string) =>
    s.toLowerCase()
  );

  const jobKeywords = (job.jobAnalysis.keywords || []).map((k: string) =>
    k.toLowerCase()
  );

  const jobRole = (job.jobAnalysis.role || "").toLowerCase();

  const profileSkills = (profile.skills || []).map((s: string) =>
    s.toLowerCase()
  );

  const profileRole = (profile.currentRole || "").toLowerCase();

  const profileText = (profile.rawText || "").toLowerCase();

  // -----------------------------------
  // RESULT VARIABLES
  // -----------------------------------
  let score = 0;

  let hooks: string[] = [];

  let matchedSkills: string[] = [];

  let missingSkills: string[] = [];

  // -----------------------------------
  // 1. SKILL MATCH (55%)
  // -----------------------------------
  let skillMatchCount = 0;

  jobSkills.forEach((jobSkill: string) => {
    const matched = profileSkills.some((profileSkill: string) =>
      profileSkill.includes(jobSkill) ||
      jobSkill.includes(profileSkill)
    );

    if (matched) {
      skillMatchCount++;

      matchedSkills.push(jobSkill);

      hooks.push(`Strong experience in ${jobSkill}`);
    } else {
      missingSkills.push(jobSkill);
    }
  });

  const skillScore =
    jobSkills.length > 0
      ? skillMatchCount / jobSkills.length
      : 0;

  score += skillScore * 0.55;

  // -----------------------------------
  // 2. KEYWORD MATCH (20%)
  // -----------------------------------
  let keywordMatchCount = 0;

  jobKeywords.forEach((keyword: string) => {
    if (profileText.includes(keyword)) {
      keywordMatchCount++;

      hooks.push(`Relevant background in ${keyword}`);
    }
  });

  const keywordScore =
    jobKeywords.length > 0
      ? keywordMatchCount / jobKeywords.length
      : 0;

  score += keywordScore * 0.2;

  // -----------------------------------
  // 3. ROLE MATCH (15%)
  // -----------------------------------
  if (
    profileRole.includes(jobRole) ||
    jobRole.includes(profileRole)
  ) {
    score += 0.15;

    hooks.push(`Strong role alignment with ${job.jobAnalysis.role}`);
  }

  // -----------------------------------
  // 4. EXPERIENCE BONUS (10%)
  // -----------------------------------
  const years = profile.experienceYears || 0;

  if (years >= 5) {
    score += 0.1;

    hooks.push("Senior-level professional experience");
  } else if (years >= 3) {
    score += 0.07;

    hooks.push("Strong professional experience");
  } else if (years >= 1) {
    score += 0.03;

    hooks.push("Relevant industry experience");
  }

  // -----------------------------------
  // FINAL CLEANUP
  // -----------------------------------
  score = Math.min(score, 1);

  hooks = [...new Set(hooks)];

  matchedSkills = [...new Set(matchedSkills)];

  missingSkills = [...new Set(missingSkills)];

  // -----------------------------------
  // SAVE TO PROFILE
  // -----------------------------------
  profile.matchScore = Number(score.toFixed(2));

  profile.hooks = hooks;

  await profile.save();

  // -----------------------------------
  // RETURN RESULT
  // -----------------------------------
  return {
    profileId: profile._id,

    score: Number(score.toFixed(2)),

    matchedSkills,

    missingSkills,

    hooks,
  };
};