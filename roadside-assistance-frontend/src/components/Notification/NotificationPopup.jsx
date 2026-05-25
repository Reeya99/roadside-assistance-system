// NotificationPopup.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FaTimes, FaCheck, FaExclamationTriangle, FaMapMarkerAlt, FaWrench, FaPhone, FaCar } from "react-icons/fa";
import "./NotificationPopup.css";

const NotificationPopup = () => {
  const { user } = useAuth();
  const [activeRequest, setActiveRequest] = useState(null);
  const [successData, setSuccessData] = useState(null);
  const dismissedIds = useRef(new Set());
  const pollingInterval = useRef(null);

  useEffect(() => {
    // If user is not logged in, clear active requests and stop polling
    if (!user) {
      setActiveRequest(null);
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
      return;
    }

    const fetchActiveRequests = async () => {
      try {
        const res = await axios.get("/requests/active");
        if (res.data && res.data.length > 0) {
          // Find the most recent active request that hasn't been dismissed
          const latest = res.data.find(req => !dismissedIds.current.has(req.id));
          if (latest) {
            setActiveRequest(latest);
          } else {
            setActiveRequest(null);
          }
        } else {
          setActiveRequest(null);
        }
      } catch (err) {
        console.error("Error polling active requests:", err);
      }
    };

    // Run immediately on login
    fetchActiveRequests();

    // Poll every 3.5 seconds
    pollingInterval.current = setInterval(fetchActiveRequests, 3500);

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    };
  }, [user]);

  const handleDismiss = () => {
    if (activeRequest) {
      dismissedIds.current.add(activeRequest.id);
      setActiveRequest(null);
    }
  };

  const handleAccept = async () => {
    if (!activeRequest) return;
    try {
      const res = await axios.put(`/requests/${activeRequest.id}/accept`);
      setSuccessData(res.data);
      dismissedIds.current.add(activeRequest.id);
      setActiveRequest(null);
    } catch (err) {
      alert(err.response?.data?.error || "Could not accept request. Maybe it was already taken!");
      handleDismiss();
    }
  };

  if (successData) {
    const requester = successData.user || {};
    const vehicle = successData.vehicle || (requester.vehicles && requester.vehicles[0]) || {};

    return (
      <div className="success-modal-overlay">
        <div className="success-modal">
          <div className="success-icon-wrapper">
            <FaCheck />
          </div>
          <h2>Request Accepted!</h2>
          <p>
            You are now assigned to assist <strong>{requester.name}</strong>. Please reach out to them and head to their location immediately.
          </p>

          <div className="success-details">
            <div className="success-detail-row">
              <div className="success-label"><FaWrench /> Service</div>
              <div className="success-val">{successData.service?.name}</div>
            </div>
            <div className="success-detail-row">
              <div className="success-label"><FaMapMarkerAlt /> Location</div>
              <div className="success-val">{successData.pickupLocation?.address || "Not Specified"}</div>
            </div>
            {requester.phone && (
              <div className="success-detail-row">
                <div className="success-label"><FaPhone /> Phone</div>
                <div className="success-val">{requester.phone}</div>
              </div>
            )}
            <div className="success-detail-row">
              <div className="success-label"><FaCar /> Vehicle</div>
              <div className="success-val">
                {vehicle.color || ""} {vehicle.brand || ""} {vehicle.model || ""} 
                {vehicle.vehicleNumber ? ` (${vehicle.vehicleNumber})` : ""}
              </div>
            </div>
            {successData.description && (
              <div className="success-detail-row" style={{ marginTop: '8px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '8px' }}>
                <div className="success-label">Notes</div>
                <div className="success-val" style={{ fontStyle: 'italic' }}>"{successData.description}"</div>
              </div>
            )}
          </div>

          <button className="success-close-btn" onClick={() => setSuccessData(null)}>
            Got it, On My Way!
          </button>
        </div>
      </div>
    );
  }

  if (!activeRequest) return null;

  const requesterName = activeRequest.user?.name || "A Stranded Driver";
  const serviceName = activeRequest.service?.name || "Roadside Service";
  const locationAddress = activeRequest.pickupLocation?.address || "Unknown Location";

  return (
    <div className="emergency-toast-container">
      <div className="emergency-toast-card">
        <div className="emergency-header">
          <div className="emergency-badge">
            <span className="pulse-dot"></span>
            Active Emergency
          </div>
          <button className="close-btn" onClick={handleDismiss} title="Dismiss">
            <FaTimes />
          </button>
        </div>

        <div className="emergency-body">
          <h3 className="emergency-title">{serviceName}</h3>
          <p className="emergency-requester">
            Requested by: <strong>{requesterName}</strong>
          </p>
          
          <div className="emergency-meta">
            <div className="meta-item">
              <span className="meta-label">Location:</span>
              <span className="meta-value">{locationAddress}</span>
            </div>
            {activeRequest.description && (
              <div className="meta-item">
                <span className="meta-label">Details:</span>
                <span className="meta-value" style={{ fontStyle: "italic" }}>
                  "{activeRequest.description}"
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="emergency-actions">
          <button className="accept-btn" onClick={handleAccept}>
            Accept Request
          </button>
          <button className="dismiss-btn" onClick={handleDismiss}>
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
