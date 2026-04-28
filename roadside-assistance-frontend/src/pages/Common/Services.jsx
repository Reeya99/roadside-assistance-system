import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Services.css";
import Navbar from "../../components/Navbar/Navbar";

const colorMap = ["blue", "green", "orange", "purple", "red"];

const Services = () => {
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make sure we hit the correct URL even if AuthContext hasn't mounted it yet
    axios.get("http://localhost:5000/api/services")
      .then(res => {
        setServicesList(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch services", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="services-hero">
        <div className="text">
          <p className="tag">OUR SERVICES</p>
          <h1>We’re here to get you<br />back on the road</h1>
          <p>Choose the right service and get help instantly.</p>
        </div>
      </section>

      {/* CARDS */}
      <section className="services-grid">
        {loading ? (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: 'var(--text-color)'}}>Loading services...</div>
        ) : servicesList.map((s, i) => (
          <div key={s.id || i} className={`card ${colorMap[i % colorMap.length]}`}>
            <h3>{s.name}</h3>
            <ul>
              {s.description ? s.description.split(',').map((f, idx) => (
                <li key={idx}>✔ {f.trim()}</li>
              )) : <li>✔ Standard Service</li>}
            </ul>

            <div className="bottom">
              <span>Starting from <b>${s.basePrice}</b></span>
              <Link to={`/request?service=${encodeURIComponent(s.name)}`}>
                <button>Request Now →</button>
              </Link>
            </div>
          </div>
        ))}

        {/* HELP BOX */}
        <div className="help-box">
          <h3>Need help choosing?</h3>
          <p>Contact our support team</p>

          <div className="help-item">📞 Call Us</div>
          <div className="help-item">💬 Live Chat</div>
          <div className="help-item">⏰ 24/7 Support</div>
        </div>
      </section>
    </>
  );
};

export default Services;