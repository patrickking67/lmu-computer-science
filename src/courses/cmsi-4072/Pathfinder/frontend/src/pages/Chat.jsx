import React, { useState, useRef, useEffect } from "react";
import { getAIResponse } from "../api";
import "../styles.css";

const Chat = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef(null);

  const starterQuestions = [
    "How can I make my resume stand out?",
    "What should I include in my LinkedIn profile?",
    "How do I prepare for a job interview?",
    "Tips for changing careers?",
    "How to negotiate salary effectively?"
  ];

  const offtopicKeywords = ["politics", "religion", "gambling", "dating", "medical advice", "legal advice", "stocks", "investments"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const isOffTopic = (text) => {
    const lowercaseText = text.toLowerCase();
    return offtopicKeywords.some(keyword => lowercaseText.includes(keyword));
  };

  const handleStarterQuestion = (question) => {
    setQuery(question);
    setTimeout(() => handleSendMessage(question), 100);
  };

  const handleSendMessage = async (overrideQuery = null) => {
    const currentQuery = overrideQuery || query;
    if (!currentQuery.trim()) return;

    const newMessages = [...messages, { sender: "You", text: currentQuery }];
    setMessages(newMessages);
    setQuery("");
    setLoading(true);

    if (isOffTopic(currentQuery)) {
      setTimeout(() => {
        setMessages([
          ...newMessages,
          { 
            sender: "AI", 
            text: "I'm designed to help with career-related questions. If you'd like assistance with your job search, resume, interview preparation, or career development, I'd be happy to help with that." 
          }
        ]);
        setLoading(false);
      }, 800);
      return;
    }

    try {
      setTimeout(async () => {
        try {
          const response = await getAIResponse(currentQuery);
          
          if (response && response.length > 20) {
            setMessages([...newMessages, { sender: "AI", text: response }]);
          } else {
            throw new Error("Received empty or very short response");
          }
        } catch (error) {
          console.error("Chat API error:", error);
          
          let fallbackResponse = "I understand your question about " + currentQuery.substring(0, 30) + "...";
          
          if (currentQuery.toLowerCase().includes("resume")) {
            fallbackResponse += " When it comes to resumes, it's important to highlight your achievements with quantifiable results, tailor it to each job application, and keep it concise and well-organized.";
          } else if (currentQuery.toLowerCase().includes("interview")) {
            fallbackResponse += " For interviews, preparation is key. Research the company, practice common questions, prepare your own questions, and be ready with examples of your past experiences using the STAR method.";
          } else if (currentQuery.toLowerCase().includes("salary") || currentQuery.toLowerCase().includes("negotiat")) {
            fallbackResponse += " For salary negotiations, research market rates for your position, highlight your value to the company, and practice your negotiation approach in advance.";
          } else {
            fallbackResponse += " This is an important aspect of career development. Could you share more details about your specific situation so I can provide more targeted advice?";
          }
          
          setMessages([
            ...newMessages,
            { sender: "AI", text: fallbackResponse }
          ]);
        } finally {
          setLoading(false);
        }
      }, 800);
    } catch (error) {
      console.error("Outer error:", error);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2>AI Career Assistant</h2>
      <p>Ask me anything about your career, resume, or job search!</p>
      
      <div className="chatbox">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <h3>Hello! I'm your AI career assistant.</h3>
            <p>I can help you with:</p>
            <ul>
              <li>Resume writing tips and feedback</li>
              <li>Interview preparation and common questions</li>
              <li>Career path planning and advice</li>
              <li>Job search strategies and techniques</li>
              <li>Skill development recommendations</li>
            </ul>
            
            <div className="starter-questions">
              <p>Popular questions to get started:</p>
              <div className="question-buttons">
                {starterQuestions.map((question, index) => (
                  <button 
                    key={index} 
                    className="starter-btn"
                    onClick={() => handleStarterQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "AI" ? "ai" : "user"}`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        
        {loading && (
          <div className="chat-message ai loading-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about career advice, resume tips, or job search strategies..."
          rows={3}
          disabled={loading}
        />
        <button 
          className="send-btn" 
          onClick={() => handleSendMessage()}
          disabled={loading || !query.trim()}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;