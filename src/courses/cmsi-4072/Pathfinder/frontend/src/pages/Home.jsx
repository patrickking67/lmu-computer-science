import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaArrowRight, FaFileAlt, FaBriefcase, FaComment, FaEdit, FaCheck } from "react-icons/fa";
import "../styles.css";

const Home = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [editingSkill, setEditingSkill] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  
  useEffect(() => {
    // Get time of day greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");
    
    // Get user data from local storage
    try {
      const savedData = localStorage.getItem("questionnaire");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setUserData(parsedData);
        setSkillInput(parsedData.skills || "");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, []);

  // Enable skill editing
  const startEditSkill = () => {
    setEditingSkill(true);
  };
  
  // Save edited skill
  const saveSkill = () => {
    if (userData) {
      try {
        const updatedUserData = { ...userData, skills: skillInput };
        localStorage.setItem("questionnaire", JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        setEditingSkill(false);
      } catch (error) {
        console.error("Error saving skill:", error);
      }
    }
  };

  // Sample job recommendations based on user profile
  const suggestedJobs = [
    {
      title: userData?.jobPreferences || "Software Engineer",
      company: "Based on your profile",
      match: "98%"
    },
    {
      title: `Senior ${userData?.jobPreferences || 'Developer'}`,
      company: "Career progression path",
      match: "85%"
    },
    {
      title: `${userData?.industries || 'Technology'} Specialist`,
      company: "Industry focus",
      match: "90%"
    }
  ];

  return (
    <div className="home-container">
      <div className="welcome-banner">
        <h1>Good {timeOfDay}, {user?.displayName || "there"}!</h1>
        <p>Your personalized career journey continues here.</p>
      </div>

      <div className="user-stats-container">
        <div className="user-stats">
          <div className="stat-card">
            <h4>Career Path</h4>
            <p>{userData?.jobPreferences || "Not specified"}</p>
          </div>
          
          <div className="stat-card skills-card">
            <div className="stat-header">
              <h4>Top Skills</h4>
              {!editingSkill && (
                <button onClick={startEditSkill} className="edit-btn" aria-label="Edit skills">
                  <FaEdit />
                </button>
              )}
            </div>
            
            {editingSkill ? (
              <div className="skill-edit">
                <textarea 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)}
                  rows={3}
                  placeholder="Enter your skills..."
                />
                <button onClick={saveSkill} className="save-btn">
                  <FaCheck /> Save
                </button>
              </div>
            ) : (
              <p>{userData?.skills || "Not specified"}</p>
            )}
          </div>
          
          <div className="stat-card">
            <h4>Target Salary</h4>
            <p>${userData?.salaryExpectation ? Number(userData.salaryExpectation).toLocaleString() : "Not specified"}</p>
          </div>
        </div>
      </div>

      <div className="dashboard">
        <Link to="/tools" className="feature-link">
          <div className="feature-card">
            <div className="card-header">
              <FaFileAlt className="card-icon" />
              <h3>Resume Analyzer</h3>
            </div>
            <p>Upload your resume to get personalized feedback and improvement suggestions.</p>
            <div className="card-footer">
              <span>Analyze Resume</span> <FaArrowRight />
            </div>
          </div>
        </Link>

        <Link to="/tools" className="feature-link">
          <div className="feature-card">
            <div className="card-header">
              <FaBriefcase className="card-icon" />
              <h3>Job Matches</h3>
            </div>
            <div className="job-list">
              {suggestedJobs.map((job, index) => (
                <div key={index} className="job-item-small">
                  <div className="job-title-row">
                    <h4>{job.title}</h4>
                    <span className="match-badge">{job.match}</span>
                  </div>
                  <p className="job-company">{job.company}</p>
                </div>
              ))}
            </div>
          </div>
        </Link>

        <Link to="/chat" className="feature-link">
          <div className="feature-card">
            <div className="card-header">
              <FaComment className="card-icon" />
              <h3>AI Career Coach</h3>
            </div>
            <p>Get personalized career advice, interview tips, and industry insights.</p>
            <div className="card-footer">
              <span>Chat Now</span> <FaArrowRight />
            </div>
          </div>
        </Link>
      </div>

      <div className="career-progress">
        <h3>Your Career Journey</h3>
        <div className="progress-steps">
          <div className="step completed">
            <div className="step-number">1</div>
            <p>Profile Created</p>
          </div>
          <div className="step active">
            <div className="step-number">2</div>
            <p>Skills Assessment</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <p>Resume Optimization</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <p>Job Applications</p>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <p>Interview Prep</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;