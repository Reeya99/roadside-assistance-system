import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const { user, updateProfile, updateVehicle } = useAuth();
  
  const [profileImage, setProfileImage] = useState(null);
  const [licenseFileName, setLicenseFileName] = useState("No file chosen");

  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "", phone: "" });
  const [initialPersonalInfo, setInitialPersonalInfo] = useState({ name: "", email: "", phone: "" });

  const [vehicleInfo, setVehicleInfo] = useState({ make: "", model: "", color: "", plate: "" });
  const [initialVehicleInfo, setInitialVehicleInfo] = useState({ make: "", model: "", color: "", plate: "" });

  useEffect(() => {
    if (user) {
      const pInfo = { name: user.name || "", email: user.email || "", phone: user.phone || "" };
      setPersonalInfo(pInfo);
      setInitialPersonalInfo(pInfo);

      const vInfo = {
        make: user.vehicle?.make || "",
        model: user.vehicle?.model || "",
        color: user.vehicle?.color || "",
        plate: user.vehicle?.plate || ""
      };
      setVehicleInfo(vInfo);
      setInitialVehicleInfo(vInfo);
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="profile-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh'}}>
          <h2>Please log in to view your profile.</h2>
        </div>
      </>
    );
  }

  const isPersonalDirty = JSON.stringify(personalInfo) !== JSON.stringify(initialPersonalInfo);
  const isVehicleDirty = JSON.stringify(vehicleInfo) !== JSON.stringify(initialVehicleInfo);

  const handlePersonalChange = (e) => {
    setPersonalInfo({...personalInfo, [e.target.name]: e.target.value});
  };

  const handleVehicleChange = (e) => {
    setVehicleInfo({...vehicleInfo, [e.target.name]: e.target.value});
  };

  const handleSavePersonal = async () => {
    if (!isPersonalDirty) return;
    try {
      await updateProfile({ name: personalInfo.name, phone: personalInfo.phone });
      setInitialPersonalInfo({...personalInfo});
      alert("Personal Information updated successfully!");
    } catch (err) {
      alert("Failed to update personal information");
    }
  };

  const handleSaveVehicle = async () => {
    if (!isVehicleDirty) return;
    try {
      await updateVehicle({ make: vehicleInfo.make, model: vehicleInfo.model, color: vehicleInfo.color, plate: vehicleInfo.plate });
      setInitialVehicleInfo({...vehicleInfo});
      alert("Vehicle Information updated successfully!");
    } catch (err) {
      alert("Failed to update vehicle information");
    }
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
        alert("Profile picture uploaded successfully!");
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleLicenseChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFileName(e.target.files[0].name);
      alert("Driving license uploaded successfully!");
    }
  };

  const currentProfilePic = profileImage || user.profilePic || "/assets/images/default-avatar.png";

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image-container">
            <img 
              src={currentProfilePic} 
              alt="Profile" 
              className="profile-image" 
              onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=0d6efd&color=fff"; }} 
            />
            <label htmlFor="profile-pic-upload" className="edit-pic-btn" title="Upload Profile Picture">
              📷
            </label>
            <input type="file" id="profile-pic-upload" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePicChange} />
          </div>
          
          <div className="profile-header-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <span className="status-badge">Active Member</span>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-column-left">
            <div className="profile-card">
              <h3>Personal Information</h3>
              <form className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={personalInfo.name} onChange={handlePersonalChange} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={personalInfo.email} onChange={handlePersonalChange} />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" placeholder="+1 234 567 8900" value={personalInfo.phone} onChange={handlePersonalChange} />
                </div>
                <button type="button" className="save-btn" disabled={!isPersonalDirty} onClick={handleSavePersonal}>Save Changes</button>
              </form>
            </div>

            <div className="profile-card">
              <h3>Vehicle Information</h3>
              <form className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Make</label>
                    <input type="text" name="make" placeholder="e.g. Honda" value={vehicleInfo.make} onChange={handleVehicleChange} />
                  </div>
                  <div className="form-group">
                    <label>Model</label>
                    <input type="text" name="model" placeholder="e.g. Civic" value={vehicleInfo.model} onChange={handleVehicleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Color</label>
                    <input type="text" name="color" placeholder="e.g. Blue" value={vehicleInfo.color} onChange={handleVehicleChange} />
                  </div>
                  <div className="form-group">
                    <label>License Plate</label>
                    <input type="text" name="plate" placeholder="e.g. ABC-1234" value={vehicleInfo.plate} onChange={handleVehicleChange} />
                  </div>
                </div>
                <button type="button" className="save-btn" disabled={!isVehicleDirty} onClick={handleSaveVehicle}>Save Vehicle Info</button>
              </form>
            </div>

            <div className="profile-card">
              <h3>Documents</h3>
              <div className="form-group">
                <label>Driving License (PDF or Image)</label>
                <div className="file-upload-wrapper">
                  <input type="file" id="driving-license" accept="image/*,.pdf" className="file-input" onChange={handleLicenseChange} />
                  <label htmlFor="driving-license" className="file-upload-btn">Choose File</label>
                  <span className="file-name">{licenseFileName}</span>
                </div>
                <p className="file-help-text">Upload a clear picture or PDF of your valid driving license.</p>
              </div>
            </div>
          </div>

          <div className="profile-column-right">
            <div className="profile-card">
              <h3>Recent Requests</h3>
              <div className="request-list">
                <div className="request-item">
                  <div className="req-icon">🛞</div>
                  <div className="req-info">
                    <h4>Flat Tire Repair</h4>
                    <p>Oct 24, 2025 • Completed</p>
                  </div>
                </div>
                <div className="request-item">
                  <div className="req-icon">⚡</div>
                  <div className="req-info">
                    <h4>Battery Jump-start</h4>
                    <p>Sep 12, 2025 • Completed</p>
                  </div>
                </div>
                <Link to="/history" className="view-all-req" style={{display: 'block', textDecoration: 'none'}}>View all history</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
