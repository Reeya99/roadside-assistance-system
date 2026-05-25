import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import "./RequestAssistance.css";

const RequestAssistance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState("");
  const [locationStr, setLocationStr] = useState("");
  const [description, setDescription] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [acceptedRequest, setAcceptedRequest] = useState(null);

  // Review & Rating State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Poll for request status until completed or cancelled
  useEffect(() => {
    let pollInterval = null;

    if (isConnecting) {
      const checkStatus = async () => {
        try {
          const res = await axios.get("/requests/current-active");
          if (res.data) {
            setAcceptedRequest(res.data);
            if (res.data.status === "completed") {
              if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
              }
            }
          } else {
            // If request not found (cancelled)
            setAcceptedRequest(null);
            setIsConnecting(false);
          }
        } catch (err) {
          console.error("Error checking request status:", err);
        }
      };

      // Check immediately
      checkStatus();

      // Poll every 3 seconds
      pollInterval = setInterval(checkStatus, 3000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isConnecting]);

  useEffect(() => {
    if (!user) {
      alert("Please log in first to request assistance.");
      navigate("/login");
      return;
    }
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get("service");
    if (serviceParam) {
      setService(serviceParam);
    }
  }, [location, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAcceptedRequest(null);
    setReviewSubmitted(false);
    setRating(5);
    setComment("");
    setIsConnecting(true);
    try {
      await axios.post('/requests', { serviceName: service, location: locationStr, description });
    } catch (err) {
      alert(err.response?.data?.error || "Failed to request assistance. Did you add a vehicle to your profile?");
      setIsConnecting(false);
    }
  };

  const handleCancelService = () => {
    setIsConnecting(false);
    setAcceptedRequest(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedRequest) return;
    try {
      await axios.post(`/requests/${acceptedRequest.id}/review`, { rating, comment });
      setReviewSubmitted(true);
      setTimeout(() => {
        setIsConnecting(false);
        setAcceptedRequest(null);
        navigate("/history");
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to submit review.");
    }
  };

  // 1. COMPLETED FEEDBACK SCREEN
  if (acceptedRequest && acceptedRequest.status === "completed") {
    const mechanicUser = acceptedRequest.mechanic?.user || {};

    return (
      <>
        <Navbar />
        <div className="tracking-container">
          <div className="tracking-box" style={{ maxWidth: "500px" }}>
            {reviewSubmitted ? (
              <div style={{ padding: "20px 0" }}>
                <div className="success-icon-wrapper" style={{ marginBottom: "20px" }}>
                  <FaCheck />
                </div>
                <h2>Thank You!</h2>
                <p>Your feedback helps us maintain high quality service.</p>
                <p style={{ fontSize: "13px", color: "var(--link-color)", marginTop: "20px" }}>
                  Redirecting to history...
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="tracking-header">
                  <h2>Rate Your Service</h2>
                  <p>How was your experience with <strong>{mechanicUser.name || "your specialist"}</strong>?</p>
                </div>

                <div className="provider-info-flex" style={{ justifyContent: "center", marginBottom: "30px", background: "var(--bg-color)", padding: "16px", borderRadius: "12px" }}>
                  <img src={mechanicUser.profileImage || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=250&auto=format&fit=crop"} alt="Mechanic" className="provider-avatar" />
                  <div style={{ textAlign: "left" }}>
                    <div className="provider-name" style={{ fontSize: "16px" }}>{mechanicUser.name || "Specialist"}</div>
                    <div style={{ fontSize: "13px", color: "var(--link-color)" }}>Assistance provider</div>
                  </div>
                </div>

                <div style={{ marginBottom: "30px" }}>
                  <label style={{ display: "block", fontWeight: "700", marginBottom: "10px", fontSize: "14px" }}>YOUR RATING</label>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star}
                        style={{
                          fontSize: "36px",
                          cursor: "pointer",
                          color: star <= (hoverRating || rating) ? "#fbbf24" : "#d1d5db",
                          transition: "color 0.15s ease"
                        }}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group" style={{ textAlign: "left", marginBottom: "24px" }}>
                  <label style={{ fontWeight: "700", fontSize: "13px" }}>SHARE YOUR COMMENTS</label>
                  <textarea 
                    placeholder="Tell us what went well or how they can improve..." 
                    rows="3" 
                    value={comment} 
                    onChange={e => setComment(e.target.value)}
                    style={{ background: "var(--bg-color)", border: "1px solid var(--border-color)", resize: "none" }}
                  ></textarea>
                </div>

                <button type="submit" className="action-btn-primary" style={{ width: "100%" }}>
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </>
    );
  }

  // 2. LIVE TRACKING SCREEN
  if (acceptedRequest) {
    const mechanicUser = acceptedRequest.mechanic?.user || {};
    const ratingVal = acceptedRequest.mechanic?.rating || 5.0;
    const experience = acceptedRequest.mechanic?.experience || 3;
    const mechanicProfilePic = mechanicUser.profileImage || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=250&auto=format&fit=crop";
    const status = acceptedRequest.status;

    // Determine sub-banner text depending on actual milestone status
    let statusSubtitle = "A certified service provider has accepted your request.";
    if (status === "on_the_way") {
      statusSubtitle = "The service provider is driving to your location now.";
    } else if (status === "arrived") {
      statusSubtitle = "The service provider has arrived at your location.";
    }

    return (
      <>
        <Navbar />
        <div className="tracking-container">
          <div className="tracking-box">
            <div className="tracking-header">
              <h2>Help is on the Way!</h2>
              <p>{statusSubtitle}</p>
            </div>

            {/* Dynamic Milestone Steps Progress Tracker */}
            <div className="steps-tracker">
              <div className="tracker-line-fill" style={{ 
                width: status === "accepted" ? "15%" :
                       status === "on_the_way" ? "50%" :
                       status === "arrived" ? "85%" : "100%" 
              }}></div>
              
              <div className="step-item active">
                <div className="step-icon-wrapper">1</div>
                <div className="step-label">Requested</div>
              </div>
              
              <div className={`step-item ${status !== "accepted" ? "active" : "pending"}`}>
                <div className="step-icon-wrapper">2</div>
                <div className="step-label">On the Way</div>
              </div>
              
              <div className={`step-item ${status === "arrived" || status === "completed" ? "active" : (status === "on_the_way" ? "pending" : "")}`}>
                <div className="step-icon-wrapper">3</div>
                <div className="step-label">Arrived</div>
              </div>
              
              <div className={`step-item ${status === "completed" ? "active" : (status === "arrived" ? "pending" : "")}`}>
                <div className="step-icon-wrapper">4</div>
                <div className="step-label">Completed</div>
              </div>
            </div>

            <div className="info-section-grid">
              {/* Provider Info Card */}
              <div className="info-card">
                <div className="info-card-title">Assigned Professional</div>
                <div className="provider-info-flex">
                  <img src={mechanicProfilePic} alt="Mechanic Profile" className="provider-avatar" />
                  <div className="provider-meta-details">
                    <div className="provider-name">{mechanicUser.name || "Specialist"}</div>
                    <div className="provider-subtext">
                      <span className="rating-badge-inline">★ {ratingVal.toFixed(1)}</span>
                      <span>• {experience} years experience</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Request Info Card */}
              <div className="info-card">
                <div className="info-card-title">Request Details</div>
                <div className="info-row-item">
                  <div className="info-row-label">Service:</div>
                  <div className="info-row-val">{acceptedRequest.service?.name}</div>
                </div>
                <div className="info-row-item">
                  <div className="info-row-label">Location:</div>
                  <div className="info-row-val">{acceptedRequest.pickupLocation?.address}</div>
                </div>
                {acceptedRequest.description && (
                  <div className="info-row-item">
                    <div className="info-row-label">Notes:</div>
                    <div className="info-row-val" style={{ fontStyle: "italic" }}>"{acceptedRequest.description}"</div>
                  </div>
                )}
              </div>
            </div>

            <div className="action-buttons-flex">
              {mechanicUser.phone && (
                <a href={`tel:${mechanicUser.phone}`} style={{ flex: 1, textDecoration: "none" }}>
                  <button className="action-btn-primary" style={{ width: "100%" }}>
                    Call Provider ({mechanicUser.phone})
                  </button>
                </a>
              )}
              <button className="action-btn-secondary" onClick={() => {
                setIsConnecting(false);
                setAcceptedRequest(null);
                navigate("/history");
              }}>
                View History
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isConnecting) {
    return (
      <>
        <Navbar />
        <div className="connecting-container">
          <div className="connecting-box">
            <div className="loader"></div>
            <h2>Connecting You Now</h2>
            <p>We are searching for the nearest professional for your <strong>{service}</strong> request.</p>
            <div className="dots">
              <span></span><span></span><span></span>
            </div>
            <button className="submit-btn" onClick={handleCancelService} style={{marginTop: "30px", background: "#ef4444"}}>Cancel Service</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="request-page">
        <div className="request-left">
          <h1>Request Assistance</h1>
          <p>Fill out the details below and we'll send a professional your way immediately.</p>
          
          <form className="request-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Service Needed</label>
              <select 
                required 
                value={service} 
                onChange={(e) => setService(e.target.value)}
              >
                <option value="">Select a service...</option>
                <option value="Breakdown Repair">Breakdown Repair</option>
                <option value="Towing Service">Towing Service</option>
                <option value="Battery Jump-start">Battery Jump-start</option>
                <option value="Flat Tire Repair">Flat Tire Repair</option>
                <option value="Fuel Delivery">Fuel Delivery</option>
                <option value="Lockout Service">Lockout Service</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Current Location</label>
              <input type="text" placeholder="E.g., Highway 401, Exit 20" required value={locationStr} onChange={e => setLocationStr(e.target.value)} />
            </div>

            <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Make</label>
                <input type="text" placeholder="e.g. Honda" required defaultValue={user?.vehicle?.make || ""} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Model</label>
                <input type="text" placeholder="e.g. Civic" required defaultValue={user?.vehicle?.model || ""} />
              </div>
            </div>
            
            <div className="form-row" style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Color</label>
                <input type="text" placeholder="e.g. Blue" required defaultValue={user?.vehicle?.color || ""} />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>License Plate</label>
                <input type="text" placeholder="e.g. ABC-1234" required defaultValue={user?.vehicle?.plate || ""} />
              </div>
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea placeholder="Any specific instructions or details..." rows="3" value={description} onChange={e => setDescription(e.target.value)}></textarea>
            </div>

            <button type="submit" className="submit-btn">Find Professional Nearby</button>
          </form>
        </div>
        <div className="request-right">
          <div className="map-placeholder">
            <div className="pulse-circle"></div>
            <p>Locating help near you...</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestAssistance;
