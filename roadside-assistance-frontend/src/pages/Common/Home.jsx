import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>Stuck on the road?<br />We’re just a call away.</h1>
          <p>Fast, reliable and nearby roadside assistance anytime, anywhere.</p>

          <div className="hero-buttons">
            <Link to="/request"><button className="primary">Request Assistance</button></Link>
            <Link to="/how"><button className="secondary">How it Works</button></Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services">
        <h2>What can we help you with?</h2>

        <div className="service-grid">
          {[
            { name: "Breakdown Repair", icon: "⚙️", desc: "Expert diagnostics and minor repairs on-site." },
            { name: "Towing Service", icon: "🚚", desc: "Safe and secure vehicle towing to your destination." },
            { name: "Battery Jump-start", icon: "⚡", desc: "Quick battery jump-start to get you moving again." },
            { name: "Flat Tire Repair", icon: "🛞", desc: "Tire change and pressure check at your location." },
            { name: "Fuel Delivery", icon: "⛽", desc: "Emergency fuel delivery if you run out on the road." }
          ].map((service, i) => (
            <Link 
              to={`/request?service=${encodeURIComponent(service.name)}`} 
              key={i} 
              className="service-card"
            >
              <div className="icon">{service.icon}</div>
              <p>{service.name}</p>
              <div className="service-hover-desc">{service.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="why">
        <h2>Why choose Roadside AAA?</h2>

        <div className="why-grid">
          <div className="why-card">✔ Verified Professionals</div>
          <div className="why-card">📍 Real-time Tracking</div>
          <div className="why-card">💰 Transparent Pricing</div>
          <div className="why-card">⏰ 24/7 Support</div>
        </div>
      </section>
    </>
  );
};

export default Home;