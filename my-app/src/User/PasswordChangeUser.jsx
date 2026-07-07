import { useState } from 'react';

const PasswordChangeUser = () => {
  // Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Error states (for inline red messages)
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  // Handlers - clear specific error on typing
  const handleCurrentChange = (e) => {
    setCurrentPassword(e.target.value);
    setCurrentPasswordError('');
    setFormError('');
  };
  const handleNewChange = (e) => {
    setNewPassword(e.target.value);
    setNewPasswordError('');
    setFormError('');
  };
  const handleConfirmChange = (e) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError('');
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setFormError('');

    // ၁။ ပါတ်စ်ဝေါ့အသစ်နှစ်ခု တူ/မတူ စစ်ဆေးခြင်း
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("New Password နဲ့ Confirm Password မတူပါဘူး။");
      return;
    }

    // ၂။ Login ဝင်ထားတဲ့ User ရဲ့ အချက်အလက်ကို localStorage ထဲကနေ ယူခြင်း
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser || !loggedInUser.email) {
      setFormError("ကျေးဇူးပြု၍ အရင်ဆုံး Login ဝင်ပါ။");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loggedInUser.email,
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // ✅ အောင်မြင်ပါက Alert ပြထားဆဲ (သို့သော် ခင်ဗျား စိတ်ကြိုက် ပြောင်းနိုင်ပါတယ်)
        handleCancel();
      } else {
        // Backend မှ ပြန်လာသော Error ကို Form Error အဖြစ်ပြမည်
        setFormError(data.message || "Password ပြောင်းလဲမှု မအောင်မြင်ပါ။");
      }
    } catch (error) {
      console.error("Error:", error);
      setFormError("Server နဲ့ ချိတ်ဆက်မှု မအောင်မြင်ပါ (URL သို့မဟုတ် Port မှားနေနိုင်သည်)");
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
    // Clear all errors
    setCurrentPasswordError('');
    setNewPasswordError('');
    setConfirmPasswordError('');
    setFormError('');
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
                type={showCurrent ? 'text' : 'password'}
                className="form-control form-control-lg bg-light"
                placeholder="**********"
                value={currentPassword}
                onChange={handleCurrentChange}
                required
              />
              <span
                className="input-group-text bg-light border-start-0 text-secondary"
                style={{ cursor: 'pointer', width: '45px', justifyContent: 'center' }}
                onClick={() => setShowCurrent(!showCurrent)}
              >
                <i className={`fas ${showCurrent ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </span>
            </div>
            {/* Error message under the text box */}
            {currentPasswordError && (
              <div className="text-danger mt-1 small">{currentPasswordError}</div>
            )}
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <div className="input-group">
              <input
                type={showNew ? 'text' : 'password'}
                className="form-control form-control-lg bg-light"
                placeholder="**********"
                value={newPassword}
                onChange={handleNewChange}
                required
              />
              <span
                className="input-group-text bg-light border-start-0 text-secondary"
                style={{ cursor: 'pointer', width: '45px', justifyContent: 'center' }}
                onClick={() => setShowNew(!showNew)}
              >
                <i className={`fas ${showNew ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </span>
            </div>
            {newPasswordError && (
              <div className="text-danger mt-1 small">{newPasswordError}</div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirm ? 'text' : 'password'}
                className="form-control form-control-lg bg-light"
                placeholder="**********"
                value={confirmPassword}
                onChange={handleConfirmChange}
                required
              />
              <span
                className="input-group-text bg-light border-start-0 text-secondary"
                style={{ cursor: 'pointer', width: '45px', justifyContent: 'center' }}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                <i className={`fas ${showConfirm ? 'fa-eye' : 'fa-eye-slash'}`}></i>
              </span>
            </div>
            {confirmPasswordError && (
              <div className="text-danger mt-1 small">{confirmPasswordError}</div>
            )}
          </div>

          {/* Form-level error (e.g., login required, server error) */}
          {formError && (
            <div className="text-danger text-center mb-3 small">{formError}</div>
          )}

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

export default PasswordChangeUser;