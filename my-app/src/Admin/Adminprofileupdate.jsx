import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

// Warning မတက်စေရန် ErrorIcon ကို Component အပြင်ဘက် (Global Scope) သို့ ရွှေ့ထုတ်ထားပါသည်
const ErrorIcon = () => (
  <div 
    className="position-absolute end-0 top-50 translate-middle-y me-3 d-flex align-items-center justify-content-center border border-danger rounded-circle text-danger fw-bold" 
    style={{ width: "18px", height: "18px", fontSize: "11px", pointerEvents: "none", lineHeight: "1" }}
  >
    !
  </div>
);

const Adminprofileupdate = () => {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Admin');
  const [nrc, setNrc] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  const [originalData, setOriginalData] = useState(null);

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    phone: false,
    nrc: false,
    dob: false,
    address: false
  });

  const triggerModalAlert = (msg, autoNavigate = false) => {
    setModalMessage(msg);
    setShouldRedirect(autoNavigate);
    setShowAlertModal(true);
  };

  const closeAlertModal = () => {
    setShowAlertModal(false);
    if (shouldRedirect) {
      navigate('/Admin/Profile');
    }
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!userId) {
        triggerModalAlert("Data Not Found. Please Login First!!!", true);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/admin/users/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          const profileData = Array.isArray(data) ? data[0] : data;
          
          setName(profileData?.name || profileData?.fullName || '');
          setEmail(profileData?.email || '');
          setPhone(profileData?.phone || '');
          setRole(profileData?.role || 'Admin');
          setNrc(profileData?.nrc || '');
          setDob(profileData?.dob ? profileData.dob.split('T')[0] : '');
          setAddress(profileData?.address || '');

          setOriginalData(profileData);
        } else {
          const errText = await response.text();
          triggerModalAlert(`Backend returned error: ${errText}`);
        }
      } catch (error) {
        triggerModalAlert(`Network connection to backend failed: ${error.message}`);
      }
    };

    fetchAdminProfile();
  }, [userId]);

  const handleCancelReset = () => {
    if (originalData) {
      setName(originalData.name || originalData.fullName || '');
      setEmail(originalData.email || '');
      setPhone(originalData.phone || '');
      setRole(originalData.role || 'Admin');
      setNrc(originalData.nrc || '');
      setDob(originalData.dob ? originalData.dob.split('T')[0] : '');
      setAddress(originalData.address || '');
      navigate('/Admin/Staff');
    }
    setErrors({
      name: false,
      email: false,
      phone: false,
      nrc: false,
      dob: false,
      address: false
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (originalData) {
      const isUnchanged = 
        name.trim() === (originalData.name || originalData.fullName || '').trim() &&
        email.trim() === (originalData.email || '').trim() &&
        phone.trim() === (originalData.phone || '').trim() &&
        nrc.trim() === (originalData.nrc || '').trim() &&
        dob.trim() === (originalData.dob ? originalData.dob.split('T')[0] : '').trim() &&
        address.trim() === (originalData.address || '').trim();

      if (isUnchanged) {
        triggerModalAlert('No data changed.');
        return;
      }
    }

    const newErrors = {
      name: !name.toString().trim(),
      email: !email.toString().trim(),
      phone: !phone.toString().trim(),
      nrc: !nrc.toString().trim(),
      dob: !dob.toString().trim(),
      address: !address.toString().trim()
    };

    setErrors(newErrors);

    if (newErrors.name || newErrors.email || newErrors.phone || newErrors.nrc || newErrors.dob || newErrors.address) {
      return;
    }

    const updatedForm = { 
      name: name.trim(),  
      email: email.trim(), 
      phone: phone.trim(), 
      role,
      nrc: nrc.trim(),
      dob,
      address: address.trim()
    };

    try {
      const response = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedForm),
      });

      if (response.ok) {
         triggerModalAlert('Profile updated successfully!', true);
      } else {
          const errorData = await response.json().catch(() => ({}));
          triggerModalAlert(`Failed to update: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
       triggerModalAlert('Could not connect to the backend server.');
    }
  };

  return (
    <div className="container-fluid py-3 text-start bg-light min-vh-100">
      {showAlertModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,.5)", zIndex: 1055 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">System Notification</h5>
                <button type="button" className="btn-close" onClick={closeAlertModal}></button>
              </div>
              <div className="modal-body text-center py-4">
                <p className="mb-0 fw-medium text-dark">{modalMessage}</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button className="btn btn-warning fw-bold text-dark px-4" onClick={closeAlertModal}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-2 text-start">
        <Link to="/Admin/Staff" className="text-decoration-none text-dark">
          <button className='btn btn-warning'>
              <FontAwesomeIcon icon={faCircleLeft} />
          </button>
        </Link>
      </div>

      <div className="row my-3">
        <div className="card col-md-9 mx-auto bg-white p-4 border rounded-3 shadow-sm" style={{ maxWidth: "750px" }}>
          <h2 className="mb-2 fw-bold fs-4 text-dark text-center">Update Admin Profile</h2>
          <hr className="mb-4 text-secondary opacity-25" />
          
          <form onSubmit={handleSave} noValidate>
            
            <div className="row my-3">
              <div className="col-sm-4 d-flex align-items-center">
                <label htmlFor="admin-name" className="form-label text-secondary fw-semibold mb-0">
                  Full Name <span className="text-danger">*</span>
                </label>
              </div>
              <div className="col-sm-8">
                <div className="position-relative">
                  <input 
                    id="admin-name"
                    type="text" 
                    className={`form-control py-2 px-3 text-dark fw-medium ${errors.name ? 'border-danger' : 'border-secondary-subtle'}`}
                    placeholder="Enter Full Name...." 
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (e.target.value.trim()) setErrors(prev => ({...prev, name: false}));
                    }}
                    style={{ borderRadius: "8px", fontSize: "14px", paddingRight: "40px" }}
                  />
                  {errors.name && <ErrorIcon />}
                </div>
                {errors.name && (
                  <div className="text-danger small mt-1 text-start fw-medium">Full Name is required.</div>
                )}
              </div>
            </div>

            <div className="row my-3">
              <div className="col-sm-4 d-flex align-items-center">
                <label htmlFor="admin-email" className="form-label text-secondary fw-semibold mb-0">
                  Email <span className="text-danger">*</span>
                </label>
              </div>
              <div className="col-sm-8">
                <div className="position-relative">
                  <input 
                    id="admin-email"
                    type="email"
                    className={`form-control py-2 px-3 text-dark fw-medium ${errors.email ? 'border-danger' : 'border-secondary-subtle'}`}
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if(e.target.value.trim()) setErrors(prev => ({...prev, email: false}));
                    }}
                    style={{ borderRadius: "8px", fontSize: "14px", paddingRight: "40px" }}
                  />
                  {errors.email && <ErrorIcon />}
                </div>
                {errors.email && (
                  <div className="text-danger small mt-1 text-start fw-medium">Email is required.</div>
                )}
              </div>
            </div>

            <div className="row my-3">
              <div className="col-sm-4 d-flex align-items-center">
                <label htmlFor="admin-phone" className="form-label text-secondary fw-semibold mb-0">
                  Phone Number <span className="text-danger">*</span>
                </label>
              </div>
              <div className="col-sm-8">
                <div className="position-relative">
                  <input 
                    id="admin-phone"
                    type="text"
                    className={`form-control py-2 px-3 text-dark fw-medium ${errors.phone ? 'border-danger' : 'border-secondary-subtle'}`}
                    placeholder="09XXXXXXXXX" 
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if(e.target.value.trim()) setErrors(prev => ({...prev, phone: false}));
                    }}
                    style={{ borderRadius: "8px", fontSize: "14px", paddingRight: "40px" }}
                  />
                  {errors.phone && <ErrorIcon />}
                </div>
                {errors.phone && (
                  <div className="text-danger small mt-1 text-start fw-medium">Phone Number is required.</div>
                )}
              </div>
            </div>

            

            <div className="row my-3">
              <div className="col-sm-4 d-flex align-items-center">
                <label htmlFor="admin-nrc" className="form-label text-secondary fw-semibold mb-0">
                  NRC No <span className="text-danger">*</span>
                </label>
              </div>
              <div className="col-sm-8">
                <div className="position-relative">
                  <input 
                    id="admin-nrc"
                    type="text"
                    className={`form-control py-2 px-3 text-dark fw-medium ${errors.nrc ? 'border-danger' : 'border-secondary-subtle'}`}
                    placeholder="12/MKaLa(N)XXXXXX" 
                    value={nrc}
                    onChange={(e) => {
                      setNrc(e.target.value);
                      if(e.target.value.trim()) setErrors(prev => ({...prev, nrc: false}));
                    }}
                    style={{ borderRadius: "8px", fontSize: "14px", paddingRight: "40px" }}
                  />
                  {errors.nrc && <ErrorIcon />}
                </div>
                {errors.nrc && (
                  <div className="text-danger small mt-1 text-start fw-medium">NRC No is required.</div>
                )}
              </div>
            </div>

            <div className="row my-3">
              <div className="col-sm-4 d-flex align-items-center">
                <label htmlFor="admin-dob" className="form-label text-secondary fw-semibold mb-0">
                  Date of Birth <span className="text-danger">*</span>
                </label>
              </div>
              <div className="col-sm-8">
                <div className="position-relative">
                  <input 
                    id="admin-dob"
                    type="date"
                    max={today}
                    className={`form-control py-2 px-3 text-dark fw-medium ${errors.dob ? 'border-danger' : 'border-secondary-subtle'}`}
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      if(e.target.value.trim()) setErrors(prev => ({...prev, dob: false}));
                    }}
                    style={{ borderRadius: "8px", fontSize: "14px", paddingRight: "40px" }}
                  />
                  {errors.dob && <ErrorIcon />}
                </div>
                {errors.dob && (
                  <div className="text-danger small mt-1 text-start fw-medium">Date of Birth is required.</div>
                )}
              </div>
            </div>

            <div className="row my-3">
              <div className="col-sm-4 pt-1">
                <label htmlFor="admin-address" className="form-label text-secondary fw-semibold mb-0">
                  Address <span className="text-danger">*</span>
                </label>
              </div>
              <div className="col-sm-8">
                <div className="position-relative">
                  <textarea 
                    id="admin-address"
                    className={`form-control py-2 px-3 text-dark fw-medium ${errors.address ? 'border-danger' : 'border-secondary-subtle'}`}
                    placeholder="Enter Address...." 
                    rows="3"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if(e.target.value.trim()) setErrors(prev => ({...prev, address: false}));
                    }}
                    style={{ borderRadius: "12px", resize: "none", fontSize: "14px", paddingRight: "40px" }}
                  />
                  {errors.address && (
                    <div className="position-absolute end-0 top-0 mt-3" style={{ transform: "translateY(0)" }}>
                      <ErrorIcon />
                    </div>
                  )}
                </div>
                {errors.address && (
                  <div className="text-danger small mt-1 text-start fw-medium">Address is required.</div>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button type="submit" className="btn btn-warning fw-bold text-dark shadow-sm px-4">
                Update
              </button>
              <button 
                type="button" 
                className="btn btn-danger fw-bold text-white shadow-sm px-4" 
                onClick={handleCancelReset}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Adminprofileupdate;