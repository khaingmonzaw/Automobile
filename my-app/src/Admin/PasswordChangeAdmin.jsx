
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Routing for navigation

const PasswordChange = () => {
  const navigate = useNavigate();
  const [showRedirectModal, setShowRedirectModal] = useState(false); // ✅ Dialogue Box State

  // Form input states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    }

    if (newPassword) {
      if (newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(newPassword)) {
        newErrors.newPassword = "Password must contain at least one letter and one digit";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser || !loggedInUser.id) {
      alert("Please login first");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    try {
      const response = await fetch("http://localhost:3000/api/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: loggedInUser.id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setShowRedirectModal(true); // Show navigation confirmation modal
        setShowSuccess(true);       // Show banner alert
        
        // Reset form inputs
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
      } else {
        setErrors({
          currentPassword: data.message,
        });
      }
    } catch (error) {
      setMessage("Server Error");
      setShowSuccess(true);
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirmPassword(false);  
  };

  //  Route handling for navigation path /LoginPage
  const handleGoToLogin = () => {
    setShowRedirectModal(false); 
    navigate('/LoginPage'); 
  };

  return (
    <>
      {/* Success Alert Banner */}
      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowSuccess(false)}
          ></button>
        </div>
      )}

      {/* Updated "Go Back to Login" Dialogue Box */}
      {showRedirectModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Password Changed!</h5>
                <button className="btn-close" onClick={handleGoToLogin}></button>
              </div>
              <div className="modal-body text-center">
                <p>Do you want to go back to the Login page?</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button className="btn btn-warning" onClick={handleGoToLogin}>
                  Continue
                </button>
                <button className="btn btn-danger" onClick={() => setShowRedirectModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center py-5">
        {/* Confirm Modal */}
        {showConfirmModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Confirm Change Password</h5>
                  <button className="btn-close" onClick={() => setShowConfirmModal(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <p>Are you sure you want to Change this password?</p>
                </div>
                <div className="modal-footer justify-content-center">
                  <button className="btn btn-warning" onClick={confirmSubmit}>Submit</button>
                  <button className="btn btn-danger" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Card */}
        <div className="card shadow border-0 p-4 p-md-5" style={{ width: '100%', maxWidth: '600px', borderRadius: '20px' }}>
          <h2 className="text-center mb-4 fw-bold text-dark">Change Password</h2>

          <form onSubmit={handleSubmit}>
            {/* Current Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Current Password</label>
              <div className="input-group">
                <input
                  type={showCurrent ? "text" : "password"}
                  className={`form-control form-control-lg bg-light ${errors.currentPassword ? "is-invalid" : ""}`}
                  placeholder="**********"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <span
                  className="input-group-text bg-light border-start-0 text-secondary"
                  style={{ cursor: 'pointer', width: '45px', justifyContent: 'center' }}
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  <i className={showCurrent ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                </span>
              </div>
              {errors.currentPassword && <small className="text-danger">{errors.currentPassword}</small>}
            </div>

            {/* New Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">New Password</label>
              <div className="input-group">
                <input
                  type={showNew ? "text" : "password"}
                  className={`form-control form-control-lg bg-light ${errors.newPassword ? "is-invalid" : ""}`}
                  placeholder="**********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="input-group-text bg-light border-start-0 text-secondary"
                  style={{ cursor: 'pointer', width: '45px', justifyContent: 'center' }}
                  onClick={() => setShowNew(!showNew)}
                >
                  <i className={showNew ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                </span>
              </div>
              {errors.newPassword && <small className="text-danger">{errors.newPassword}</small>}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Confirm Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-control form-control-lg bg-light ${errors.confirmPassword ? "is-invalid" : ""}`}
                  placeholder="**********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="input-group-text bg-light border-start-0 text-secondary"
                  style={{ cursor: 'pointer', width: '45px', justifyContent: 'center' }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={showConfirmPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                </span>
              </div>
              {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword}</small>}
            </div>

            {/* Buttons */}
            <div className="d-flex gap-3 justify-content-center mt-4">
              <button type="submit" className="btn btn-warning px-4">Change</button>
              <button type="button" className="btn btn-danger px-4" onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordChange;

