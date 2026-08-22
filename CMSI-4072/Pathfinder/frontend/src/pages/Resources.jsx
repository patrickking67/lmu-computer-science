import React from "react";

const Resources = () => {
  return (
    <div className="resources-container">
      <h2>Career & Learning Resources</h2>
      <div className="resource-list">
        {[
          { name: "LinkedIn", icon: "💼", description: "Build your professional network", link: "https://www.linkedin.com" },
          { name: "Coursera", icon: "📚", description: "Top online courses for career growth", link: "https://www.coursera.org" },
          { name: "LeetCode", icon: "📖", description: "Prepare for technical interviews", link: "https://leetcode.com" },
          { name: "Indeed", icon: "🎯", description: "Find job openings and salary insights", link: "https://www.indeed.com" },
          { name: "Glassdoor", icon: "💰", description: "Get salary estimates and company reviews", link: "https://www.glassdoor.com" },
          { name: "GitHub", icon: "🐙", description: "Showcase your projects to recruiters", link: "https://github.com" },
        ].map((resource, index) => (
          <div key={index} className="resource-card">
            <h3>{resource.icon} {resource.name}</h3>
            <p>{resource.description}</p>
            <a href={resource.link} target="_blank" rel="noopener noreferrer">Visit</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resources;
