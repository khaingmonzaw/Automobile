import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

const CoverageUpdate = () => {
  const { coverageId } = useParams(); 
  const navigate = useNavigate();
  
  // Form values state
  const [coverageType, setCoverageType] = useState('');
  const [coverageLimit, setCoverageLimit] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');

  // Cache state to store database values for the Cancel button reset
  const [originalData, setOriginalData] = useState(null);

  // Track duplicate validation state
  const [isDuplicate, setIsDuplicate] = useState(false);

   // --- NEW STATE VARIABLES FOR SYSTEM MODAL ---
    const [showAlertModal, setShowAlertModal] = useState(false); // Controls the alert dialog visibility
    const [modalMessage, setModalMessage] = useState('');         // Stores the alert text string
    const [shouldRedirect, setShouldRedirect] = useState(false);   // Flag to navigate away after closing modal

  // Validation errors state tracking individual fields
  const [errors, setErrors] = useState({
    coverageType: false,
    coverageLimit: false,
    description: false
  });

  // Utility to fire custom dialog alerts instead of window.alert
  const triggerModalAlert = (msg, autoNavigate = false) => {
    setModalMessage(msg);
    setShouldRedirect(autoNavigate);
    setShowAlertModal(true);
  };

  // Handles closing the modal window
  const closeAlertModal = () => {
    setShowAlertModal(false);
    if (shouldRedirect) {
      navigate('/Admin/CoverageTypes');
    }
  };

  useEffect(() => {
    const fetchCurrentCoverage = async () => {
      try {
        console.log(`Fetching data for Coverage ID: ${coverageId}`);
        const response = await fetch(`http://localhost:3000/api/coverageupdate/${coverageId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Database Data Received successfully:", data);
          
          // Populate fields
          setCoverageType(data.coverage_type || '');
          setCoverageLimit(data.coverage_limit || '');
          setDescription(data.description || '');
          setStatus(data.status || 'active');

          // Cache initial record data for recovery resets later
          setOriginalData(data);
        } else {
          const errText = await response.text();
          console.error(`Backend returned error: ${errText}`);
          triggerModalAlert(`Backend returned error: ${errText}`, true);
        }
      } catch (error) {
        console.error('Network connection to backend failed:', error);
        triggerModalAlert(`Network connection to backend failed: ${error.message}`, true);
      }
    };

    if (coverageId) {
      fetchCurrentCoverage();
    }
  }, [coverageId]);

  // Triggered when clicking "Cancel" -> Resets fields back to database states
  const handleCancelReset = () => {
    if (originalData) {
      setCoverageType(originalData.coverage_type || '');
      setCoverageLimit(originalData.coverage_limit || '');
      setDescription(originalData.description || '');
      setStatus(originalData.status || 'active');
    }
    // Clear any active red validation labels and duplicate flags
    setErrors({
      coverageType: false,
      coverageLimit: false,
      description: false
    });
    setIsDuplicate(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsDuplicate(false);
    if (originalData) {
      const isUnchanged = 
        coverageType.trim() === (originalData.coverage_type || '').trim() &&
        Number(coverageLimit) === Number(originalData.coverage_limit) &&
        description.trim() === (originalData.description || '').trim() &&
        status === originalData.status;

      if (isUnchanged) {
        triggerModalAlert('No data changed.');
        return; // Stop form validation and API requests
      }
    }
    // Check empty inputs to toggle validation errors visually
    const newErrors = {
      coverageType: !coverageType.toString().trim(),
      coverageLimit: !coverageLimit.toString().trim(),
      description: !description.toString().trim()
    };

    setErrors(newErrors);

    // Stop execution if any basic field validation fails
    if (newErrors.coverageType || newErrors.coverageLimit || newErrors.description) {
      return;
    }

    // Duplicate Check Validation (Only run if the user actually modified the name text)
    if (originalData && coverageType.trim().toLowerCase() !== originalData.coverage_type.trim().toLowerCase()) {
      try {
        const checkResponse = await fetch(`http://localhost:3000/api/coverage/${encodeURIComponent(coverageType.trim())}`);
        const data = await checkResponse.json();
        
        if (data && data.coverage_type) {
          setIsDuplicate(true);
          setErrors(prev => ({ ...prev, coverageType: true }));
          return; // CRITICAL: Stop submission if duplicate name exists elsewhere
        }
      } catch (error) {
        console.error('Error verifying coverage type availability:', error);
         triggerModalAlert('Error verifying coverage type availability');
      }
    }

    const updatedForm = { 
      coverageType: coverageType.trim(),  
      coverageLimit: Number(coverageLimit), 
      description: description.trim(), 
      status 
    };

    try {
      const response = await fetch(`http://localhost:3000/api/coverageupdate/${coverageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedForm),
      });

      if (response.ok) {
         triggerModalAlert('Coverage updated successfully!', true);
      } else {
          const errorData = await response.json().catch(() => ({}));
          triggerModalAlert(`Failed to update: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
       triggerModalAlert('Could not connect to the backend server.');
    }
  };

  // Helper component to render the circular red error icon cleanly
  const ErrorIcon = () => (
    <div 
      className="position-absolute end-0 top-50 translate-middle-y me-3 d-flex align-items-center justify-content-center border border-danger rounded-circle text-danger fw-bold" 
      style={{ width: "18px", height: "18px", fontSize: "11px", pointerEvents: "none", lineHeight: "1" }}
    >
      !
    </div>
  );

  return (
    <div className="container-fluid py-3 text-start">
       {/* Informative Dialog Alert Popup Component */}
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
        <Link to="/Admin/CoverageTypes" className="text-decoration-none text-dark" >
                    <button className='btn btn-warning'>
                        <FontAwesomeIcon icon={faCircleLeft} />
                    </button></Link>
      </div>

      <div className="row my-3">
        <div className="card col-md-9 mx-auto bg-white p-4 border rounded-3 shadow-sm" style={{ maxWidth: "750px" }}>
          <h2 className="mb-2 fw-bold fs-4 text-dark text-center">Update Coverage</h2>
          <hr className="mb-4 text-secondary opacity-25" />
          
          <form onSubmit={handleSave} noValidate>
            
            {/* Coverage Type Input */}
            <div className="row my-3">
              <div className="col-sm-4 d-flex align-items-center">
                <label htmlFor="coverage-type" className="form-label text-secondary fw-semibold mb-0">
                  Coverage Type <span className="text-danger">*</span>
                </label>
              </div>
              <div className="col-sm-8">
                <div className="position-relative">
                  <input 
                    id="coverage-type"
                    type="text" 
                    className={`form-control py-2 px-3 text-dark fw-medium ${errors.coverageType ? 'border-danger' : 'border-secondary-subtle'}`}
                    placeholder="Enter Text...." 
                    value={coverageType}
                    onChange={(e) => {
                      setCoverageType(e.target.value);
                      if (isDuplicate) setIsDuplicate(false);
                      if (e.target.value.trim()) setErrors(prev => ({...prev, coverageType: false}));
                    }}
                    style={{ borderRadius: "8px", fontSize: "14px", paddingRight: "40px" }}
                  />
                  {errors.coverageType && <ErrorIcon />}
                </div>
                {errors.coverageType && !isDuplicate && (
                  <div className="text-danger small mt-1 text-start fw-medium">Coverage Type is required.</div>
                )}
                {isDuplicate && (
                  <div className="text-danger small mt-1 text-start fw-medium">This Coverage Type already exists in the database.</div>
                )}
              </div>
            </div>

            {/* Coverage Limit Input */}
            <div className="row my-3">
              <div className="col-sm-4 d-flex align-items-center">
                <label htmlFor="coverage-limit" className="form-label text-secondary fw-semibold mb-0">
                  Coverage Limit <span className="text-danger">*</span>
                </label>
              </div>
              <div className="col-sm-8">
                <div className="input-group position-relative">
                  <input 
                    id="coverage-limit"
                    type="number"
                    className={`form-control py-2 px-3 text-dark fw-medium ${errors.coverageLimit ? 'border-danger' : 'border-secondary-subtle'}`}
                    placeholder="100,000" 
                    value={coverageLimit}
                    onChange={(e) => {
                      setCoverageLimit(e.target.value);
                      if(e.target.value.trim()) setErrors(prev => ({...prev, coverageLimit: false}));
                    }}
                    style={{ borderRadius: "8px", paddingRight: errors.coverageLimit ? "65px" : "65px", fontSize: "14px" }}
                  />
                  <span className={`position-absolute top-50 translate-middle-y small fw-bold z-3 ${errors.coverageLimit ? 'text-danger' : 'text-secondary'}`} style={{ right: errors.coverageLimit ? "40px" : "15px", pointerEvents: "none" }}>
                    MMK
                  </span>
                  {errors.coverageLimit && <ErrorIcon />}
                </div>
                {errors.coverageLimit && (
                  <div className="text-danger small mt-1 text-start fw-medium">Coverage Limit is required.</div>
                )}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="row my-3">
              <div className="col-sm-4 pt-1">
                <label htmlFor="form-description" className="form-label text-secondary fw-semibold mb-0">
                  Description <span className="text-danger">*</span>
                </label>
              </div>
              <div className="col-sm-8">
                <div className="position-relative">
                  <textarea 
                    id="form-description"
                    className={`form-control py-2 px-3 text-dark fw-medium ${errors.description ? 'border-danger' : 'border-secondary-subtle'}`}
                    placeholder="Enter Text...." 
                    rows="4"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if(e.target.value.trim()) setErrors(prev => ({...prev, description: false}));
                    }}
                    style={{ borderRadius: "12px", resize: "none", fontSize: "14px", paddingRight: "40px" }}
                  />
                  {errors.description && (
                    <div className="position-absolute end-0 top-0 mt-3" style={{ transform: "translateY(0)" }}>
                      <ErrorIcon />
                    </div>
                  )}
                </div>
                {errors.description && (
                  <div className="text-danger small mt-1 text-start fw-medium">Description is required.</div>
                )}
              </div>
            </div>
            
            {/* Status Selector */}
            <div className="row align-items-center my-3">
              <div className="col-sm-4 text-start">
                <label htmlFor="form-status" className="form-label text-secondary fw-semibold mb-sm-0">
                  Status
                </label>
              </div>
              <div className="col-sm-8">
                <select 
                  id="form-status" 
                  className="form-select border-secondary-subtle py-2 px-3 text-dark fw-medium"
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button type="submit" className="btn btn-warning fw-bold text-dark shadow-sm">
                Update
              </button>
              <button 
                type="button" 
                className="btn btn-danger fw-bold text-white shadow-sm" 
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

export default CoverageUpdate;