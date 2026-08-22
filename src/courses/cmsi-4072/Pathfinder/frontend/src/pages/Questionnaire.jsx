import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Questionnaire = ({ setQuestionnaireCompleted }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: "",
    careerGoal: "",
    currentStatus: "",
    highestEducation: "",
    fieldOfStudy: "",
    workExperience: "",
    skills: "",
    industries: "",
    jobPreferences: "",
    salaryExpectation: "",
    locationPreference: "",
    resumeUploaded: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = () => {
    setFormData({ ...formData, resumeUploaded: true });
  };

  const handleNext = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.userType || !formData.currentStatus || 
          !formData.highestEducation || !formData.fieldOfStudy) {
        setError("Please complete all required fields before continuing");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.workExperience || !formData.skills || !formData.industries) {
        setError("Please complete all required fields before continuing");
        return;
      }
    }

    setError("");
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0); // Scroll to top
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setError("");
    window.scrollTo(0, 0); // Scroll to top
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.careerGoal || !formData.jobPreferences || 
        !formData.salaryExpectation || !formData.locationPreference) {
      setError("Please complete all required fields");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      console.log("Saving questionnaire data:", formData);
      // Store in localStorage
      localStorage.setItem("questionnaire", JSON.stringify(formData));
      
      // Update the completed state
      setQuestionnaireCompleted(true);
      
      // Navigate to home with slight delay to ensure state updates
      setTimeout(() => {
        navigate("/home");
      }, 100);
    } catch (error) {
      console.error("Error saving questionnaire:", error);
      setError("There was a problem saving your profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-card">
        <div className="questionnaire-header">
          <h1>Welcome to Pathfinder</h1>
          <p>Let's customize your career journey. Complete the quick questionnaire below to get started.</p>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep/3) * 100}%` }}
            ></div>
          </div>
          <p className="step-indicator">Step {currentStep} of 3</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="questionnaire-step">
              <h2>Tell us about yourself</h2>
              
              <div className="form-group">
                <label htmlFor="userType">I am a:</label>
                <select 
                  id="userType" 
                  name="userType" 
                  value={formData.userType} 
                  onChange={handleChange}
                >
                  <option value="">Select your status</option>
                  <option value="student">Student</option>
                  <option value="recent-graduate">Recent Graduate</option>
                  <option value="professional">Working Professional</option>
                  <option value="career-changer">Career Changer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="currentStatus">Current Status:</label>
                <select 
                  id="currentStatus" 
                  name="currentStatus" 
                  value={formData.currentStatus} 
                  onChange={handleChange}
                >
                  <option value="">Select your current status</option>
                  <option value="highschool">High School Student</option>
                  <option value="college">College Student</option>
                  <option value="bachelors">Bachelor's Graduate</option>
                  <option value="masters">Master's Graduate</option>
                  <option value="phd">PhD Graduate</option>
                  <option value="selfTaught">Self-Taught</option>
                  <option value="working">Currently Employed</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="highestEducation">Highest Education:</label>
                <select 
                  id="highestEducation" 
                  name="highestEducation" 
                  value={formData.highestEducation} 
                  onChange={handleChange}
                >
                  <option value="">Select education level</option>
                  <option value="high-school">High School</option>
                  <option value="associates">Associate's Degree</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="doctorate">Doctorate</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="fieldOfStudy">Field of Study:</label>
                <input 
                  type="text" 
                  id="fieldOfStudy" 
                  name="fieldOfStudy" 
                  value={formData.fieldOfStudy} 
                  onChange={handleChange} 
                  placeholder="e.g. Computer Science, Psychology"
                />
              </div>
              
              <button type="button" className="next-btn" onClick={handleNext}>
                Next Step
              </button>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="questionnaire-step">
              <h2>Your Skills & Experience</h2>
              
              <div className="form-group">
                <label htmlFor="workExperience">Years of Work Experience:</label>
                <select 
                  id="workExperience" 
                  name="workExperience" 
                  value={formData.workExperience} 
                  onChange={handleChange}
                >
                  <option value="">Select experience</option>
                  <option value="0-1">Less than 1 year</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="skills">Key Skills:</label>
                <textarea 
                  id="skills" 
                  name="skills" 
                  value={formData.skills} 
                  onChange={handleChange} 
                  placeholder="e.g. Project Management, Java, Data Analysis"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="industries">Industries of Interest:</label>
                <input 
                  type="text" 
                  id="industries" 
                  name="industries" 
                  value={formData.industries} 
                  onChange={handleChange} 
                  placeholder="e.g. Technology, Healthcare, Finance"
                />
              </div>
              
              <div className="button-group">
                <button type="button" className="back-btn" onClick={handlePrevious}>
                  Previous
                </button>
                <button type="button" className="next-btn" onClick={handleNext}>
                  Next Step
                </button>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="questionnaire-step">
              <h2>Career Goals</h2>
              
              <div className="form-group">
                <label htmlFor="careerGoal">Primary Career Goal:</label>
                <select 
                  id="careerGoal" 
                  name="careerGoal" 
                  value={formData.careerGoal} 
                  onChange={handleChange}
                >
                  <option value="">Select your goal</option>
                  <option value="first-job">Find First Job</option>
                  <option value="new-position">Find a New Position</option>
                  <option value="career-change">Change Careers</option>
                  <option value="advancement">Advance in Current Career</option>
                  <option value="skills">Develop New Skills</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="jobPreferences">Desired Job Title:</label>
                <input 
                  type="text" 
                  id="jobPreferences" 
                  name="jobPreferences" 
                  value={formData.jobPreferences} 
                  onChange={handleChange} 
                  placeholder="e.g. Software Engineer, Product Manager"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="locationPreference">Preferred Location:</label>
                <input 
                  type="text" 
                  id="locationPreference" 
                  name="locationPreference" 
                  value={formData.locationPreference} 
                  onChange={handleChange} 
                  placeholder="e.g. San Francisco, Remote"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="salaryExpectation">Target Salary ($):</label>
                <input 
                  type="number" 
                  id="salaryExpectation" 
                  name="salaryExpectation" 
                  value={formData.salaryExpectation} 
                  onChange={handleChange} 
                  placeholder="e.g. 80000"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="resume">Upload Resume (Optional):</label>
                <input 
                  type="file" 
                  id="resume" 
                  name="resume" 
                  onChange={handleResumeUpload}
                  accept=".pdf,.doc,.docx"
                />
              </div>
              
              <div className="button-group">
                <button type="button" className="back-btn" onClick={handlePrevious}>
                  Previous
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Complete Profile"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Questionnaire;