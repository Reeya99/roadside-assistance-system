import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './About.css';

const About = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [activeTimeline, setActiveTimeline] = useState(2);

  const cards = [
    {
      id: 1,
      title: 'Our Mission',
      description: 'To deliver fast, reliable and transparent roadside assistance that brings peace of mind to every driver.',
      icon: '🎯',
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      id: 2,
      title: 'Our Vision',
      description: 'To become the most trusted roadside assistance platform, making help accessible everywhere, every time.',
      icon: '👁️',
      color: '#10B981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      id: 3,
      title: 'Our Values',
      description: 'Customer First, Trust & Transparency, Safety & Reliability, Continuous Improvement',
      icon: '❤️',
      color: '#F97316',
      bgColor: 'rgba(249, 115, 22, 0.1)',
      isList: true,
      values: ['Customer First', 'Trust & Transparency', 'Safety & Reliability', 'Continuous Improvement']
    }
  ];

  const stats = [
    { id: 1, number: '12,000+', label: 'Happy Customers', description: 'Drivers helped and counting every day', icon: '👥' },
    { id: 2, number: '25,000+', label: 'Services Completed', description: 'Successful roadside assistance delivered', icon: '✓' },
    { id: 3, number: '150+', label: 'Cities Covered', description: 'Expanding our reach across the country', icon: '🌍' },
    { id: 4, number: '4.8/5', label: 'Customer Rating', description: 'Rated by our customers for excellent support', icon: '⭐' },
    { id: 5, number: '24/7', label: 'Always Available', description: 'Omniscient our teams always here for you', icon: '⏰' }
  ];

  const timeline = [
    { year: '2018', title: 'The Beginning', description: 'Started with a simple mission to help drivers in emergency.' },
    { year: '2019', title: 'Growing Together', description: 'Expanded our network of trusted professionals in emergency.' },
    { year: '2021', title: 'Expanding Horizons', description: 'Reached more cities and introduced new services across the city.' },
    { year: '2023', title: 'Stronger Than Ever', description: 'Enhanced technology and support to deliver faster assistance.' },
    { year: '2024 & Beyond', title: 'Future Ready', description: 'Continuing our journey to be there for every driver, everywhere.' }
  ];

  return (
    <>
      <Navbar />
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-content">
            <div className="hero-label">ABOUT US</div>
            <h1 className="hero-title">We're here for you, whenever you need us.</h1>
            <div className="title-underline"></div>
            <p className="hero-description">
              Roadside AAA connects vehicle owners with trusted mechanics and towing professionals for fast, reliable and hassle-free roadside assistance.
            </p>
          </div>

          <div className="hero-image">
            <div className="image-placeholder">
              <svg viewBox="0 0 600 400" className="hero-svg">
                <defs>
                  <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <rect width="600" height="400" fill="url(#heroGrad)" rx="20" />
                <circle cx="100" cy="100" r="80" fill="#3B82F6" opacity="0.2" />
                <circle cx="500" cy="300" r="100" fill="#10B981" opacity="0.2" />
                <rect x="50" y="150" width="200" height="150" fill="#F97316" opacity="0.1" rx="10" />
                <circle cx="450" cy="120" r="60" fill="#8B5CF6" opacity="0.15" />
              </svg>
            </div>
          </div>
        </section>

        {/* Mission Vision Values Section */}
        <section className="mvv-section">
          <div className="mvv-grid">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`mvv-card ${hoveredCard === card.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ '--card-color': card.color, '--card-bg': card.bgColor }}
              >
                <div className="card-icon" style={{ color: card.color }}>
                  {card.icon}
                </div>
                <h3 className="card-title">{card.title}</h3>
                <div className="card-line"></div>

                {card.isList ? (
                  <ul className="card-list">
                    {card.values.map((value, i) => (
                      <li key={i} className="card-item">
                        <span className="checkmark">✓</span>
                        {value}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="card-description">{card.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-left">
            <h2 className="stats-title">Making a difference, one driver at a time.</h2>
            <div className="stats-underline"></div>
            <p className="stats-description">
              Our numbers reflect our commitment to quality and customer satisfaction.
            </p>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => (
              <div
                key={stat.id}
                className={`stat-card ${hoveredStat === stat.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredStat(stat.id)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-divider"></div>
                <p className="stat-text">{stat.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline-section">
          <div className="timeline-header">
            <h2 className="timeline-title">Driven by passion, built on trust.</h2>
            <div className="timeline-label">OUR JOURNEY</div>
            <div className="timeline-underline"></div>
            <p className="timeline-description">
              From a simple idea to a trusted platform, our journey continues with you.
            </p>
          </div>

          <div className="timeline-container">
            {timeline.map((item, index) => (
              <div
                key={index}
                className={`timeline-item ${activeTimeline === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveTimeline(index)}
              >
                <div className="timeline-marker">
                  <div className="marker-dot"></div>
                  <div className="marker-line"></div>
                </div>

                <div className="timeline-content">
                  <div className="timeline-year">{item.year}</div>
                  <h3 className="timeline-title-item">{item.title}</h3>
                  <p className="timeline-description-item">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
