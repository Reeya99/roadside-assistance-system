import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import { MdKeyboardArrowDown } from "react-icons/md";
import axios from "axios";
import "./History.css";

const History = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (user) {
      axios.get('/requests/history')
        .then(res => {
          setHistory(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="history-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
          <h2>Please log in to view your history.</h2>
        </div>
      </>
    );
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getIcon = (serviceName) => {
    if (!serviceName) return "⚙️";
    if (serviceName.includes("Tire")) return "🛞";
    if (serviceName.includes("Battery")) return "⚡";
    if (serviceName.includes("Towing")) return "🚚";
    if (serviceName.includes("Fuel")) return "⛽";
    return "⚙️";
  };

  return (
    <>
      <Navbar />
      <div className="history-container">
        <div className="history-header">
          <h1>Request History</h1>
          <p>View all your past roadside assistance requests.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading history...</div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', background: 'var(--card-bg)', borderRadius: '12px' }}>
            You have no past service requests.
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item-wrapper">
                <div className="history-card" onClick={() => toggleExpand(item.id)}>
                  <div className="history-card-left">
                    <div className="history-icon">{getIcon(item.service?.name)}</div>
                    <div className="history-details">
                      <h3>{item.service?.name || "Service Request"}</h3>
                      <p className="history-date">{new Date(item.createdAt).toLocaleDateString()}</p>
                      <p className="history-location">📍 {item.pickupLocation?.address || "Unknown Location"}</p>
                    </div>
                  </div>
                  <div className="history-card-right">
                    <div className="history-status-cost">
                      <span className={`history-status ${item.status.toLowerCase()}`}>{item.status}</span>
                      <span className="history-cost">{item.finalPrice ? `$${item.finalPrice.toFixed(2)}` : (item.estimatedPrice ? `Est: $${item.estimatedPrice.toFixed(2)}` : "$0.00")}</span>
                    </div>
                    <MdKeyboardArrowDown className={`history-expand-icon ${expandedId === item.id ? "rotate" : ""}`} />
                  </div>
                </div>
                
                {expandedId === item.id && (
                  <div className="history-dropdown">
                    {item.status === "completed" ? (
                      <div className="history-dropdown-content">
                        <div className="dropdown-row">
                          <span className="dropdown-label">Mechanic:</span>
                          <span className="dropdown-value">{item.mechanic?.user?.name || "Unassigned"}</span>
                        </div>
                        {item.review && (
                          <>
                            <div className="dropdown-row">
                              <span className="dropdown-label">Rating:</span>
                              <span className="dropdown-value">{"⭐".repeat(item.review.rating)}</span>
                            </div>
                            <div className="dropdown-row">
                              <span className="dropdown-label">Notes:</span>
                              <span className="dropdown-value">{item.review.comment}</span>
                            </div>
                          </>
                        )}
                        {item.description && (
                          <div className="dropdown-row">
                            <span className="dropdown-label">Your Notes:</span>
                            <span className="dropdown-value">{item.description}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="history-dropdown-content">
                        <div className="dropdown-row">
                          <span className="dropdown-label">Status:</span>
                          <span className="dropdown-value" style={{textTransform: 'capitalize'}}>{item.status}</span>
                        </div>
                        {item.description && (
                          <div className="dropdown-row">
                            <span className="dropdown-label">Your Notes:</span>
                            <span className="dropdown-value">{item.description}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
