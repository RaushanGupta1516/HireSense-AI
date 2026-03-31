import Groq from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const ask = async (prompt, maxTokens = 1024) => {
  const res = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  return res.choices[0].message.content;
};

// strips markdown fences and pulls out the first valid JSON array or object
const parseJSON = (raw) => {
  const clean = raw.replace(/```json|```/g, "").trim();

  const arrStart = clean.indexOf("[");
  const arrEnd   = clean.lastIndexOf("]");
  const objStart = clean.indexOf("{");
  const objEnd   = clean.lastIndexOf("}");

  if (arrStart !== -1 && arrEnd > arrStart && (arrStart < objStart || objStart === -1)) {
    return JSON.parse(clean.slice(arrStart, arrEnd + 1));
  }
  if (objStart !== -1 && objEnd > objStart) {
    return JSON.parse(clean.slice(objStart, objEnd + 1));
  }

  throw new Error("No valid JSON found in response");
};

export const generateJobDescription = async (jobDetails) => {
  const prompt = [
    "Generate a detailed, professional job description in HTML format.",
    "Only use these tags: h2, p, ul, li, strong, em. No html/head/body tags.",
    "",
    "Job Details:",
    JSON.stringify(jobDetails, null, 2),
    "",
    "Include: Job Summary, Responsibilities, Requirements, Nice to Have, Benefits, About the Company.",
    "Make it sound like a real funded startup. Be specific, not generic.",
  ].join("\n");

  return ask(prompt, 1200);
};

export const screenResume = async (resumeText, jobDescription, requiredSkills) => {
  const prompt = [
    "You are an expert technical recruiter. Analyze this resume against the job description.",
    "Return ONLY a valid JSON object, no extra text before or after.",
    "",
    "RESUME:", resumeText,
    "",
    "JOB DESCRIPTION:", jobDescription,
    "",
    "REQUIRED SKILLS: " + requiredSkills.join(", "),
    "",
    'JSON structure: {"overallScore":85,"skillMatchPercent":80,"matchedSkills":["skill1"],"missingSkills":["skill2"],"redFlags":[],"strengths":["s1","s2","s3"],"recommendation":"HIRE","summary":"2-3 sentence summary"}',
  ].join("\n");

  return parseJSON(await ask(prompt, 800));
};

export const rankCandidates = async (candidates, jobTitle, jobDescription, requiredSkills) => {
  const candidateList = candidates.map((c, i) => [
    `Candidate ${i + 1}: ${c.name}`,
    "Skills: "      + (c.skills?.join(", ") || "Not listed"),
    "Experience: "  + (c.yearsOfExperience || 0) + " years",
    "Role: "        + (c.primaryRole || "Not specified"),
    "Bio: "         + (c.bio || "No bio"),
    "ID: "          + c.id,
  ].join("\n")).join("\n\n");

  const prompt = [
    `You are a senior technical recruiter. Rank these candidates for the role of ${jobTitle}.`,
    "Return ONLY a valid JSON array, no extra text before or after.",
    "",
    "JOB DESCRIPTION: " + jobDescription,
    "REQUIRED SKILLS: " + requiredSkills.join(", "),
    "",
    "CANDIDATES:",
    candidateList,
    "",
    'JSON structure: [{"candidateId":"id","name":"name","fitScore":90,"rank":1,"strengths":["s1","s2"],"concerns":[],"recommendation":"STRONG_HIRE"}]',
  ].join("\n");

  return parseJSON(await ask(prompt, 1200));
};

export const generateInterviewKit = async (candidateName, resumeText, jobTitle, jobDescription) => {
  const prompt = [
    `Generate a tailored interview kit for ${candidateName} applying for ${jobTitle}.`,
    "Return ONLY a valid JSON object, no extra text before or after.",
    "",
    "RESUME SUMMARY: "   + resumeText.substring(0, 1500),
    "JOB DESCRIPTION: "  + jobDescription.substring(0, 1000),
    "",
    'JSON structure: {"technicalQuestions":[{"question":"q","purpose":"p","idealAnswer":"a"}],"behaviouralQuestions":[{"question":"q","purpose":"p","idealAnswer":"a"}],"redFlagQuestions":[{"question":"q","purpose":"p"}]}',
    "",
    "Generate 4 technical, 3 behavioural, 2 red flag questions specific to this candidate and role.",
  ].join("\n");

  return parseJSON(await ask(prompt, 1200));
};

