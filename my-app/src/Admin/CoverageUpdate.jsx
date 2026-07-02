import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CoverageUpdate = () => {
  const { coverageId } = useParams(); 
  const navigate = useNavigate();
  
  const [coverageType, setCoverageType] = useState('');
  const [baseRate, setBaseRate] = useState('');
  const [coverageLimit, setCoverageLimit] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    const fetchCurrentCoverage = async () => {
      try {
        console.log(`Fetching data for Coverage ID: ${coverageId}`);
        const response = await fetch(`http://localhost:3000/api/coverage/${coverageId}`);
        
        console.log("Response Status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Database Data Received successfully:", data);
          
          // Set values into form fields based on backend column headers
          setCoverageType(data.coverage_type || '');
          setBaseRate(data.base_rate || '');
          setCoverageLimit(data.coverage_limit || '');
          setDescription(data.description || '');
          setStatus(data.status || 'Active');
        } else {
          const errText = await response.text();
          console.error(`Backend returned error layout: ${errText}`);
        }
      } catch (error) {
        console.error('Network connection to backend failed:', error);
      }
    };

    if (coverageId) {
      fetchCurrentCoverage();
    }
  }, [coverageId]);

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedForm = { coverageType, baseRate, coverageLimit, description, status };

    try {
      const response = await fetch(`http://localhost:3000/api/coverage/${coverageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedForm),
      });

      if (response.ok) {
        navigate('/Admin/CoverageTypes'); 
      } else {
        alert('Failed to update coverage data records.');
      }
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  return (
    <div className="container-fluid py-3 text-start">
      <div className="mb-2 text-start">
        <button 
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
          
          <form onSubmit={handleSave}>
            <div className="row align-items-center my-3">
              <div className="col-sm-4">
                <label htmlFor="coverage-type" className="form-label text-secondary fw-semibold mb-sm-0">
                  Coverage Type
                </label>
              </div>
              <div className="col-sm-8">
                <input 
                  id="coverage-type"
                  type="text" 
                  className="form-control border-secondary-subtle py-2 px-3 text-dark fw-medium"
                  placeholder="Enter Text...." 
                  value={coverageType}
                  onChange={(e) => setCoverageType(e.target.value)}
                  style={{ borderRadius: "8px", fontSize: "14px" }}
                />
              </div>
            </div>

            <div className="row align-items-center my-3">
              <div className="col-sm-4">
                <label htmlFor="base-rate" className="form-label text-secondary fw-semibold mb-sm-0">
                  Base Rate
                </label>
              </div>
              <div className="col-sm-8">
                <div className="input-group position-relative">
                  <input 
                    id="base-rate"
                    type="text" 
                    className="form-control border-secondary-subtle py-2 px-3 text-dark fw-medium"
                    placeholder="10,000" 
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    style={{ borderRadius: "8px", paddingRight: "65px", fontSize: "14px" }}
                  />
                  <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-secondary small fw-bold z-3" style={{ pointerEvents: "none" }}>
                    MMK
                  </span>
                </div>
              </div>
            </div>

            <div className="row align-items-center my-3">
              <div className="col-sm-4">
                <label htmlFor="coverage-limit" className="form-label text-secondary fw-semibold mb-sm-0">
                  Coverage Limit
                </label>
              </div>
              <div className="col-sm-8">
                <div className="input-group position-relative">
                  <input 
                    id="coverage-limit"
                    type="text" 
                    className="form-control border-secondary-subtle py-2 px-3 text-dark fw-medium"
                    placeholder="100,000" 
                    value={coverageLimit}
                    onChange={(e) => setCoverageLimit(e.target.value)}
                    style={{ borderRadius: "8px", paddingRight: "65px", fontSize: "14px" }}
                  />
                  <span className="position-absolute end-0 top-50 translate-middle-y me-3 text-secondary small fw-bold z-3" style={{ pointerEvents: "none" }}>
                    MMK
                  </span>
                </div>
              </div>
            </div>

            <div className="row align-items-start my-3">
              <div className="col-sm-4 pt-1">
                <label htmlFor="form-description" className="form-label text-secondary fw-semibold mb-sm-0">
                  Description
                </label>
              </div>
              <div className="col-sm-8">
                <textarea 
                  id="form-description"
                  className="form-control border-secondary-subtle py-2 px-3 text-dark fw-medium"
                  placeholder="Enter Text...." 
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ borderRadius: "12px", resize: "none", fontSize: "14px" }}
                />
              </div>
            </div>
            
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

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button type="submit" className="btn btn-warning fw-bold text-dark shadow-sm">
                Update
              </button>
              <button 
                type="button" 
                className="btn btn-danger fw-bold text-white shadow-sm" 
                onClick={() => navigate('/Admin/CoverageTypes')}
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