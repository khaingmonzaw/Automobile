import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewCoverage = () => {
  const navigate = useNavigate();
  const [coverageType, setCoverageType] = useState('');
  const [coverageLimit, setCoverageLimit] = useState('');
  const [description, setDescription] = useState('');

  const [validated, setValidated] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleReset = () => {
    setCoverageType('');
    setCoverageLimit('');
    setDescription('');
    setValidated(false);
    setIsDuplicate(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    setValidated(true);
    setIsDuplicate(false);

    // 1. Front-end Validation Check
    if (!coverageType || !coverageLimit || !description) {
      return; 
    }

    // 2. Duplicate Check Validation
    let duplicateDetected = false;
    try {
      const checkResponse = await fetch(`http://localhost:3000/api/coverage/${encodeURIComponent(coverageType.trim())}`);
      
      if (checkResponse.status === 200) {
        setIsDuplicate(true);
        duplicateDetected = true;
      }
    } catch (error) {
      console.error('Error verifying coverage type availability:', error);
    }

    // CRITICAL FIX: Block execution completely if a duplicate is found
    if (duplicateDetected) {
      return;
    }

    // 3. Match keys with backend requirements and sanitize values
    const formData = {
      coverageType: coverageType.trim(),      
      coverageLimit: Number(coverageLimit), 
      description: description.trim()
    };

    // 4. Save to Database
    try {
      const response = await fetch('http://localhost:3000/api/coverage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Coverage saved successfully!');
        navigate('/Admin/CoverageTypes'); 
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      alert('Could not connect to the backend server.');
    }
  };

  return (
    <div className="container-fluid py-3 text-start">
      <div className="mb-2 text-start">
        <button 
          className="btn btn-warning d-flex align-items-center justify-content-center text-dark p-0" 
          style={{ width: "40px", height: "36px", borderRadius: "8px" }}
          onClick={() => navigate('/Admin/CoverageTypes')} 
          aria-label="Back to coverage list"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </div>

      <div className="row my-3">
        <div className="card col-md-9 mx-auto bg-white p-4 border rounded-3 shadow-sm" style={{ maxWidth: "750px" }}>
          
          <h2 className="mb-2 fw-bold fs-4 text-dark text-center">New Coverage</h2>
          <hr className="mb-4 text-secondary opacity-25" />
          
          <form onSubmit={handleSave} noValidate>
            
            {/* Coverage Type */}
            <div className="row align-items-start my-3">
              <div className="col-sm-4 pt-2">
                <label htmlFor="coverage-type" className="form-label text-secondary fw-semibold mb-sm-0">
                  Coverage Type
                </label>
              </div>
              <div className="col-sm-8">
                <input 
                  id="coverage-type"
                  type="text" 
                  className={`form-control border-secondary-subtle py-2 px-3 text-dark fw-medium ${(validated && !coverageType) || isDuplicate ? 'is-invalid' : ''}`}
                  placeholder="Enter Text...." 
                  value={coverageType}
                  onChange={(e) => {
                    setCoverageType(e.target.value);
                    if (isDuplicate) setIsDuplicate(false);
                  }}
                  style={{ borderRadius: "8px", fontSize: "14px" }}
                  required
                />
                {validated && !coverageType && (
                  <div className="invalid-feedback text-danger mt-1 fw-medium" style={{ fontSize: "13px" }}>
                    *Coverage Type is required.
                  </div>
                )}
                {isDuplicate && (
                  <div className="invalid-feedback text-danger mt-1 fw-medium" style={{ fontSize: "13px" }}>
                    *This Coverage Type already exists in the database.
                  </div>
                )}
              </div>
            </div>

            {/* Coverage Limit */}
            <div className="row align-items-start my-3">
              <div className="col-sm-4 pt-2">
                <label htmlFor="coverage-limit" className="form-label text-secondary fw-semibold mb-sm-0">
                  Coverage Limit
                </label>
              </div>
              <div className="col-sm-8">
                <div className="input-group has-validation">
                  <input 
                    id="coverage-limit"
                    type="number" 
                    step="any"
                    className={`form-control border-secondary-subtle py-2 px-3 text-dark fw-medium ${validated && !coverageLimit ? 'is-invalid' : ''}`}
                    placeholder="100,000" 
                    value={coverageLimit}
                    onChange={(e) => setCoverageLimit(e.target.value)}
                    style={{ borderRadius: "8px", paddingRight: "65px", fontSize: "14px" }}
                    required
                  />
                  <span className="position-absolute end-0 top-50 translate-middle-y me-5 text-secondary small fw-bold z-3" style={{ pointerEvents: "none" }}>
                    MMK
                  </span>
                  <div className="invalid-feedback text-danger mt-1 fw-medium" style={{ fontSize: "13px" }}>
                    *Coverage Limit is required.
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="row align-items-start my-3">
              <div className="col-sm-4 pt-2">
                <label htmlFor="form-description" className="form-label text-secondary fw-semibold mb-sm-0">
                  Description
                </label>
              </div>
              <div className="col-sm-8">
                <textarea 
                  id="form-description"
                  className={`form-control border-secondary-subtle py-2 px-3 text-dark fw-medium ${validated && !description ? 'is-invalid' : ''}`}
                  placeholder="Enter Text...." 
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ borderRadius: "12px", resize: "none", fontSize: "14px" }}
                  required
                />
                <div className="invalid-feedback text-danger mt-1 fw-medium" style={{ fontSize: "13px" }}>
                  *Description is required.
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button type="submit" className="btn btn-warning fw-bold text-dark shadow-sm">
                Save
              </button>
              <button 
                type="button" 
                className="btn btn-danger fw-bold text-white shadow-sm" 
                onClick={handleReset}
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

export default NewCoverage;