export const getJobMatchScore = async (candidateProfile, jobTitle, jobDescription, requiredSkills) => {
  const prompt = [
    "Calculate how well this candidate matches the job.",
    "Return ONLY a valid JSON object, no extra text before or after.",
    "",
    "CANDIDATE:",
    "Name: "       + (candidateProfile.name || "Candidate"),
    "Skills: "     + (candidateProfile.skills?.join(", ") || "None listed"),
    "Experience: " + (candidateProfile.yearsOfExperience || 0) + " years",
    "Role: "       + (candidateProfile.primaryRole || "Not specified"),
    "Bio: "        + (candidateProfile.bio || "No bio"),
    "",
    "JOB: "             + jobTitle,
    "DESCRIPTION: "     + jobDescription.substring(0, 800),
    "REQUIRED SKILLS: " + (requiredSkills?.join(", ") || "Not specified"),
    "",
    'JSON structure: {"matchScore":75,"matchedSkills":["skill1"],"missingSkills":["skill2"],"verdict":"GOOD_FIT","reason":"1-2 sentence explanation"}',
  ].join("\n");

  return parseJSON(await ask(prompt, 400));
};

export const optimizeProfile = async (candidateProfile) => {
  const prompt = [
    "You are a career coach. Review this job seeker profile and give specific improvement advice.",
    "Return ONLY a valid JSON object, no extra text before or after.",
    "",
    "PROFILE:",
    "Name: "            + (candidateProfile.name || "Candidate"),
    "Role: "            + (candidateProfile.primaryRole || "Not set"),
    "Bio: "             + (candidateProfile.bio || "Empty"),
    "Skills: "          + (candidateProfile.skills?.join(", ") || "None"),
    "Experience: "      + (candidateProfile.yearsOfExperience || 0) + " years",
    "Education: "       + JSON.stringify(candidateProfile.education || []),
    "Work Experience: " + JSON.stringify(candidateProfile.workExperience || []),
    "",
    'JSON structure: {"overallScore":70,"grade":"B","summary":"2 sentence assessment","improvements":[{"section":"Bio","issue":"issue","suggestion":"suggestion with example","priority":"HIGH"}],"improvedBio":"rewritten bio or null","missingSkills":["skill1","skill2"]}',
    "",
    "Provide 3-5 specific improvements. Be direct and actionable.",
  ].join("\n");

  return parseJSON(await ask(prompt, 1200));
};

export const estimateSalary = async (jobTitle, location, experienceYears, skills) => {
  const prompt = [
    "Estimate realistic market salary for this role.",
    "Return ONLY a valid JSON object, no extra text before or after.",
    "",
    "Role: "       + jobTitle,
    "Location: "   + location,
    "Experience: " + experienceYears + " years",
    "Skills: "     + (skills?.join(", ") || "General"),
    "",
    'JSON structure: {"currency":"INR","low":800000,"mid":1200000,"high":1800000,"period":"yearly","context":"1 sentence context","topPayingCompanies":["company1","company2","company3"],"salaryTips":["tip1","tip2"]}',
  ].join("\n");

  return parseJSON(await ask(prompt, 400));
};

export const aiChat = async (message, context) => {
  const prompt = [
    "You are an AI assistant for HireSense, a hiring platform.",
    "",
    "CONTEXT:",
    JSON.stringify(context, null, 2),
    "",
    "USER MESSAGE: " + message,
    "",
    "Answer helpfully and concisely. Keep response under 200 words.",
    "If context has task=cover_letter, write the cover letter directly as plain text.",
  ].join("\n");

  return ask(prompt, 600);
};