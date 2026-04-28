import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Welcome Back</h2>
        <p>Login to your Roadside AAA account</p>
        {error && <div style={{ color: '#ef4444', marginBottom: '15px', fontSize: '14px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}
        <form className="auth-form" onSubmit={handleLogin}>
          <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
          <div style={{ textAlign: "right", marginTop: "-10px" }}>
            <Link to="/forgot-password" style={{ fontSize: "12px", color: "#60a5fa", textDecoration: "none" }}>Forgot Password?</Link>
          </div>
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Log In"}</button>
        </form>
        <div className="auth-links">
          <span>Don't have an account? <Link to="/signup">Sign Up</Link></span>
          <br />
          <Link to="/" style={{display: 'inline-block', marginTop: '10px'}}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
