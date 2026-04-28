import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./Help.css";

import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { MdChat, MdKeyboardArrowDown } from "react-icons/md";

const faqData = [
  {
    question: "How do I request roadside assistance?",
    answer:
      "You can request assistance by entering your location and selecting a service. We'll connect you to a nearby professional.",
  },
  {
    question: "How long will it take for help to arrive?",
    answer: "Usually within 20–30 minutes depending on your location.",
  },
  {
    question: "What services do you offer?",
    answer: "Towing, battery jump, fuel delivery, tyre repair, and more.",
  },
  {
    question: "How much do your services cost?",
    answer: "Prices vary depending on service and distance.",
  },
  {
    question: "Can I track my service provider?",
    answer: "Yes, you can track them in real-time from the app.",
  },
];

const Help = () => {
  const [active, setActive] = useState(null);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="help-hero">
        {/* LEFT */}
        <div className="hero-left">
          <p className="tag">HELP & SUPPORT</p>
          <h1>How can we help you?</h1>
          <p className="desc">
            Find answers to common questions or contact our support team.
            We're here 24/7.
          </p>

          <input
            type="text"
            placeholder="Search for help, questions or topics..."
            className="search"
          />
        </div>

        {/* CENTER */}
        <div className="hero-center">
          <img
            src="/assets/images/support.png"
            alt="support"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>

        {/* RIGHT */}
        <div className="hero-right">
          <h4>Need immediate help?</h4>
          <p className="small">Our support team is available 24/7</p>

          <div className="support-item">
            <FaPhoneAlt />
            <div>
              <p>Call Us</p>
              <span>+1 800 123 4567</span>
            </div>
          </div>

          <div className="support-item">
            <MdChat />
            <div>
              <p>Live Chat</p>
              <span>Chat with our experts</span>
            </div>
          </div>

          <div className="support-item">
            <FaEnvelope />
            <div>
              <p>Email Us</p>
              <span>support@roadsideaaa.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="faq">
          <div className="faq-header">
            <h3>Frequently Asked Questions</h3>
            <Link to="/faq" className="view" style={{textDecoration: 'none'}}>View All FAQs →</Link>
          </div>

          {faqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${active === index ? "active" : ""}`}
              onClick={() => setActive(active === index ? null : index)}
            >
              <div className="faq-question">
                <span>{item.question}</span>
                <MdKeyboardArrowDown
                  className={active === index ? "rotate" : ""}
                />
              </div>

              {active === index && (
                <p className="faq-answer">{item.answer}</p>
              )}
            </div>
          ))}
        </div>

        <div className="topics">
          <h3>Help Topics</h3>
          <div className="topics-grid">
            <div className="card">Getting Started</div>
            <div className="card">Services & Pricing</div>
            <div className="card">Payments</div>
            <div className="card">My Account</div>
            <div className="card">Track & Updates</div>
            <div className="card">Safety & Security</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta">
        <div className="cta-left">
          <h2>Still need help?</h2>
          <p>Our support team is ready to assist you.</p>
          <button>Contact Support →</button>
        </div>

        <div className="cta-right">
          <div>User Guides</div>
          <div>Download App</div>
          <div>Send Feedback</div>
          <div>Report Issue</div>
        </div>
      </div>
    </>
  );
};

export default Help;