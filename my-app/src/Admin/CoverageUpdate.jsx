import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CoverageUpdate = () => {
  const { coverageId } = useParams(); 
  const navigate = useNavigate();
  
  // Form values state
  const [coverageType, setCoverageType] = useState('');
  const [baseRate, setBaseRate] = useState('');
  const [coverageLimit, setCoverageLimit] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');

  // Cache state to store database values for the Cancel button reset
  const [originalData, setOriginalData] = useState(null);

  // Validation errors state tracking individual fields
  const [errors, setErrors] = useState({
    coverageType: false,
    baseRate: false,
    coverageLimit: false,
    description: false
  });

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
          setBaseRate(data.base_rate || '');
          setCoverageLimit(data.coverage_limit || '');
          setDescription(data.description || '');
          setStatus(data.status || 'Active');

          // Cache initial record data for recovery resets later
          setOriginalData(data);
        } else {
          const errText = await response.text();
          console.error(`Backend returned error: ${errText}`);
        }
      } catch (error) {
        console.error('Network connection to backend failed:', error);
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
      setBaseRate(originalData.base_rate || '');
      setCoverageLimit(originalData.coverage_limit || '');
      setDescription(originalData.description || '');
      setStatus(originalData.status || 'Active');
    }
    // Clear any active red validation labels
    setErrors({
      coverageType: false,
      baseRate: false,
      coverageLimit: false,
      description: false
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Check empty inputs to toggle validation errors visually
    const newErrors = {
      coverageType: !coverageType.toString().trim(),
      baseRate: !baseRate.toString().trim(),
      coverageLimit: !coverageLimit.toString().trim(),
      description: !description.toString().trim()
    };

    setErrors(newErrors);

    // Stop execution if any validation fails
    if (newErrors.coverageType || newErrors.baseRate || newErrors.coverageLimit || newErrors.description) {
      return;
    }

    const updatedForm = { 
      coverageType: coverageType.trim(), 
      baseRate: Number(baseRate), 
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
        alert('Coverage updated successfully!');
        navigate('/Admin/CoverageTypes'); 
      } else {
        alert('Failed to update coverage data records.');
      }
    } catch (error) {
      console.error('Network Error:', error);
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
      <div className="mb-2 text-start">
        <button 
          type="button"
          className="btn btn-warning d-flex align-items-center justify-content-center text-dark p-0" 
          style={{ width: "40px", height: "36px", borderRadius: "8px" }}
          onClick={() => navigate('/Admin/CoverageTypes')} 
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
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
                  Coverage Type
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
                      if(e.target.value.trim()) setErrors(prev => ({...prev, coverageType: false}));
                    }}
                    style={{ borderRadius: "8px", fontSize: "14px", paddingRight: "40px" }}
                  />
                  {errors.coverageType && <ErrorIcon />}
                </div>
                {errors.coverageType && (
                  <div className="text-danger small mt-1 text-start fw-medium">*Coverage Type is required.</div>
                )}
              </div>
            </div>

            {/* Base Rate Input */}
            <div className="row my-3">
              <div className="col-sm-4 d-flex align-items-center">
                <label htmlFor="base-rate" className="form-label text-secondary fw-semibold mb-0">
                  Base Rate
                </label>
              </div>
              <div className="col-sm-8">
                <div className="input-group position-relative">
                  <input 
                    id="base-rate"
                    type="number"
                    className={`form-control py-2 px-3 text-dark fw-medium ${errors.baseRate ? 'border-danger' : 'border-secondary-subtle'}`}
                    placeholder="10,000" 
                    value={baseRate}
                    onChange={(e) => {
                      setBaseRate(e.target.value);
                      if(e.target.value.trim()) setErrors(prev => ({...prev, baseRate: false}));
                    }}
                    style={{ borderRadius: "8px", paddingRight: errors.baseRate ? "65px" : "65px", fontSize: "14px" }}
                  />
                  <span className={`position-absolute top-50 translate-middle-y small fw-bold z-3 ${errors.baseRate ? 'text-danger' : 'text-secondary'}`} style={{ right: errors.baseRate ? "40px" : "15px", pointerEvents: "none" }}>
                    MMK
                  </span>
                  {errors.baseRate && <ErrorIcon />}
                </div>
                {errors.baseRate && (
                  <div className="text-danger small mt-1 text-start fw-medium">*Base Rate is required.</div>
                )}
              </div>
            </div>

            {/* Coverage Limit Input */}
            <div className="row my-3">
              <div className="col-sm-4 d-flex align-items-center">
                <label htmlFor="coverage-limit" className="form-label text-secondary fw-semibold mb-0">
                  Coverage Limit
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
                  <div className="text-danger small mt-1 text-start fw-medium">*Coverage Limit is required.</div>
                )}
              </div>
            </div>

            {/* Description Textarea */}
            <div className="row my-3">
              <div className="col-sm-4 pt-1">
                <label htmlFor="form-description" className="form-label text-secondary fw-semibold mb-0">
                  Description
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
                  <div className="text-danger small mt-1 text-start fw-medium">*Description is required.</div>
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
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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