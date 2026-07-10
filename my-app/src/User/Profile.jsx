import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract,faUser, faCar, faLock } from "@fortawesome/free-solid-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [policies, setPolicies] = useState([]); // 💡 ပြင်ဆင်ချက် - policies သိမ်းရန် state အသစ် ကြေညာထားပါသည်
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // localStorage ထဲက လက်ရှိဝင်ထားတဲ့ User ID ကို ယူသုံးခြင်း
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
  if (!userId) {
    setError("User Not Found. Please Login First!!!");
    setLoading(false);
    return;
  }

  const fetchProfileData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/user/profile/${userId}`);
      if (!response.ok) {
        throw new Error('Loading.......');
      }
      const data = await response.json();
      
      // 💡 ဒေတာဘာတွေကျလာလဲဆိုတာ စစ်ဆေးဖို့ Console ထုတ်ကြည့်ခြင်း
      console.log("Backend က ကျလာတဲ့ ဒေတာပုံစံ - ", data);

      if (Array.isArray(data) && data.length > 0) {
        // useEffect ထဲက သတ်မှတ်ချက်ကို ဤသို့ပြောင်းပါ
        setProfile(data[0]); 
        setPolicies(data);
      } else if (data && typeof data === 'object') {
        // အကယ်၍ Array မဟုတ်ဘဲ Object တစ်ခုတည်း ကျလာခဲ့လျှင်
        setProfile(data);
        setPolicies([data]);   // Object ကို Array ပြောင်းပြီး ထည့်ပေးခြင်း
      } else {
        setProfile(null);
        setPolicies([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchProfileData();
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
    <div className="container-fluid min-vh-100 p-4 bg-light">
      <div className="row g-4 mb-4 py-2">
        <div className="col-12">
          <div className="card bg-white border-0 rounded-4 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              
              <div className="d-flex align-items-center gap-2">
      <FontAwesomeIcon icon={faUser} className="text-warning fs-4" />
      <h4 className="fw-bold text-dark mb-0">Personal Information</h4>
    </div>
              <Link to="/User/PasswordChangeUser" className="text-decoration-none text-primary small fw-semibold">
  <FontAwesomeIcon icon={faKey} className="fme-1 text-primary" /> Change password
              </Link>
            </div>
            
            <div className="row g-4 py-2 px-2">
  {/* Row 1: Name & Email */}
  <div className="col-md-6">
    <div className="d-flex align-items-center">
      <span className="fw-medium text-dark" style={{ width: "130px" }}>Name</span>
      <span className="text-dark mx-2">:</span>
      <span className="fw-semibold text-secondary flex-grow-1">{profile?.fullName || '-'}</span>
    </div>
  </div>
  <div className="col-md-6">
    <div className="d-flex align-items-center">
      <span className="fw-medium text-dark" style={{ width: "130px" }}>Email</span>
      <span className="text-dark mx-2">:</span>
      <span className="fw-semibold text-secondary flex-grow-1">{profile?.email || '-'}</span>
    </div>
  </div>

  {/* Row 2: Phone Number & NRC No */}
  <div className="col-md-6">
    <div className="d-flex align-items-center">
      <span className="fw-medium text-dark" style={{ width: "130px" }}>Phone Number</span>
      <span className="text-dark mx-2">:</span>
      <span className="fw-semibold text-secondary flex-grow-1">{profile?.phone || '-'}</span>
    </div>
  </div>
  <div className="col-md-6">
    <div className="d-flex align-items-center">
      <span className="fw-medium text-dark" style={{ width: "130px" }}>NRC No</span>
      <span className="text-dark mx-2">:</span>
      <span className="fw-semibold text-secondary flex-grow-1">{profile?.nrc || '-'}</span>
    </div>
  </div>

  {/* Row 3: Address & Date of Birth */}
  <div className="col-md-6">
    <div className="d-flex align-items-center">
      <span className="fw-medium text-dark" style={{ width: "130px" }}>Address</span>
      <span className="text-dark mx-2">:</span>
      <span className="fw-semibold text-secondary flex-grow-1">{profile?.address || '-'}</span>
    </div>
  </div>
  <div className="col-md-6">
    <div className="d-flex align-items-center">
      <span className="fw-medium text-dark" style={{ width: "130px" }}>Date of Birth</span>
      <span className="text-dark mx-2">:</span>
      <span className="fw-semibold text-secondary flex-grow-1">{formatDate(profile?.dob)}</span>
    </div>
  </div>
</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card bg-white border-0 rounded-4 shadow-sm p-4 h-100">
            
            <div className="d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
      <FontAwesomeIcon icon={faCar} className="text-warning fs-4" />
      <h4 className="fw-bold text-dark mb-0">Vehicle Information</h4>
    </div>
            <div className="d-flex flex-column gap-3 py-2 px-1">
      {/* Vehicle Number */}
      <div className="d-flex align-items-center">
        <span className="fw-medium text-dark" style={{ width: "160px" }}>Vehicle Number</span>
        <span className="text-dark mx-2">:</span>
        <span className="fw-semibold text-secondary flex-grow-1">{profile?.vehicle_number || '-'}</span>
      </div>
      
      {/* Vehicle Model */}
      <div className="d-flex align-items-center">
        <span className="fw-medium text-dark" style={{ width: "160px" }}>Vehicle Model</span>
        <span className="text-dark mx-2">:</span>
        <span className="fw-semibold text-secondary flex-grow-1">{profile?.vehicle_model || '-'}</span>
      </div>
      
      {/* Vehicle Model Year */}
      <div className="d-flex align-items-center">
        <span className="fw-medium text-dark" style={{ width: "160px" }}>Vehicle Model Year</span>
        <span className="text-dark mx-2">:</span>
        <span className="fw-semibold text-secondary flex-grow-1">{profile?.model_year || '-'}</span>
      </div>
      
      {/* Status */}
      
      </div>
          </div>
        </div>

        {/* FontAwesomeIcon အတွက် faFileContract ကို အပေါ်မှာ import လုပ်ရန် မမေ့ပါနှင့် */}
<div className="col-md-6">
  <div className="card bg-white border-0 rounded-4 shadow-sm p-4 h-100">
    <div className="d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
      <FontAwesomeIcon icon={faFileContract} className="text-warning fs-4" />
      <h4 className="fw-bold text-dark mb-0">Policy Information</h4>
    </div>
    
    <div className="d-flex flex-column gap-3 py-1">
      {/* ဒေတာစာရင်းပြသမည့် နေရာ */}
      <div className="policy-list" style={{ maxHeight: "250px", overflowY: "auto" }}>
        
        {/* 🛠 ပြင်ဆင်ချက် - ဒေတာတကယ်ရှိမရှိ သေချာစစ်ဆေးပြီးမှ ပြသခြင်း */}
        {policies && policies.length > 0 ? (
          policies.map((item, index) => (
            <div key={index} className="p-3 mb-2 rounded-3 border border-light-subtle bg-light-subtle d-flex flex-column gap-2">
              
              {/* Policy Number & Status */}
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  
                  <span className="fw-bold text-primary">{item?.policy_number || 'No Policy'}</span>
                </div>
                
              </div>

              {/* Start Date & End Date ဘေးတိုက်ပြသခြင်း */}
              <div className="d-flex align-items-center justify-content-between text-muted small mt-1">
                <div>
                  <span className="fw-medium">Start:</span> <span className="text-dark fw-semibold">{formatDate(item?.start_date)}</span>
                </div>
                
                <div>
                  <span className="fw-medium">End:</span> <span className="text-dark fw-semibold">{formatDate(item?.end_date)}</span>
                </div>
              </div>

            </div>
          ))
        ) : (
          /*  ဒေတာ လုံးဝမရှိသေးပါက Loading သို့မဟုတ် No Data စာသားပြပေးမည် */
          <div className="text-center text-muted py-4 small">
            No policy information found.
          </div>
        )}

      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default Profile;