import React, { useState } from 'react';
import './Howitwork.css';

const Howitwork = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);

  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Request Assistance',
      description: 'Enter your location and choose the service you need. We\'ll find nearby professionals for you.',
      color: '#3B82F6',
      bgColor: '#EFF6FF'
    },
    {
      id: 2,
      number: '02',
      title: 'We Find Help',
      description: 'Nearby verified professionals get your request and send their offers.',
      color: '#10B981',
      bgColor: '#F0FDF4'
    },
    {
      id: 3,
      number: '03',
      title: 'Help Is On The Way',
      description: 'Your service provider accepts the job and heads to your location.',
      color: '#F97316',
      bgColor: '#FEF3C7'
    },
    {
      id: 4,
      number: '04',
      title: 'Service Delivered',
      description: 'The professional reaches you and provides the service you need.',
      color: '#8B5CF6',
      bgColor: '#FAF5FF'
    },
    {
      id: 5,
      number: '05',
      title: 'Rate & Review',
      description: 'Once the job is done, you can rate the service and help others make the right choice.',
      color: '#EF4444',
      bgColor: '#FEF2F2'
    }
  ];

  const benefits = [
    {
      id: 1,
      title: 'Verified Professionals',
      description: 'All our professionals are verified and background checked.',
      icon: '🛡️',
      color: '#3B82F6'
    },
    {
      id: 2,
      title: 'Quick Response',
      description: 'We connect you with nearby help, fast.',
      icon: '⏱️',
      color: '#10B981'
    },
    {
      id: 3,
      title: 'Transparent Pricing',
      description: 'No hidden charges. What you see is what you pay.',
      icon: '💳',
      color: '#F97316'
    },
    {
      id: 4,
      title: 'Real-time Tracking',
      description: 'Track your service provider in real-time until help arrives.',
      icon: '📍',
      color: '#8B5CF6'
    },
    {
      id: 5,
      title: '24/7 Support',
      description: 'Our support team is available anytime you need us.',
      icon: '🎧',
      color: '#EF4444'
    }
  ];

  return (
    <div className="howitwork-container">
      {/* Header Section */}
      <section className="howitwork-header">
        <div className="header-decoration-left">📍</div>
        <div className="header-decoration-right">📍</div>
        
        <h1 className="header-title">How It Works</h1>
        <p className="header-subtitle">
          Getting help on the road is simple and quick.
          <br />
          We're with you at every step.
        </p>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <div className="steps-container">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className={`step-card ${activeStep === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveStep(index)}
                style={{
                  '--step-color': step.color,
                  '--step-bg': step.bgColor,
                }}
              >
                {/* Step Number */}
                <div className="step-number" style={{ color: step.color }}>
                  {step.number}
                </div>

                {/* Step Icon/Image */}
                <div className="step-icon-container">
                  <div className="step-icon" style={{ borderColor: step.color, backgroundColor: step.bgColor }}>
                    {step.id === 1 && '📱'}
                    {step.id === 2 && '🔔'}
                    {step.id === 3 && '🚗'}
                    {step.id === 4 && '🔧'}
                    {step.id === 5 && '⭐'}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="step-title">{step.title}</h3>

                {/* Step Description */}
                <p className="step-description">{step.description}</p>

                {/* Underline */}
                <div className="step-underline" style={{ backgroundColor: step.color }}></div>
              </div>

              {/* Navigation Arrow */}
              {index < steps.length - 1 && (
                <div className="step-arrow" style={{ color: steps[index + 1].color }}>
                  ›
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <h2 className="benefits-title">Why Choose Roadside AAA?</h2>
        <div className="benefits-underline"></div>

        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className={`benefit-card ${hoveredBenefit === benefit.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredBenefit(benefit.id)}
              onMouseLeave={() => setHoveredBenefit(null)}
            >
              {/* Benefit Icon */}
              <div className="benefit-icon" style={{ color: benefit.color }}>
                {benefit.icon}
              </div>

              {/* Benefit Title */}
              <h3 className="benefit-title">{benefit.title}</h3>

              {/* Benefit Description */}
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Howitwork;
