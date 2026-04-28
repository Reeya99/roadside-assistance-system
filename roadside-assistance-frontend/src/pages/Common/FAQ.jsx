import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { MdKeyboardArrowDown } from "react-icons/md";
import "./Help.css"; 

const allFaqData = [
  { question: "How do I request roadside assistance?", answer: "You can request assistance by entering your location and selecting a service. We'll connect you to a nearby professional." },
  { question: "How long will it take for help to arrive?", answer: "Usually within 20–30 minutes depending on your location." },
  { question: "What services do you offer?", answer: "Towing, battery jump, fuel delivery, tyre repair, and more." },
  { question: "How much do your services cost?", answer: "Prices vary depending on service and distance." },
  { question: "Can I track my service provider?", answer: "Yes, you can track them in real-time from the app." },
  { question: "Is my payment information secure?", answer: "Yes, all payments are processed through secure, encrypted gateways." },
  { question: "What if I cancel my request?", answer: "You can cancel within the first 5 minutes without any charge." },
];

const FAQ = () => {
  const [active, setActive] = useState(null);

  return (
    <>
      <Navbar />
      <div className="main" style={{ minHeight: "calc(100vh - 70px)", paddingTop: "50px" }}>
        <div className="faq" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="faq-header">
            <h3>All Frequently Asked Questions</h3>
          </div>
          {allFaqData.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${active === index ? "active" : ""}`}
              onClick={() => setActive(active === index ? null : index)}
            >
              <div className="faq-question">
                <span>{item.question}</span>
                <MdKeyboardArrowDown className={active === index ? "rotate" : ""} />
              </div>
              {active === index && <p className="faq-answer">{item.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
