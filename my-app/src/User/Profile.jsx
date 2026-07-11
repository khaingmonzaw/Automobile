import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileContract,faUser, faCar, faLock } from "@fortawesome/free-solid-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
const Profile = () => {
const [profile, setProfile] = useState(null);
const [policies, setPolicies] = useState([]);       // 💡 အမှားမတက်စေရန် policies state ကို ပြန်လည်ထည့်သွင်းထားပါသည်
const [activePolicies, setActivePolicies] = useState([]); 
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
        if (response.status === 404) {
          setProfile({ fullName: user?.name || 'User', email: user?.email || '-' });
          setActivePolicies([]);
          setPolicies([]); // လုံခြုံစိတ်ချရအောင် အလွတ်ပတ်ပေးထားမည်
          setLoading(false);
          return;
        }
        throw new Error('Failed to fetch profile data.');
      }
      
      const data = await response.json();
      console.log("Backend က ကျလာတဲ့ ဒေတာပုံစံ - ", data);

      if (Array.isArray(data) && data.length > 0) {
        setProfile(data[0]);         
        setActivePolicies(data);     
        setPolicies(data);           // 💡 နာမည်ဟောင်း သုံးထားသော နေရာများအတွက်ပါ ဒေတာ တစ်ခါတည်း ထည့်ပေးခြင်း
      } else {
        setProfile(null);
        setActivePolicies([]);
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
      <FontAwesomeIcon icon={faUser} className="text-warning fs-5" />
      <h5 className="fw-bold text-dark mb-0">Personal Information</h5>
    </div>
              <Link to="/User/PasswordChangeUser" className="text-decoration-none ">
  <FontAwesomeIcon icon={faKey} className="me-1 " /> Change password
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

      {/* 💡 ပြင်ဆင်ချက် - Vehicle နှင့် Policy ဒေတာများကို ဇယားတစ်ခုတည်းတွင် ပေါင်းစည်း၍ Layout အပြည့်ဖြင့် ပြသခြင်း */}
<div className="row g-4">
  <div className="col-12">
    <div className="card bg-white border-0 rounded-4 shadow-sm p-4">
      
      {/* ကတ်ပြား၏ ခေါင်းစဉ်ပိုင်း */}
      <div className="d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
        <FontAwesomeIcon icon={faFileContract} className="text-warning fs-5" />
        <h5 className="fw-bold text-dark mb-0">Policies Information </h5>
      </div>
      
      <div className="d-flex flex-column gap-3 py-1">
        {/* Table Container - Responsive ဖြစ်ပြီး အောက်သို့ Scroll ဆွဲကြည့်နိုင်သည် */}
        <div className="table-responsive rounded-3 border border-light-subtle shadow-sm" style={{ maxHeight: "450px", overflowY: "auto" }}>
          <table className="table table-hover align-middle mb-0" style={{ minWidth: "1000px" }}>
            
            {/* Table Head - ခေါင်းစဉ်များ */}
            
            
            {/* Table Body - အချက်အလက်များ */}
            <tbody>
              {policies && policies.filter(item => item?.status?.toLowerCase() === 'active').length > 0 ? (
                policies
                  .filter(item => item?.status?.toLowerCase() === 'active') // Active ဖြစ်နေသော ပေါ်လစီများကိုသာ စစ်ထုတ်သည်
                  .map((item, index) => (
                    <tr key={index} className="border-bottom border-light-subtle">
                      
                      {/* ၁။ စဉ်နံပါတ် */}
                      <td className="ps-3 fw-medium text-secondary">{index + 1}</td>
                      
                      {/* ၂။ ပေါ်လစီနံပါတ် */}
                      <td>
                        <span className="fw-bold text-primary">{item?.policy_number || '-'}</span>
                      </td>
                      
                      {/* ၃။ ကားမော်ဒယ်နှင့် မော်ဒယ်နှစ် (ပေါင်းပြထားပါသည်) */}
                      <td>
                        <div className="fw-semibold text-dark">{item?.vehicle_model || '-'}</div>
                        <div className="text-muted small">Year: {item?.model_year || '-'}</div>
                      </td>
                      
                      {/* ၄။ ကားနံပါတ် */}
                      <td>
                        <span className="badge bg-light text-dark border border-secondary-subtle px-2 py-1.5 font-monospace fw-semibold">
                          {item?.vehicle_number || '-'}
                        </span>
                      </td>
                      
                      {/* ၅။ စတင်သည့် ရက်စွဲ */}
                      <td className="text-secondary fw-medium">{formatDate(item?.start_date)}</td>
                      
                      {/* ၆။ ကုန်ဆုံးမည့် ရက်စွဲ */}
                      <td className="text-secondary fw-medium">{formatDate(item?.end_date)}</td>
                      
                      {/* ၇။ Status Badge */}
                      <td className="text-center">
                        <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1.5 fw-bold text-uppercase small" style={{ fontSize: "0.75rem", letterSpacing: "0.5px" }}>
                          {item?.status}
                        </span>
                      </td>
                    </tr>
                  ))
              ) : (
                /* ပေါ်လစီ လုံးဝမရှိပါက ပြသမည့် Row */
                <tr>
                  <td colSpan="7" className="text-center text-muted py-5 fw-medium">
                    <div className="fs-6 mb-1">🚗 No Active Insurance Policies Found</div>
                    <div className="small text-secondary fw-normal">There are currently no active policies or connected vehicles for this account.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>

      </div>
    </div>
  );
};

export default Profile;