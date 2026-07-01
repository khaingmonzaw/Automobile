import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ClaimApprovalDetails = () => {
  const [remark, setRemark] = useState("Document is valid. Claim is Approved.");

  return (
    <div className="container-fluid py-3">
      {/* Page Header Area */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="" className="text-decoration-none">
          <button 
            className="btn btn-warning d-flex align-items-center justify-content-center fw-bold text-dark" 
            style={{ width: "40px", height: "36px", borderRadius: "8px" }}
            aria-label="Go back"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        </Link>
        <h2 className="mb-0 fw-bold fs-4 text-dark">Claim Approval Details</h2>
      </div>

      {/* Details White Layout Card */}
      <div className="card bg-white border-0 rounded-3 shadow-sm p-4 mx-auto w-100" style={{ maxWidth: "1150px" }}>
        
        {/* Top Segmented Metadata Grid Row */}
        <div className="row g-3 text-start mb-2 px-2">
          <div className="col-md-4">
            <div className="d-flex flex-column">
              <span className="text-secondary small fw-medium mb-1">Claim ID</span>
              <span className="fw-bold fs-5 text-dark">CLM-0001</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column">
              <span className="text-secondary small fw-medium mb-1">Customer ID</span>
              <span className="fw-bold text-dark fs-5">CUS-123</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column">
              <span className="text-secondary small fw-medium mb-1">Customer Name</span>
              <span className="fw-bold text-dark fs-5">Jhon Doe</span>
            </div>
          </div>
        </div>

        {/* Gray Decorative Section Divider */}
        <hr className="my-4 text-secondary opacity-25 mx-2" />

        {/* Core Field Data Layout Grid */}
        <div className="row g-4 text-start px-2">
          
          {/* Left Layout Column Block */}
          <div className="col-lg-6 d-flex flex-column gap-3">
            
            {/* Policy Number Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Policy No</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>PL-0003</span>
              </div>
            </div>

            {/* Policy Status Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Policy Status</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>Active</span>
              </div>
            </div>
            
            {/* Coverage Status Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Coverage Status</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>Valid</span>
              </div>
            </div>

            {/* Compensation Amount Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Compensation Amount</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>200,000</span>
              </div>
            </div>

            {/* Risk Level Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Risk Level</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>Medium</span>
              </div>
            </div>

            {/* Colored Status Tag Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Status</div>
              <div className="col-sm-7 fw-bold text-success d-flex">
                <span className="me-2">:</span><span>Approved</span>
              </div>
            </div>

          </div>

          {/* Right Layout Column Block */}
          <div className="col-lg-6 d-flex flex-column gap-3">

            {/* Accident Type Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Accident Type</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>Thief</span>
              </div>
            </div>

            {/* Accident Date Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Accident Date</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>10.05.2025</span>
              </div>
            </div>

            {/* Claim Date Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Claim Date</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>12.05.2025</span>
              </div>
            </div>

            {/* Claimed Amount Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Claimed Amount</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>150,000</span>
              </div>
            </div>
            
            {/* Dynamic Claim Description Textblock */}
            <div className="row align-items-start">
              <div className="col-sm-5 text-secondary fw-semibold">Claim Description</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span>
                <span>Motorcycle stolen from parking lot.</span>
              </div>
            </div>

          </div>

        </div>

        {/* Remark Text Input Area Wrapper */}
        <div className="text-start mt-4 px-2">
          <label htmlFor="remark-textarea" className="form-label text-secondary fw-semibold small mb-2">
            Remark <span className="text-danger">*</span>
          </label>
          <textarea 
            id="remark-textarea" 
            className="form-control bg-light border border-secondary-subtle p-3" 
            rows="3"
            value={remark} 
            onChange={(e) => setRemark(e.target.value)} 
            style={{ borderRadius: "12px", fontSize: "0.95rem" }}
          />
        </div>

        {/* Action Bottom Buttons Segment (Centered) */}
        <div className="d-flex justify-content-center gap-3 mt-5 px-2">
          <button className="btn btn-warning
          fw-bold text-dark shadow-sm" >
            Submit
          </button>
          <button className="btn btn-danger
          fw-bold text-white shadow-sm" >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default ClaimApprovalDetails;