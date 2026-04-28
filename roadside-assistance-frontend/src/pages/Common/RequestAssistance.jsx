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

  useEffect(() => {
    if (!user) {
      alert("Please log in first to request assistance.");
      navigate("/login");
      return;
    }
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get("service");
    if (serviceParam) {
      // Map display name to value if necessary, or just set it
      setService(serviceParam);
    }
  }, [location, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    try {
      await axios.post('/requests', { serviceName: service, location: locationStr, description });
      setTimeout(() => {
        // In a real app, you'd navigate to a tracking page here
        // For now we'll just keep the box visible or show a success message
      }, 5000);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to request assistance. Did you add a vehicle to your profile?");
      setIsConnecting(false);
    }
  };

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
            <button className="submit-btn" onClick={() => setIsConnecting(false)} style={{marginTop: "30px", background: "#ef4444"}}>Cancel Service</button>
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
