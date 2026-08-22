import React, { useState } from "react";
import { analyzeResume, getJobEstimates } from "../api";
import "../styles.css";

const Tools = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobData, setJobData] = useState(null);
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeFeedback, setResumeFeedback] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchingJobs, setSearchingJobs] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setError(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeText(event.target.result);
    };
    reader.onerror = () => {
      setError("Failed to read the file. Please try a different file.");
    };
    
    if (selectedFile.type === "application/pdf") {
      setResumeText(`Resume: ${selectedFile.name} (PDF content would be extracted here in production)`);
    } else {
      reader.readAsText(selectedFile);
    }
  };

  const handleAnalyzeResume = async () => {
    if (!resumeText) {
      setError("Please upload a resume first");
      return;
    }
    
    setAnalyzing(true);
    setError(null);
    setResumeFeedback(null);
    
    try {
      const feedback = await analyzeResume(resumeText);
      setResumeFeedback(feedback);
    } catch (err) {
      setError("Failed to analyze resume. Please try again later.");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSearchJobs = async (e) => {
    e.preventDefault();
    
    if (!jobTitle.trim()) {
      setError("Please enter a job title");
      return;
    }
    
    if (!location.trim()) {
      setError("Please enter a location");
      return;
    }
    
    setSearchingJobs(true);
    setError(null);
    setJobData(null);
    
    try {
      const response = await getJobEstimates(jobTitle, location);
      setJobData(response);
    } catch (err) {
      setError("Failed to fetch job data. Please try again later.");
      console.error(err);
    } finally {
      setSearchingJobs(false);
    }
  };

  return (
    <div className="tools-container">
      <h2>Career Tools</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <section className="resume-section">
        <h3>Resume Analyzer</h3>
        <p className="section-desc">Upload your resume to get AI-powered feedback and improvement suggestions</p>
        
        <div className="upload-box">
          <input 
            type="file" 
            accept=".pdf,.doc,.docx,.txt" 
            onChange={handleFileChange}
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="file-upload-label">
            <div className="upload-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 11L12 8 15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 19H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            Choose a file or drag it here
          </label>
          
          {file && <div className="file-info">Selected: {file.name}</div>}
        </div>
        
        <button 
          className="analyze-btn" 
          onClick={handleAnalyzeResume} 
          disabled={analyzing || !file}
        >
          {analyzing ? "Analyzing..." : "Analyze Resume"}
        </button>
        
        {resumeFeedback && (
          <div className="feedback-container">
            <h4>Resume Analysis Results</h4>
            <div className="feedback-content">
              {resumeFeedback.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </section>
      
      <section className="job-section">
        <h3>Salary Estimator</h3>
        <p className="section-desc">Get AI-powered salary estimates for your target roles</p>
        
        <form className="job-form" onSubmit={handleSearchJobs}>
          <div className="input-group">
            <label htmlFor="jobTitle">Job Title</label>
            <input 
              id="jobTitle"
              type="text" 
              placeholder="e.g., Software Engineer" 
              value={jobTitle} 
              onChange={(e) => setJobTitle(e.target.value)} 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="location">Location</label>
            <input 
              id="location"
              type="text" 
              placeholder="e.g., San Francisco, CA" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
            />
          </div>
          
          <button 
            type="submit"
            className="search-btn" 
            disabled={searchingJobs}
          >
            {searchingJobs ? "Searching..." : "Get Salary Estimate"}
          </button>
        </form>

        {jobData && (
          <div className="job-results">
            <h4>Salary Information</h4>
            <div className="job-result-content">
              {jobData.data[0].estimated_salary.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Tools;