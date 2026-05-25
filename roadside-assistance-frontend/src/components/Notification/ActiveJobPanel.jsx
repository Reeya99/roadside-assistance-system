// ActiveJobPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FaArrowRight, FaTruck, FaMapMarkerAlt, FaCheck, FaPhone } from "react-icons/fa";
import "./ActiveJobPanel.css";

const ActiveJobPanel = () => {
  const { user } = useAuth();
  const [activeJob, setActiveJob] = useState(null);
  const pollingInterval = useRef(null);

  const fetchActiveJob = async () => {
    try {
      const res = await axios.get("/requests/current-job");
      if (res.data) {
        setActiveJob(res.data);
      } else {
        setActiveJob(null);
      }
    } catch (err) {
      console.error("Error fetching mechanic active job:", err);
    }
  };

  useEffect(() => {
    if (!user) {
      setActiveJob(null);
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
      return;
    }

    // Initial fetch
    fetchActiveJob();

    // Poll every 4 seconds
    pollingInterval.current = setInterval(fetchActiveJob, 4000);

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    };
  }, [user]);

  const handleUpdateStatus = async (newStatus) => {
    if (!activeJob) return;
    try {
      const res = await axios.put(`/requests/${activeJob.id}/status`, { status: newStatus });
      setActiveJob(res.data.status === "completed" ? null : res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update service status.");
    }
  };

  if (!activeJob) return null;

  const requester = activeJob.user || {};
  const serviceName = activeJob.service?.name || "Service Request";
  const address = activeJob.pickupLocation?.address || "Stranded Location";
  const currentStatus = activeJob.status;

  // Determine button label, action status, and button color class
  let btnText = "Start Traveling";
  let btnIcon = <FaTruck />;
  let nextStatus = "on_the_way";
  let colorClass = "";

  if (currentStatus === "on_the_way") {
    btnText = "Confirm Arrival";
    btnIcon = <FaMapMarkerAlt />;
    nextStatus = "arrived";
    colorClass = "orange";
  } else if (currentStatus === "arrived") {
    btnText = "Mark Job Completed";
    btnIcon = <FaCheck />;
    nextStatus = "completed";
    colorClass = "green";
  }

  return (
    <div className="active-job-panel-container">
      <div className="job-info-left">
        <span className={`job-indicator-dot ${currentStatus}`}></span>
        <div className="job-text-details">
          <h4>Active Job: {serviceName}</h4>
          <p>
            Assisting <strong>{requester.name || "Customer"}</strong> at <strong>{address}</strong>
          </p>
        </div>
      </div>

      {/* Dynamic Milestones */}
      <div className="job-milestones-middle">
        <div className="milestone-node done">
          <FaCheck /> Accepted
        </div>
        <FaArrowRight className="milestone-arrow" />
        <div className={`milestone-node ${currentStatus === "on_the_way" ? "current" : (currentStatus !== "accepted" ? "done" : "")}`}>
          {currentStatus !== "accepted" && currentStatus !== "on_the_way" ? <FaCheck /> : null} On the Way
        </div>
        <FaArrowRight className="milestone-arrow" />
        <div className={`milestone-node ${currentStatus === "arrived" ? "current" : (currentStatus === "completed" ? "done" : "")}`}>
          Arrived at Site
        </div>
      </div>

      {/* Action Buttons */}
      <div className="job-actions-right">
        {requester.phone && (
          <a href={`tel:${requester.phone}`} style={{ textDecoration: "none" }}>
            <button className="job-cancel-link" title="Call Requester">
              <FaPhone style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Call ({requester.phone})
            </button>
          </a>
        )}
        <button className={`job-action-btn ${colorClass}`} onClick={() => handleUpdateStatus(nextStatus)}>
          {btnIcon} {btnText}
        </button>
      </div>
    </div>
  );
};

export default ActiveJobPanel;
