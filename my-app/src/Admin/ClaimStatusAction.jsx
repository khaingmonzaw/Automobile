import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

function ClaimStatusAction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageType, setMessageType] = useState(''); 
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  // --- State for claim data ---
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State for decision form ---
  const [decision, setDecision] = useState('');
  const [remarkInput, setRemarkInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // --- Confirmation Modal ---
  const [showConfirm, setShowConfirm] = useState(false);

  // --- Success/Error Banner ---
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch claim data
  const fetchClaimData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:3000/api/admin/ClaimStatus/${id}`);
      const data = await response.json();
      if (response.ok) {
        setClaim(data);
      } else {
        throw new Error(`${data.message || ''} Failed to fetch claim details.`); 
      }
    } catch (err) {
      console.error("Error fetching claim:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimData();
  }, [id]);

  const handleSubmitDecision = (e) => {
    e.preventDefault();
    
    if (!decision) {
      // pleas select radio button tag
      setShowValidationDialog(true);
      
     
      setTimeout(() => {
        setShowValidationDialog(false);
      }, 3000);
      return;
    }
    
    setShowConfirm(true);
  };
  const confirmDecisionSubmit = async () => {
    setShowConfirm(false);
    const user = JSON.parse(localStorage.getItem("user"));
    const staffId = user?.id;
    setSubmitting(true);
// default messages that carries to database(myo code start)
let finalRemark = remarkInput?.trim();

if (!finalRemark) {
  if (decision === 'APPROVED') {
    finalRemark = "Information is Valid.";
  } else if (decision === 'REJECTED') {
    finalRemark = "Information is Invalid.";
  }
}
//myo code end 
    try {
      const response = await fetch(`http://localhost:3000/api/admin/claims/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: decision, 
         remark: finalRemark,//send to backend default msg
          staffId: staffId 
        })
      });
    
      const textData = await response.text();
      let resData = {};
      try {
        resData = textData ? JSON.parse(textData) : {};
      } catch (e) {
        console.error("JSON parsing error:", e);
      }

      if (response.ok) {
        //  Success path
        setMessageType('success'); 
        if (decision === 'APPROVED') {
          setMessage("Claim approved successfully!");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate('/Admin/ClaimApprovalDetails', { 
              state: { dataBundle: resData, claimId: id } 
            });
          }, 5000);
        } else {
          setMessage("Claim rejected successfully.");
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            fetchClaimData(); 
          }, 5000);
        }
      } else {
        //  Server error path
        setMessageType('error');
        setMessage(`${resData.message || ''} Server Error: ${response.status}`);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      }
    } catch (err) {
      console.error("Submission Error:", err);
        // Network error path   
      setMessageType('error');
      setMessage("Network Error: Cannot connect to the server.");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5 fw-bold text-secondary">Data is Loading...</div>;
  }
  
  if (error || !claim) {
    return (
      <div className="text-center py-5 text-danger fw-bold">
        ❌ {error || "Claim NOT Found"}
      </div>
    );
  }

  return (
    <>
      {/* 🔔 Success/ Banner */}
      {showSuccess && (
        <div 
          className={`alert alert-dismissible fade show text-start ${
            messageType === 'success' ? 'alert-success' : 'alert-danger'
          }`} 
          role="alert"
        >
          {message}
          <button type="button" className="btn-close" onClick={() => setShowSuccess(false)}></button>
        </div>
      )}

      {/* Back Button */}
      <div className="mb-2 text-start">
         <Link to={`/Admin/AllClaims`}  className="text-decoration-none text-dark" >
            <button className='btn  btn-warning'>
              <FontAwesomeIcon icon={faCircleLeft} />
            </button>
        </Link>
      </div>

      <div>
           {/* ⚠️ Warning Dialog Box (No Buttons, Auto-dismisses) */}
        {showValidationDialog && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,.4)", zIndex: 1060 }}
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "400px" }}>
              <div className="modal-content border-0 rounded-4 shadow p-4 text-center">
                <div className="modal-body">
                  {/* အဝိုင်းပုံ Warning သင်္ကေတ */}
                  <div className="text-warning mb-3" style={{ fontSize: "3rem" }}>
                    ⚠️
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Selection Required</h4>
                  <p className="text-secondary mb-0">
                    Please select an action (Approve or Reject) to proceed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* 🟢 Admin Decision Confirmation Modal */}
        {showConfirm && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,.5)", zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Confirm Submission!</h5>
                  <button className="btn-close" onClick={() => setShowConfirm(false)}></button>
                </div>
                <div className="modal-body text-center">
                  <p>
                    Are you sure you want to <span className="text-danger fw-bold">{decision.toLowerCase()}</span> this claim?
                  </p>
                </div>
                <div className="modal-footer justify-content-center">
                  <button className="btn btn-warning" onClick={confirmDecisionSubmit} disabled={submitting}>
                    {submitting ? "Processing..." : "Confirm"}
                  </button>
                  <button className="btn btn-danger" onClick={() => setShowConfirm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="claim-detail-container">
          <div className="card bg-white border-0 rounded-4 shadow-sm p-4 mx-auto" style={{ maxWidth: "850px", width: "100%" }}>
            <div>
              <h2 className="mb-0 fw-bold fs-3 text-dark">Claim Approval Details</h2>
            </div>
            <div className="table-responsive">
              <table className="table claim-table">
                <tbody>
                  <tr>
                    <td>Claim ID</td>
                    <td className='text-primary'>CLM-{claim.claim_id}</td>
                  </tr>
                  <tr>
                    <td>Policy Number</td>
                    <td>{claim.policy_id}</td>
                  </tr>
                  <tr>
                    <td>User ID</td>
                    <td>{claim.user_id}</td>
                  </tr>
                  <tr>
                    <td>User Name</td>
                    <td>{claim.name}</td>
                  </tr>
                  <tr>
                    <td>Accident Type</td>
                    <td>{claim.accident_type}</td>
                  </tr>
                  <tr>
                    <td>Accident Date</td>
                    <td>
                      {claim.accident_date
                        ? new Date(claim.accident_date).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td>Vehicle Number</td>
                    <td>{claim.vehicle_number}</td>
                  </tr>
                  <tr>
                    <td>Vehicle Model</td>
                    <td>{claim.vehicle_model}</td>
                  </tr>
                  <tr>
                    <td>Claim Amount</td>
                    <td>
                      {claim.claimed_amount
                        ? `${claim.claimed_amount} MMK`
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td
                      className={
                        claim.status === "APPROVED"
                          ? "text-success fw-bold"
                          : claim.status === "REJECTED"
                          ? "text-danger fw-bold"
                          : claim.status === "PENDING"
                          ? "text-warning fw-bold"
                          : ""
                      }
                    >
                      {claim.status}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/*  Remarks display section */}
            {claim.status === 'PENDING' && (
              <div className="remarks-box pending-remarks">
                <span className="remarks-label">Remarks</span>
                <textarea
                  className="form-control remarks-input"
                  placeholder="Enter remarks..."
                  value={remarkInput}
                  onChange={(e) => setRemarkInput(e.target.value)}
                />
              </div>
            )}

            {claim.status === 'APPROVED' && (
              <div className="remarks-box approved-remarks">
                <span className="remarks-label">Status</span>
                <p className="remarks-text" style={{ color: '#52DD75', fontWeight: 'bold' }}>
                  ✅ Approved: {claim.remark }
                  {/* update change for more flexible default message to .cbl */}
                   </p>
              </div>
            )}

            {claim.status === 'REJECTED' && (
              <div className="remarks-box rejected-remarks">
                <span className="remarks-label">Status</span>
                <p className="remarks-text" style={{ color: '#DC3545', fontWeight: 'bold' }}>
                  ❌ Rejected: {claim.remark }
                      {/*update change for more flexible default message to .cbl */}
                </p>
              </div>
            )}

            

            {/* Pending Options */}
            {claim.status === 'PENDING' && (
              <>
                <div className="decision-section">
                  <span className="decision-label">Decision *</span>
                  <div className="decision-options">
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="decision"
                        value="APPROVED"
                        checked={decision === 'APPROVED'}
                        onChange={(e) => setDecision(e.target.value)}
                      />
                      APPROVE
                    </label>
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="decision"
                        value="REJECTED"
                        checked={decision === 'REJECTED'}
                        onChange={(e) => setDecision(e.target.value)}
                      />
                      REJECT
                    </label>
                  </div>
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <button className="btn btn-warning me-2" onClick={handleSubmitDecision} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Continue'}
                  </button>
                  <button className="btn btn-danger ms-2" onClick={() => navigate(-1)}>Cancel</button>
                </div>
              </>
            )}
          </div>

          <style>{`
            .claim-detail-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; background: #F2F9FF; font-family: 'Roboto', sans-serif; }
            .card { background: #FFFFFF; border-radius: 25px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06); padding: 32px 40px 40px; max-width: 650px; width: 100%; }
            .card h2 { font-size: 32px; font-weight: 400; letter-spacing: 0.03em; color: #000000; margin: 0 0 8px 0; }
            .decision-section { margin-top: 24px; margin-bottom: 12px; }
            .decision-label { display: block; font-size: 20px; font-weight: 400; color: #000000; margin-bottom: 12px; }
            .decision-options { display: flex; flex-wrap: wrap; gap: 30px 50px; font-size: 16px; }
            .radio-option { display: flex; align-items: center; gap: 12px; cursor: pointer; color: #000000; }
            .radio-option input[type="radio"] { width: 20px; height: 20px; accent-color: #F3D955; cursor: pointer; }
            .remarks-box { background: rgba(217, 217, 217, 0.15); border-radius: 15px; padding: 18px 22px; margin-top: 20px; }
            .remarks-box.pending-remarks { border-left: 5px solid #F3D955; }
            .remarks-box.approved-remarks { border-left: 5px solid #52DD75; }
            .remarks-box.rejected-remarks { border-left: 5px solid #DC3545; }
            .remarks-label { display: block; font-weight: 400; color: #000000; }
            .remarks-text { font-size: 20px; font-weight: 400; color: #000000; margin: 6px 0 0 0; }
          `}</style>
        </div>
      </div>
    </>
  );
}

export default ClaimStatusAction;