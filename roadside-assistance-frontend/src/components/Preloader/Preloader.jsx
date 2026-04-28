import React from "react";
import "./Preloader.css";
import logo from "../../assets/images/logo.png";

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="preloader-content">
        <img src={logo} alt="Roadside AAA Logo" className="preloader-logo" />
        <div className="loader-bar">
          <div className="loader-progress"></div>
        </div>
        <p className="loading-text">Fast. Reliable. Always There.</p>
      </div>
    </div>
  );
};

export default Preloader;
