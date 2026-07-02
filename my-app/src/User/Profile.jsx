import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCar, faLock, faKey } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const Profile = () => {
  // Mock Data for Profile Information
  const userProfile = {
    personal: {
      fullName: "Jhon Doe",
      email: "jhondoe@gmail.com",
      address: "Yangon",
      phone: "091122334455"
    },
    vehicle: {
      vehicleNumber: "7K-1234",
      policyNumber: "PLC-00123",
      vehicleModel: "Toyota Premio",
      status: "Active",
      manufactureDate: "2018",
      startDate: "2025-01-01",
      endDate: "2026-01-01"
    },
    account: {
      username: "Jhon Doe",
      policyNumber: "PLC-00123",
      status: "Active",
      startDate: "2025-01-01",
      endDate: "2026-01-01"
    }
  };

  return (
    <div className="container-fluid min-vh-100 p-4 bg-light">
      
      {/* Upper Grid: Personal Info Card */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card bg-white border-0 rounded-4 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-warning fs-5" />
                <h3 className="fs-5 fw-bold text-dark mb-0">Personal Info</h3>
              </div>
              {/* Password ပြောင်းလဲရန် လင့်ခ် */}
              <Link to="/User/PasswordChangeUser" className="text-decoration-none text-primary small fw-semibold">
                <FontAwesomeIcon icon={faKey} className="me-1" /> Change password
              </Link>
            </div>

            {/* Personal Details Grid */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="text-muted small fw-medium mb-1">Full Name</label>
                <p className="fw-semibold text-dark mb-0">{userProfile.personal.fullName}</p>
              </div>
              <div className="col-md-6">
                <label className="text-muted small fw-medium mb-1">Email</label>
                <p className="fw-semibold text-dark mb-0">{userProfile.personal.email}</p>
              </div>
              <div className="col-md-6">
                <label className="text-muted small fw-medium mb-1">Address</label>
                <p className="fw-semibold text-dark mb-0">{userProfile.personal.address}</p>
              </div>
              <div className="col-md-6">
                <label className="text-muted small fw-medium mb-1">Phone</label>
                <p className="fw-semibold text-dark mb-0">{userProfile.personal.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Grid: Vehicle Information & Account Information */}
      <div className="row g-4">
        
        {/* Left Card: Vehicle Information */}
        <div className="col-md-6">
          <div className="card bg-white border-0 rounded-4 shadow-sm p-4 h-100">
            <div className="d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
              <FontAwesomeIcon icon={faCar} className="text-warning fs-5" />
              <h3 className="fs-5 fw-bold text-dark mb-0">Vehicle Information</h3>
            </div>
            
            <div className="row g-3">
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Vehicle Number</label>
                <p className="fw-semibold text-dark mb-0">{userProfile.vehicle.vehicleNumber}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Policy Number</label>
                <p className="fw-semibold text-dark mb-0">{userProfile.vehicle.policyNumber}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Vehicle Model</label>
                <p className="fw-semibold text-dark mb-0">{userProfile.vehicle.vehicleModel}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Status</label>
                <div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill small fw-semibold">
                    {userProfile.vehicle.status}
                  </span>
                </div>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Manufacture Date</label>
                <p className="fw-semibold text-dark mb-0">{userProfile.vehicle.manufactureDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Account Information */}
        <div className="col-md-6">
          <div className="card bg-white border-0 rounded-4 shadow-sm p-4 h-100">
            <div className="d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
              <FontAwesomeIcon icon={faLock} className="text-warning fs-5" />
              <h3 className="fs-5 fw-bold text-dark mb-0">Account Information</h3>
            </div>

            <div className="row g-3">
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Username</label>
                <p className="fw-semibold text-dark mb-0">{userProfile.account.username}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Policy Number</label>
                <p className="fw-semibold text-dark mb-0">{userProfile.account.policyNumber}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Status</label>
                <div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill small fw-semibold">
                    {userProfile.account.status}
                  </span>
                </div>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Start Date</label>
                <p className="fw-semibold text-secondary small mb-0">{userProfile.account.startDate}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">End Date</label>
                <p className="fw-semibold text-secondary small mb-0">{userProfile.account.endDate}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;