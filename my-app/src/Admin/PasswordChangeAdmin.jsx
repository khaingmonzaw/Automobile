import { useState } from 'react';

const PasswordChangeAdmin = () => {
  // Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Handlers
 const handleSubmit = (e) => {
    e.preventDefault();
    alert('Password changed (demo)');
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="card shadow border-0 p-4 p-md-5" style={{ width: '100%', maxWidth: '600px', borderRadius: '20px' }}>
        <h2 className="text-center mb-4 fw-bold text-dark">Change Password</h2>

        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Current Password</label>
            <div className="input-group">
              <input
                type="password"
                className="form-content form-control form-control-lg bg-light"
                placeholder="**********"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <span className="input-group-text bg-light border-start-0" style={{ cursor: 'pointer' }}>👁️</span>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <div className="input-group">
              <input
                type="password"
                className="form-content form-control form-control-lg bg-light"
                placeholder="**********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span className="input-group-text bg-light border-start-0" style={{ cursor: 'pointer' }}>👁️</span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="input-group">
              <input
                type="password"
                className="form-content form-control form-control-lg bg-light"
                placeholder="**********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span className="input-group-text bg-light border-start-0" style={{ cursor: 'pointer' }}>👁️</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-3 justify-content-center mt-4">
            <button type="submit" className="btn btn-warning btn-lg px-4 fw-semibold shadow-sm" style={{ minWidth: '130px' }}>
              Change
            </button>
            <button type="button" className="btn btn-danger btn-lg px-4 fw-semibold shadow-sm" style={{ minWidth: '130px' }} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeAdmin;