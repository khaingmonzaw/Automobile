import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

const ClaimApprovalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const data = location.state?.dataBundle;
  const [remark, setRemark] = useState("");
  const [submitting, setSubmitting] = useState(false);

  
  const [showConfirm, setShowConfirm] = useState(false); // Controls the confirm modal
  const [showSuccess, setShowSuccess] = useState(false); // Controls the success banner
  const [message, setMessage] = useState("");             // Stores the success/error text

  useEffect(() => {
    if (!data) {
      alert("No calculation record context found. Redirecting...");
      navigate('/dashboard');
    } else {
      setRemark(data.remark_msg || "Document is valid. Claim is Approved.");
    }
  }, [data, navigate]);

  if (!data) return null;


  const triggerSubmitConfirm = () => {
    setShowConfirm(true);
  };


  const handleFinalSubmit = async () => {
    setShowConfirm(false); 
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
        setMessage("Claims table successfully updated!");
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccess(false);
          navigate(`/Admin/AllClaims/ClaimStatusAction/${data.claim_id}`);
        }, 5000);
      } else {
        setMessage("Failed to confirm final approvals.");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to confirm final approvals.");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  // --- IMMEDIATE DIRECT REDIRECTION ---
  const handleImmediateCancel = () => {
    navigate(`/Admin/AllClaims/ClaimStatusAction/${data.claim_id}`);
  };

  return (
    <div className="container-fluid py-3">
      {/* Dynamic Top Banner Message Display */}
      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show text-start" role="alert">
          {message}
          <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
        </div>
      )}

      {/* Styled Confirmation Dialog Box (Only used for Submit now) */}
      {showConfirm && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Confirm Submission
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
              </div>
              <div className="modal-body text-center">
                <p>Are you sure you want to submit this decision details?</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button 
                  className="btn btn-warning fw-bold text-dark" 
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                >
                  Submit
                </button>
                <button className="btn btn-danger fw-bold text-white" onClick={() => setShowConfirm(false)}>
                  No, Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header Area */}
        <div className="d-flex flex-column align-items-start gap-2 mb-4">  
        <Link to={`/Admin/AllClaims/ClaimStatusAction/${data.claim_id}`}  className="text-decoration-none text-dark" >
            <button className='btn  btn-warning'>
              <FontAwesomeIcon icon={faCircleLeft} />
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

        <hr className="my-4 text-secondary opacity-25 mx-2" />

        {/* Core Field Data Layout Grid */}
        <div className="row g-4 text-start px-2">
          <div className="col-lg-6 d-flex flex-column gap-3">
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Policy No</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.policy_no}</span>
              </div>
            </div>
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Policy Status</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.policy_status.toUpperCase()}</span>
              </div>
            </div>
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Coverage Status</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.coverage_status}</span>
              </div>
            </div>
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Compensation Amount</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.compensation_amt}</span>
              </div>
            </div>
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Risk Level</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.risk_lvl}</span>
              </div>
            </div>
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Status</div>
              <div className={`col-sm-7 fw-bold d-flex ${data.status === 'REJECTED' ? 'text-danger' : 'text-success'}`}>
                <span className="me-2">:</span>
                <span>{data.status}</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-flex flex-column gap-3">
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Accident Type</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.accident_type}</span>
              </div>
            </div>
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Accident Date</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.accident_date ? new Date(data.accident_date).toLocaleDateString('en-CA') : 'N/A'}</span>
              </div>
            </div>
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Submitted Date</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.submitted_date ? new Date(data.submitted_date).toLocaleDateString('en-CA') : 'N/A'}</span>
              </div>
            </div>
            <div className="row align-items-baseline">
              <div className="col-sm-5 text-secondary fw-semibold">Claimed Amount</div>
              <div className="col-sm-7 fw-semibold text-dark d-flex">
                <span className="me-2">:</span><span>{data.claim_amt}</span>
              </div>
            </div>
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

        {/* Action Bottom Buttons Segment */}
        <div className="d-flex justify-content-center gap-3 mt-5 px-2">
          <button onClick={triggerSubmitConfirm} className="btn btn-warning fw-bold text-dark shadow-sm">
            Submit
          </button>
          {/* Changed onClick here to bypass the dialog box entirely */}
          <button onClick={handleImmediateCancel} className="btn btn-danger fw-bold text-white shadow-sm">
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default ClaimApprovalDetails;