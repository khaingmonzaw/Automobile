import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCar, faLock } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 💡 ပြင်ဆင်ချက် - localStorage ထဲက လက်ရှိဝင်ထားတဲ့ User ID ကို ယူသုံးခြင်း
   const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    // အကယ်၍ အကြောင်းအမျိုးမျိုးကြောင့် login ဝင်မထားရင် အလုပ်မလုပ်စေရန်
    if (!userId) {
      setError("အသုံးပြုသူအချက်အလက် ရှာမတွေ့ပါ။ ကျေးဇူးပြု၍ Login ပြန်ဝင်ပါ။");
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/user/profile/${userId}`);
        if (!response.ok) {
          throw new Error('ပရိုဖိုင်ဒေတာ ရယူရာတွင် အဆင်မပြေပါသဖြင့် ခေတ္တစောင့်ပေးပါ။');
        }
        const data = await response.json();
        setProfile(data);
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
      <div className="row g-4 mb-4">
        <div className="col-12">
          <div className="card bg-white border-0 rounded-4 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-warning fs-5" />
                <h3 className="fs-5 fw-bold text-dark mb-0">Personal Info</h3>
              </div>
            </div>
            
            <div className="row g-3">
              <div className="col-md-6">
                <label className="text-muted small fw-medium mb-1">Full Name</label>
                <p className="fw-semibold text-dark mb-0">{profile?.fullName || '-'}</p>
              </div>
              <div className="col-md-6">
                <label className="text-muted small fw-medium mb-1">Email</label>
                <p className="fw-semibold text-dark mb-0">{profile?.email || '-'}</p>
              </div>
              <div className="col-md-6">
                <label className="text-muted small fw-medium mb-1">Address</label>
                <p className="fw-semibold text-dark mb-0">{profile?.address || '-'}</p>
              </div>
              <div className="col-md-6">
                <label className="text-muted small fw-medium mb-1">Phone</label>
                <p className="fw-semibold text-dark mb-0">{profile?.phone || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card bg-white border-0 rounded-4 shadow-sm p-4 h-100">
            <div className="d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
              <FontAwesomeIcon icon={faCar} className="text-warning fs-5" />
              <h3 className="fs-5 fw-bold text-dark mb-0">Vehicle Information</h3>
            </div>
            <div className="row g-3">
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Vehicle Number</label>
                <p className="fw-semibold text-dark mb-0">{profile?.vehicle_number || '-'}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Policy Number</label>
                <p className="fw-semibold text-dark mb-0">{profile?.policy_number || '-'}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Vehicle Model</label>
                <p className="fw-semibold text-dark mb-0">{profile?.vehicle_model || '-'}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Status</label>
                <div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill small fw-semibold">
                    {profile?.status || 'Active'}
                  </span>
                </div>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Manufacture Date</label>
                <p className="fw-semibold text-dark mb-0">{profile?.manufactureDate || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card bg-white border-0 rounded-4 shadow-sm p-4 h-100">
            <div className="d-flex align-items-center gap-2 border-bottom pb-3 mb-3">
              <FontAwesomeIcon icon={faLock} className="text-warning fs-5" />
              <h3 className="fs-5 fw-bold text-dark mb-0">Account Information</h3>
            </div>
            <div className="row g-3">
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Username</label>
                <p className="fw-semibold text-dark mb-0">{profile?.fullName || '-'}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Policy Number</label>
                <p className="fw-semibold text-dark mb-0">{profile?.policy_number || '-'}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Status</label>
                <div>
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill small fw-semibold">
                    {profile?.status || 'Active'}
                  </span>
                </div>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">Start Date</label>
                <p className="fw-semibold text-secondary small mb-0">{formatDate(profile?.start_date)}</p>
              </div>
              <div className="col-6">
                <label className="text-muted small fw-medium mb-1">End Date</label>
                <p className="fw-semibold text-secondary small mb-0">{formatDate(profile?.end_date)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;