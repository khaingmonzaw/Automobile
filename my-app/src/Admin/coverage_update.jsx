import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const CoverageUpdate = () => {
  const { coverageId } = useParams();
  const navigate = useNavigate();
  const [coverageType, setCoverageType] = useState('');
  const [baseRate, setBaseRate] = useState('');
  const [coverageLimit, setCoverageLimit] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saving coverage:", { coverageType, baseRate, coverageLimit, description });
     navigate('/Admin/CoverageTypes');
  };

  return (
    <div className="container-fluid py-3 text-start">
      {/* Back Arrow Trigger Area (Increased icon font size) */}
      <div className="mb-2 text-start">
        <button 
          className="btn btn-warning d-flex align-items-center justify-content-center text-dark p-0" 
          style={{ width: "40px", height: "36px", borderRadius: "8px" }}
          onClick={() =>  navigate('/Admin/CoverageTypes')} 
          aria-label="Back to coverage list"
        >
          {/* Centered, Bold/Thick Vector Arrow Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </div>

      {/* Main Card Container Wrapper */}
      <div className="row my-3">
        
       {/* --- CHANGE THIS CARD WRAPPER LINE --- */}
        <div 
          className="card bg-white p-4 border rounded-3 shadow-sm mx-auto my-2 w-100" 
          style={{ maxWidth: "750px" }}
        >
          {/* Centered Heading Element */}
          <h2 className="mb-2 fw-bold fs-4 text-dark text-center">Update Coverage</h2>
          <hr className="mb-4 text-secondary opacity-25" />
          
          {/* --- CHANGE THIS FORM GAP LINE --- */}
          <form onSubmit={handleSave} className="col-md-11 col-lg-10 mx-auto d-flex flex-column gap-3">
            
            {/* Coverage Type Row */}
            <div className="row align-items-center">
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
                  placeholder="Collision" 
                  value={coverageType}
                  onChange={(e) => setCoverageType(e.target.value)}
                  style={{ borderRadius: "8px", fontSize: "14px" }}
                />
              </div>
            </div>

            {/* Base Rate Row */}
            <div className="row align-items-center">
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
                    placeholder="87,000" 
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    style={{ borderRadius: "8px", paddingRight: "65px", fontSize: "14px" }}
                  />
                  <span 
                    className="position-absolute end-0 top-50 translate-middle-y me-3 text-secondary small fw-bold z-3"
                    style={{ pointerEvents: "none" }}
                  >
                    MMK
                  </span>
                </div>
              </div>
            </div>

            {/* Coverage Limit Row */}
            <div className="row align-items-center">
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
                    placeholder="890,000" 
                    value={coverageLimit}
                    onChange={(e) => setCoverageLimit(e.target.value)}
                    style={{ borderRadius: "8px", paddingRight: "65px", fontSize: "14px" }}
                  />
                  <span 
                    className="position-absolute end-0 top-50 translate-middle-y me-3 text-secondary small fw-bold z-3"
                    style={{ pointerEvents: "none" }}
                  >
                    MMK
                  </span>
                </div>
              </div>
            </div>

            {/* Description Row */}
            <div className="row align-items-start">
              <div className="col-sm-4 pt-1">
                <label htmlFor="form-description" className="form-label text-secondary fw-semibold mb-sm-0">
                  Description
                </label>
              </div>
              <div className="col-sm-8">
                <textarea 
                  id="form-description"
                  className="form-control border-secondary-subtle py-2 px-3 text-dark fw-medium"
                  placeholder="Own vehicle damage caused by a collision" 
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ borderRadius: "12px", resize: "none", fontSize: "14px" }}
                />
              </div>
            </div>
            
            {/* Added Status Row Component Grid Linkage */}
          <div className="row align-items-center">
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

            {/* Action Control Button Row */}
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button 
                type="submit" 
                className="btn btn-warning px-5 py-2 fw-bold text-dark shadow-sm" 
                style={{ borderRadius: "10px", minWidth: "150px" }}
              >
                Update
              </button>
              <button 
                type="button" 
                className="btn btn-danger px-5 py-2 fw-bold text-white shadow-sm" 
                style={{ borderRadius: "10px", minWidth: "150px" }}
                onClick={() =>  navigate('/Admin/CoverageTypes')}
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