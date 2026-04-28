import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);

  const handleResetRequest = (e) => {
    e.preventDefault();
    setStep(2); // Move to enter new password step
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setStep(3); // Success step
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {step === 1 && (
          <>
            <h2>Reset Password</h2>
            <p>Enter your email to reset your password</p>
            <form className="auth-form" onSubmit={handleResetRequest}>
              <input type="email" placeholder="Email Address" required />
              <button type="submit">Send Reset Link</button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Change Password</h2>
            <p>Enter your new password below</p>
            <form className="auth-form" onSubmit={handlePasswordChange}>
              <input type="password" placeholder="New Password" required />
              <input type="password" placeholder="Confirm New Password" required />
              <button type="submit">Change Password</button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Password Changed!</h2>
            <p style={{ color: "#4ade80", fontWeight: "bold" }}>Your password has been successfully updated.</p>
            <Link to="/login"><button className="submit-btn" style={{ width: "100%", marginTop: "15px" }}>Return to Login</button></Link>
          </>
        )}

        {step < 3 && (
          <div className="auth-links">
            <Link to="/login" style={{ display: "inline-block", marginTop: "15px" }}>← Back to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
