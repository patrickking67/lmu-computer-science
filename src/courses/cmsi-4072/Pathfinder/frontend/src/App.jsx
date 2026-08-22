import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

// Components
import Header from "./components/Header";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Tools from "./pages/Tools";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import Questionnaire from "./pages/Questionnaire";

const App = () => {
  const [user, loading] = useAuthState(auth);
  const [questionnaireCompleted, setQuestionnaireCompleted] = useState(false);
  
  useEffect(() => {
    // Check if user has completed questionnaire from localStorage
    if (user) {
      const savedQuestionnaire = localStorage.getItem("questionnaire");
      if (savedQuestionnaire) {
        console.log("Found saved questionnaire data");
        setQuestionnaireCompleted(true);
      } else {
        console.log("No questionnaire data found");
        setQuestionnaireCompleted(false);
      }
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Pathfinder...</p>
      </div>
    );
  }

  // If not logged in, show a simple sign-in prompt
  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Welcome to Pathfinder</h1>
          <p>Your AI-powered career assistant</p>
          <p className="auth-message">Please sign in to continue</p>
          <button 
            className="signin-btn"
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // If logged in but questionnaire not completed, show questionnaire
  if (!questionnaireCompleted) {
    console.log("Rendering questionnaire component");
    return <Questionnaire setQuestionnaireCompleted={setQuestionnaireCompleted} />;
  }

  // Main app
  return (
    <div className="app-container">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/settings" element={<Settings />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate replace to="/home" />} />
      </Routes>
      <Navbar />
    </div>
  );
};

export default App;