import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaTools, FaComments, FaBook, FaCog } from "react-icons/fa";
import "../styles.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="footer">
      <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>
        <FaHome size={22} />
        <span>Home</span>
      </Link>
      <Link to="/tools" className={location.pathname === "/tools" ? "active" : ""}>
        <FaTools size={22} />
        <span>Tools</span>
      </Link>
      <Link to="/chat" className={location.pathname === "/chat" ? "active" : ""}>
        <FaComments size={22} />
        <span>Chat</span>
      </Link>
      <Link to="/resources" className={location.pathname === "/resources" ? "active" : ""}>
        <FaBook size={22} />
        <span>Learn</span>
      </Link>
      <Link to="/settings" className={location.pathname === "/settings" ? "active" : ""}>
        <FaCog size={22} />
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default Navbar;