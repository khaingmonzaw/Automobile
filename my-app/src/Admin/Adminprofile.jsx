import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey, faPenToSquare, faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const Adminprofile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // Consistent label style to ensure perfect alignment across all rows
  const labelStyle = {
    width: "150px",
    minWidth: "150px",
  };

  useEffect(() => {
    if (!userId) {
      setError("Data Not Found. Please Login First!!!");
      setLoading(false);
      return;
    }

    const fetchAdminProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/users/${userId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Fallback to local storage if API profile route returns 404
            setProfile({ 
              name: user?.name || '-', 
              email: user?.email || '-',
              role: user?.role || '-' 
            });
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch admin profile data.');
        }
        
        const data = await response.json();
        
        // Handle array or object response structure
        if (Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
        } else {
          setProfile(data);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 p-4 bg-light text-start">
      <Link to="/Admin/Staff" className="text-decoration-none text-dark">
        <button className="btn btn-warning mb-3" type="button">
          <FontAwesomeIcon icon={faCircleLeft} />
        </button>
      </Link>
      
      <div className="row g-4 mb-4 py-2">
        <div className="col-12">
          <div className="card bg-white border-0 rounded-4 shadow-sm p-4 w-100">
            
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-warning fs-5" />
                <h5 className="fw-bold text-dark mb-0">
                  {(profile?.role || "Admin").toUpperCase()} Profile Details
                </h5>
              </div>

              {/* Action Buttons Group (Update Profile & Change Password) */}
             <div className="d-flex align-items-center gap-2">
                <Link 
                  to="/Admin/UpdateProfile" 
                  className="text-decoration-none btn btn-warning btn-sm fw-semibold d-flex align-items-center justify-content-center"
                  style={{ width: "32px", height: "32px" }}
                  title="Update Profile"
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </Link>
                
                <Link 
                  to="/Admin/PasswordChangeAdmin" 
                  className="text-decoration-none btn btn-outline-warning btn-sm fw-semibold d-flex align-items-center justify-content-center"
                  style={{ width: "32px", height: "32px" }}
                  title="Change Password"
                >
                  <FontAwesomeIcon icon={faKey} />
                </Link>
              </div>
            </div>
            
            {/* Details Section - 1 Column Layout */}
            <div className="row g-3 py-2 px-2">
              
              {/* Full Name */}
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <span className="fw-medium text-dark" style={labelStyle}>Full Name</span>
                  <span className="text-dark mx-2">:</span>
                  <span className="fw-semibold text-secondary flex-grow-1">
                    {profile?.name || profile?.fullName || '-'}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <span className="fw-medium text-dark" style={labelStyle}>Email</span>
                  <span className="text-dark mx-2">:</span>
                  <span className="fw-semibold text-secondary flex-grow-1">{profile?.email || '-'}</span>
                </div>
              </div>

              {/* Phone Number */}
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <span className="fw-medium text-dark" style={labelStyle}>Phone Number</span>
                  <span className="text-dark mx-2">:</span>
                  <span className="fw-semibold text-secondary flex-grow-1">{profile?.phone || '-'}</span>
                </div>
              </div>

              {/* Role */}
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <span className="fw-medium text-dark" style={labelStyle}>Role</span>
                  <span className="text-dark mx-2">:</span>
                  <span className="fw-semibold text-secondary flex-grow-1">{profile?.role || 'Administrator'}</span>
                </div>
              </div>

              {/* NRC No */}
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <span className="fw-medium text-dark" style={labelStyle}>NRC No</span>
                  <span className="text-dark mx-2">:</span>
                  <span className="fw-semibold text-secondary flex-grow-1">{profile?.nrc || '-'}</span>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="col-12">
                <div className="d-flex align-items-center">
                  <span className="fw-medium text-dark" style={labelStyle}>Date of Birth</span>
                  <span className="text-dark mx-2">:</span>
                  <span className="fw-semibold text-secondary flex-grow-1">{formatDate(profile?.dob)}</span>
                </div>
              </div>

              {/* Address */}
              <div className="col-12">
                <div className="d-flex align-items-start">
                  <span className="fw-medium text-dark" style={labelStyle}>Address</span>
                  <span className="text-dark mx-2">:</span>
                  <span className="fw-semibold text-secondary flex-grow-1">{profile?.address || '-'}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Adminprofile;