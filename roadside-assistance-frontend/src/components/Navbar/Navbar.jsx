import React, { useState } from "react";
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import logo from "../../assets/images/logo.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="navbar">
      <Link to="/" className="logo-container">
        <img src={logo} alt="Roadside AAA" className="navbar-logo" />
      </Link>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/services" onClick={() => setMenuOpen(false)}>Services</NavLink></li>
        <li><NavLink to="/how" onClick={() => setMenuOpen(false)}>How It Works</NavLink></li>
        <li><NavLink to="/about" onClick={() => setMenuOpen(false)}>About Us</NavLink></li>
        <li><NavLink to="/help" onClick={() => setMenuOpen(false)}>Help</NavLink></li>
        
        {/* Mobile buttons inside menu */}
        <li className="mobile-buttons">
          {user ? (
            <button className="logout-btn" onClick={() => { logout(); setMenuOpen(false); }}>Log Out</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}><button className="login">Log In</button></Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}><button className="signup">Sign Up</button></Link>
            </>
          )}
        </li>
      </ul>

      <div className="nav-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>

        {user ? (
          <div className="user-profile">
            <div className="user-info" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <img src={user.profilePic} alt="Profile" className="profile-pic" />
              <span className="user-name">{user.name}</span>
            </div>
            {dropdownOpen && (
              <div className="profile-dropdown">
                <Link to="/profile" onClick={() => setDropdownOpen(false)}>Profile Setting</Link>
                <div className="divider"></div>
                <button onClick={() => { logout(); setDropdownOpen(false); }}>Log Out</button>
              </div>
            )}
          </div>
        ) : (
          <div className="nav-buttons">
            <Link to="/login"><button className="login">Log In</button></Link>
            <Link to="/signup"><button className="signup">Sign Up</button></Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;