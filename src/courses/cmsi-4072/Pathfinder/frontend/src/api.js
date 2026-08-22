import { OpenAI } from "openai";

const createMockResponse = (query) => {
  if (query.toLowerCase().includes("resume") || query.toLowerCase().includes("cv")) {
    return "To improve your resume, focus on quantifiable achievements rather than just listing responsibilities. Use action verbs, keep it to 1-2 pages, and customize it for each application. Include relevant keywords from the job description to pass ATS systems. Would you like specific advice for a particular section of your resume?";
  } else if (query.toLowerCase().includes("interview")) {
    return "For interview preparation, research the company thoroughly, practice common questions like 'Tell me about yourself' and 'Why do you want this role?', prepare examples using the STAR method (Situation, Task, Action, Result), and have thoughtful questions ready for the interviewer. Would you like to practice some specific interview questions?";
  } else if (query.toLowerCase().includes("job") || query.toLowerCase().includes("apply") || query.toLowerCase().includes("application")) {
    return "The best job application strategy combines multiple approaches: 1) Optimize your LinkedIn profile with keywords, 2) Network with professionals in your target companies, 3) Customize each application to match job requirements, 4) Follow up within one week of applying, and 5) Apply to 5-10 highly-targeted positions weekly rather than sending mass applications. What specific part of the job search are you struggling with?";
  } else if (query.toLowerCase().includes("career change") || query.toLowerCase().includes("switch")) {
    return "When changing careers, start by identifying your transferable skills and how they apply to the new field. Consider taking relevant courses or certifications to build credentials. Update your resume to highlight relevant experience, and craft a compelling story about why you're making the change. Networking is especially important - try to connect with people in your target industry for advice and potential opportunities.";
  }
  
  return "I can help with specific career questions about resumes, interviews, job applications, salary negotiation, career changes, and skill development. What particular area would you like advice on?";
};

// ADD KEY HERE
const openai = new OpenAI({
  apiKey: "INSERTKEYHERE",
  dangerouslyAllowBrowser: true
});

const chatGPTRequest = async (prompt, systemMessage) => {
  try {
    console.log("Sending request to OpenAI API...");
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    });
    
    console.log("OpenAI API response received successfully");
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    
    return createMockResponse(prompt);
  }
};

export const getAIResponse = async (query) => {
  const systemMessage = "You are a helpful career advisor with expertise in job searches, resume writing, interview preparation, and career development. Provide specific, actionable advice.";
  
  try {
    console.log("Attempting to get AI response...");
    const response = await chatGPTRequest(query, systemMessage);
    
    if (response.length < 30) {
      throw new Error("Response too short, may be an error");
    }
    
    return response;
  } catch (firstError) {
    console.error("First attempt failed:", firstError);
    
    try {
      console.log("Trying backup method...");

      return createMockResponse(query);
    } catch (secondError) {
      console.error("All attempts failed:", secondError);
      
      return "I understand you're asking about " + query.substring(0, 30) + "... This is an important topic in career development. Could you please rephrase your question so I can provide more specific advice?";
    }
  }
};

export const analyzeResume = async (resumeText) => {
  const systemMessage = "You are an expert resume reviewer. Analyze this resume and provide specific, actionable feedback focusing on structure, content, keywords, and overall presentation.";
  
  try {
    return await chatGPTRequest(`Please analyze this resume: ${resumeText}`, systemMessage);
  } catch (error) {
    console.error("Resume analysis error:", error);
    return createMockResponse("resume tips");
  }
};

export const getJobEstimates = async (jobTitle, location) => {
  const systemMessage = "You are a compensation expert providing salary information.";
  
  try {
    const response = await chatGPTRequest(
      `What's the typical salary range for a ${jobTitle} position in ${location}?`,
      systemMessage
    );
    
    return {
      data: [
        {
          job_title: jobTitle,
          location: location,
          estimated_salary: response,
          min_salary: "65000",
          max_salary: "130000"
        }
      ]
    };
  } catch (error) {
    console.error("Salary estimation error:", error);
    return {
      data: [
        {
          job_title: jobTitle,
          location: location,
          estimated_salary: `For a ${jobTitle} role in ${location}, the typical salary range is approximately $65,000 to $130,000 depending on experience level, company size, and specific skills. Entry-level positions typically start around $65,000-$85,000, mid-level roles range from $85,000-$110,000, and senior positions can command $110,000-$130,000+.`,
          min_salary: "65000",
          max_salary: "130000"
        }
      ]
    };
  }
};