import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ClaimApprovalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const data = location.state?.dataBundle;
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false); 
  useEffect(() => {
    if (!data) {
      alert("No calculation record context found. Redirecting...");
      navigate('/dashboard');
    } else {
      setRemark(data.remark_msg || "Document is valid. Claim is Approved.");
    }
  }, [data, navigate]);

  if (!data) return null;

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const staffId = user?.id;
    try {
      const response = await fetch(`http://localhost:3000/api/resultupdate/${data.claim_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataBundle: data,             
          remark: remark,
          staffId: staffId
        })
      });

      if (response.ok) {
        alert("Claims table successfully updated!");
        // Navigate back to view updated database status
        navigate(`/Admin/AllClaims/ClaimStatusAction/${data.claim_id}`);
      } else {
        alert("Failed to confirm final approvals.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Navigate back directly WITHOUT database modification updates
    navigate(`/Admin/AllClaims/ClaimStatusAction/${data.claim_id}`);
  };
  
 //{`/Admin/AllClaims/ClaimStatusAction/${data.claim_id}`} 

  return (
    <div className="container-fluid py-3">
      {/* Page Header Area */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/Admin/AllClaims" className="text-decoration-none">
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
              <span className="fw-bold fs-5 text-dark">CLM-{data.claim_id}</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column">
              <span className="text-secondary small fw-medium mb-1">Customer ID</span>
              <span className="fw-bold text-dark fs-5">CUS-{data.user_id}</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column">
              <span className="text-secondary small fw-medium mb-1">Customer Name</span>
              <span className="fw-bold text-dark fs-5">{data.user_name}</span>
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
                <span className="me-2">:</span><span>{data.policy_no}</span>
              </div>
            </div>

            {/* Policy Status Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Policy Status</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.policy_status.toUpperCase()}</span>
              </div>
            </div>
            
            {/* Coverage Status Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Coverage Status</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.coverage_status}</span>
              </div>
            </div>

            {/* Compensation Amount Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Compensation Amount</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.compensation_amt}</span>
              </div>
            </div>

            {/* Risk Level Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Risk Level</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.risk_lvl}</span>
              </div>
            </div>

            {/* Colored Status Tag Row */}
            <div className="row align-items-baseline">
            <div className="col-sm-5 text-secondary fw-semibold">Status</div>
            <div className={`col-sm-7 fw-bold d-flex ${data.status === 'REJECTED' ? 'text-danger' : 'text-success'}`}>
                <span className="me-2">:</span>
                <span>{data.status}</span>
            </div>
            </div>

          </div>

          {/* Right Layout Column Block */}
          <div className="col-lg-6 d-flex flex-column gap-3">

            {/* Accident Type Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Accident Type</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.accident_type}</span>
              </div>
            </div>

            {/* Accident Date Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Accident Date</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.accident_date ? new Date(data.accident_date).toLocaleDateString('en-CA') : 'N/A'}</span>
              </div>
            </div>

            {/* Claim Date Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Submitted Date</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.submitted_date ? new Date(data.submitted_date).toLocaleDateString('en-CA') : 'N/A'}</span>
              </div>
            </div>

            {/* Claimed Amount Row */}
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Claimed Amount</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.claim_amt}</span>
              </div>
            </div>
            
            {/* Dynamic Claim Description Textblock */}
            <div className="row align-items-start">
              <div className="col-sm-5 text-secondary fw-semibold">Claim Description</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span>
                <span>{data.des}</span>
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
          <button onClick={handleFinalSubmit} className="btn btn-warning
          fw-bold text-dark shadow-sm" >
            Submit
          </button>
          <button onClick={handleCancel} className="btn btn-danger
          fw-bold text-white shadow-sm" >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default ClaimApprovalDetails;