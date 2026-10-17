const { OpenAI } = require('openai');
const env = require('../config/env');

let openai = null;
if (env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
}

const SYSTEM_PROMPT = `
You are GrabJob AI, an intelligent, empathetic, and highly practical career and job search assistant for job seekers in India.
Your mission:
1. Help candidates discover suitable jobs, walk-in interviews, and freelance projects across Indian cities (e.g. Chandigarh, Mohali, Delhi NCR, Bangalore, Pune, Hyderabad, Mumbai, etc.).
2. Offer concrete resume improvement suggestions to pass Applicant Tracking Systems (ATS).
3. Provide realistic interview preparation tips and mock questions.
4. Explain job descriptions, required technical/soft skills, and salary expectations in INR (LPA or monthly).
5. Guide candidates through the GrabJob platform (e.g. Interview Assistance ₹100, ATS Resume Builder ₹50).

CRITICAL RULES:
- Never make false or deceptive promises such as guaranteed employment or fake job guarantees.
- Never fabricate work experience, education, certifications, or companies.
- Always recommend candidates highlight authentic skills and tailor them to job descriptions.
- Keep answers concise, actionable, and formatted in clean markdown with bullet points.
`;

/**
 * Handle conversational career assistant queries
 */
const chatCareerAssistant = async (messages, userContext = {}) => {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...(userContext.name
            ? [
                {
                  role: 'system',
                  content: `Candidate Context: Name=${userContext.name}, City=${userContext.city || 'India'}, Skills=${(userContext.skills || []).join(', ')}, CurrentRole=${userContext.currentRole || 'Job Seeker'}`,
                },
              ]
            : []),
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 600,
      });

      return {
        success: true,
        reply: response.choices[0]?.message?.content || 'I am ready to help you with your job search!',
      };
    } catch (error) {
      console.warn('[AI Service] OpenAI API error, using smart fallback:', error.message);
    }
  }

  // Smart fallback response for development without OpenAI API Key
  const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
  let fallbackReply = '';

  if (lastUserMsg.includes('find job') || lastUserMsg.includes('search job') || lastUserMsg.includes('looking for')) {
    fallbackReply = `Here are some immediate recommendations for your job search on **GrabJob**:
- **Explore Walk-ins**: Check our "Walk-in Jobs" tab for same-week walk-in interviews in Chandigarh, Mohali, Delhi NCR, and Bangalore.
- **Filter by Location & Experience**: Use our distance radius slider on the map to discover opportunities within 10 km of your current address.
- **Set Up Alerts**: Make sure your profile has current skills and preferred salary filled in so matching employers can reach you.`;
  } else if (lastUserMsg.includes('resume') || lastUserMsg.includes('cv') || lastUserMsg.includes('ats')) {
    fallbackReply = `Here are top ATS-friendly resume tips for the Indian market:
1. **Use Single Column Layout**: Multi-column tables often confuse ATS parsers.
2. **Standard Section Headers**: Stick to *Summary*, *Work Experience*, *Technical Skills*, and *Education*.
3. **Quantify Achievements**: Instead of "managed customer queries", write "handled 60+ daily customer queries maintaining 96% CSAT".
4. **Try GrabJob ATS Builder**: Upload your resume to our ATS Builder (₹50) to extract keywords tailored to your target job!`;
  } else if (lastUserMsg.includes('interview') || lastUserMsg.includes('prep') || lastUserMsg.includes('question')) {
    fallbackReply = `Top interview preparation tips:
- **STAR Method**: For behavioral questions, structure your answers using **S**ituation, **T**ask, **A**ction, and **R**esult.
- **Research the Company**: Learn about recent news, core products, and company culture before joining the call.
- **GrabJob Interview Assistance (₹100)**: Our coordinators help streamline scheduling for verified openings!`;
  } else if (lastUserMsg.includes('skill') || lastUserMsg.includes('learn')) {
    fallbackReply = `High-demand skills currently trending across top Indian employers:
- **IT & Software**: React, Node.js, Next.js, Python, AWS, Docker, MongoDB.
- **Data & AI**: SQL, Power BI, Python, Prompt Engineering.
- **Customer Support & Sales**: CRM tools (Salesforce/HubSpot), active listening, English & regional language fluency.`;
  } else {
    fallbackReply = `Hello! I am your **GrabJob AI Career Assistant** 🤖. 

I can help you:
- **Find jobs & walk-ins** near your city
- **Review and optimize** your resume for ATS compliance
- **Prepare mock questions** for upcoming interviews
- **Assess salary ranges** and skill requirements for Indian tech & non-tech roles

How can I assist your career journey today?`;
  }

  return {
    success: true,
    reply: fallbackReply,
  };
};

/**
 * AI analysis of candidate resume against target job
 */
const analyzeResume = async ({ resumeText, jobTitle, jobRequirements = [] }) => {
  if (openai) {
    try {
      const prompt = `
Analyze the candidate resume text against the target job: "${jobTitle}".
Requirements: ${jobRequirements.join(', ')}

Resume Content:
${resumeText.substring(0, 3000)}

Return ONLY valid JSON matching this schema:
{
  "matchScore": number (0-100),
  "matchingSkills": string[],
  "missingSkills": string[],
  "keywordSuggestions": string[],
  "formattingIssues": string[],
  "improvementTips": string[]
}
`;
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
      });

      const parsed = JSON.parse(response.choices[0].message.content);
      return parsed;
    } catch (error) {
      console.warn('[AI Service] OpenAI Resume Analysis failed, using heuristic fallback:', error.message);
    }
  }

  // Smart heuristic resume matcher fallback
  const commonTechSkills = [
    'JavaScript',
    'React',
    'Node.js',
    'Express',
    'MongoDB',
    'SQL',
    'HTML',
    'CSS',
    'Git',
    'Communication',
    'Problem Solving',
    'Teamwork',
    'Python',
    'Java',
    'AWS',
    'REST API',
    'TypeScript',
  ];

  const lowerText = (resumeText || '').toLowerCase();
  const matched = commonTechSkills.filter((s) => lowerText.includes(s.toLowerCase()));
  const missing = commonTechSkills.filter((s) => !lowerText.includes(s.toLowerCase())).slice(0, 4);

  return {
    matchScore: Math.min(85, Math.max(60, matched.length * 12)),
    matchingSkills: matched.length > 0 ? matched : ['Communication', 'Teamwork', 'Computer Literacy'],
    missingSkills: missing.length > 0 ? missing : ['Cloud Services (AWS/GCP)', 'Unit Testing', 'CI/CD'],
    keywordSuggestions: [
      'Agile / Scrum methodology',
      'Cross-functional collaboration',
      'Performance optimization',
      'API integration',
    ],
    formattingIssues: [
      'Ensure contact details (Phone, Email, LinkedIn) are at the top header.',
      'Use standard reverse-chronological order for work experience.',
    ],
    improvementTips: [
      'Quantify results with measurable KPIs (e.g. "increased efficiency by 25%").',
      'Ensure technical skills mirror exact keywords from the target job posting.',
      'Keep resume length to 1-2 pages maximum for optimal recruiter readability.',
    ],
  };
};

module.exports = {
  chatCareerAssistant,
  analyzeResume,
};
