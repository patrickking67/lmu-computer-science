import React from "react";
import { auth, logOut } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import "../styles.css";

const Header = () => {
  const [user] = useAuthState(auth);

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">Pathfinder</h1>
      </div>

      {user && (
        <div className="header-right">
          <div className="user-info">
            <img src={user.photoURL} alt="User Avatar" className="user-avatar" />
            <span className="user-name">{user.displayName}</span>
          </div>
          <button onClick={logOut} className="signout-btn">Sign Out</button>
        </div>
      )}
    </header>
  );
};

export default Header;
