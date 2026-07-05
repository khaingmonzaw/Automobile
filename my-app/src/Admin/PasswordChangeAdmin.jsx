import { useState } from 'react';

const PasswordChange = () => {
  // Form input states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 👁️ Font Awesome Icon တွေကို အဖွင့်/အပိတ် လုပ်ပေးမယ့် State များ
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Handlers
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ၁။ ပါတ်စ်ဝေါ့အသစ်နှစ်ခု တူ/မတူ စစ်ဆေးခြင်း
    if (newPassword !== confirmPassword) {
      alert("New Password နဲ့ Confirm Password မတူပါဘူး။");
      return;
    }

    // ၂။ Login ဝင်ထားတဲ့ User ရဲ့ အချက်အလက်ကို localStorage ထဲကနေ ယူခြင်း
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser || !loggedInUser.email) {
      alert("ကျေးဇူးပြု၍ အရင်ဆုံး Login ဝင်ပါ။");
      return;
    }

    try {
      // ၃။ Backend API လမ်းကြောင်းဆီသို့ Data လှမ်းပို့ခြင်း
      const response = await fetch("http://localhost:3000/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loggedInUser.email,       // localStorage ထဲက email ကို ပို့မည်
          currentPassword: currentPassword, // ရိုက်ထည့်လိုက်သော လက်ရှိ password
          newPassword: newPassword,         // password အသစ်
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Database မှာ အောင်မြင်စွာ ပြောင်းလဲပြီးပါက ပြသမည့်စာသား
        // ၄။ အောင်မြင်သွားလျှင် Input field များကို ရှင်းထုတ်မည်
        handleCancel();
      } else {
        alert(data.message); // Backend မှ ပြန်လာသော Error ပြသခြင်း (ဥပမာ- လက်ရှိ Password မှားနေခြင်း)
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server နဲ့ ချိတ်ဆက်မှု မအောင်မြင်ပါ (URL သို့မဟုတ် Port မှားနေနိုင်သည်)");
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
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
                type={showCurrent ? "text" : "password"} 
                className="form-control form-control-lg bg-light"
                placeholder="**********"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <span 
                className="input-group-text bg-light border-start-0 text-secondary" 
                style={{ cursor: 'pointer', width: '45px', justifyContent: 'center' }}
                onClick={() => setShowCurrent(!showCurrent)} 
              >
                <i className={showCurrent ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
              </span>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <div className="input-group">
              <input
                type={showNew ? "text" : "password"}
                className="form-control form-control-lg bg-light"
                placeholder="**********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span 
                className="input-group-text bg-light border-start-0 text-secondary" 
                style={{ cursor: 'pointer', width: '45px', justifyContent: 'center' }}
                onClick={() => setShowNew(!showNew)}
              >
                <i className={showNew ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirm ? "text" : "password"}
                className="form-control form-control-lg bg-light"
                placeholder="**********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span 
                className="input-group-text bg-light border-start-0 text-secondary" 
                style={{ cursor: 'pointer', width: '45px', justifyContent: 'center' }}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                <i className={showConfirm ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
              </span>
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

export default PasswordChange;