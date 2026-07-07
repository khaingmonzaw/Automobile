import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

function ClaimStatusAction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decision, setDecision] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [remarkInput, setRemarkInput] = useState('');

  // Fetch claim data
  useEffect(() => {
    const fetchClaim = async () => {
      try {
        console.log("Fetching claim:", id);

        setLoading(true);

        const response = await fetch(`http://localhost:3000/api/admin/ClaimStatus/${id}`);

        console.log("Response status:", response.status);

        const data = await response.json();

        console.log("Data:", data);

        if (!response.ok) {
          throw new Error(data.message || "Claim not found");
        }

        setClaim(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        console.log("Finished loading");
        setLoading(false);
      }
    };

    if (id) fetchClaim();
  }, [id]);


  // Submit decision (Approve/Reject)
 const handleSubmit = async () => {
  if (!decision) {
    alert("Please select Approve or Reject.");
    return;
  }

  setSubmitting(true);

  try {
    const response = await fetch(
      `http://localhost:3000/api/admin/claims/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: decision,
          remark: remarkInput
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    alert(data.message);

    // return to all claims page
    navigate("/Admin/Claims");

  } catch (error) {
    alert("Error: " + error.message);
  } finally {
    setSubmitting(false);
  }
};
  // Helper Row Component - now displays as a single row in one column
  const Row = ({ label, value, isStatus = false }) => {
    let statusClass = '';
    if (isStatus && claim) {
      if (claim.status === 'PENDINF') statusClass = 'status-pending';
      else if (claim.status === 'APPROVED') statusClass = 'status-approved';
      else if (claim.status === 'REJECTED') statusClass = 'status-rejected';
    }
    return (
      <div className="row-grid">
        <span className="label">{label}</span>
        <span className="colon">:</span>
        <span className={`value ${isStatus ? statusClass : ''}`}>
          {isStatus ? claim.status : value || 'N/A'}
        </span>
      </div>
    );
  };

  // Loading / Error states
  if (loading) {
    return <div className="text-center py-5">Data is Loading...…</div>;
  }
  if (error || !claim) {
    return <div className="text-center py-5 text-danger">{error || "Claim NOT Found"}</div>;
  }

  return (
    <div className="claim-detail-container">
      {/* Back Button */}
      <div className="back-button-wrapper">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faCircleLeft} /> Back
        </button>
      </div>

      {/* Single Card - One Column Layout */}
      <div className="card">
        <h2>Claim Information</h2>
        <hr />

        {/* Left Side - All Claim Information */}
        <div className="table-responsive">
  <table className="table claim-table">
    <tbody>
      <tr>
        <td>Claim ID</td>
        <td>CLM-{claim.claim_id}</td>
      </tr>

      <tr>
        <td>User ID</td>
        <td>{claim.user_id}</td>
      </tr>

      <tr>
        <td>Policy Number</td>
        <td>PLC-{claim.policy_id}</td>
      </tr>

      <tr>
        <td>Accident Type</td>
        <td>{claim.accident_type}</td>
      </tr>

      <tr>
        <td>Accident Date</td>
        <td>{claim.accident_date}</td>
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
        {/* [06/07/2026 13:42] Myoyadanar: Remarks Box – color coded by status */}
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
              ✅ This claim has been Approved
            </p>
          </div>
        )}
        {claim.status === 'REJECTED' && (
          <div className="remarks-box rejected-remarks">
            <span className="remarks-label">Status</span>
            <p className="remarks-text" style={{ color: '#DC3545', fontWeight: 'bold' }}>
              ❌ This claim has been Rejected
            </p>
          </div>
        )}

        {/* Pending: show Decision and Action buttons */}
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
                    className='text-success'
                    onChange={(e) => setDecision(e.target.value)}
                  />
                  APPROVE
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="decision"
                    value="REJECTED"
                    checked={decision === 'Reject'}
                    onChange={(e) => setDecision(e.target.value)}
                    className='text-danger'
                  />
                  REJECT
                </label>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-warning me-2" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Continue' }
              </button>
              <button className="btn btn-danger ms-2" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </>
        )}
      </div>

      {/* CSS - Single Column Design */}
      <style>{`
        .claim-detail-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 40px 20px;
          background: #F2F9FF;
          font-family: 'Roboto', sans-serif;
        }

        /* Back Button */
        .back-button-wrapper {
          width: 100%;
          max-width: 650px;
          margin-bottom: 16px;
          text-align: left;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background-color: #F3D955;
          color: #000000;
          font-size: 18px;
          font-weight: 600;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-back:hover {
          opacity: 0.8;
        }

        /* Single Card - Centered */
        .card {
          background: #FFFFFF;
          border-radius: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          padding: 32px 40px 40px;
          max-width: 650px;
          width: 100%;
        }

        .card h2 {
          font-size: 32px;
          font-weight: 400;
          letter-spacing: 0.03em;
          color: #000000;
          margin: 0 0 8px 0;
        }

        .card hr {
          border: 1px solid #000000;
          margin: 8px 0 30px 0;
          opacity: 0.4;
        }
[06/07/2026 13:42] Myoyadanar: /* Row Grid - Label : Value in one line */
        .row-grid {
          display: grid;
          grid-template-columns: 180px 30px 1fr;
          align-items: baseline;
          margin-bottom: 18px;
          font-size: 24px;
          line-height: 28px;
        }

        .label {
          text-align: left;
          color: #000000;
          font-weight: 400;
        }

        .colon {
          text-align: center;
          color: #000000;
          font-weight: 400;
        }

        .value {
          text-align: right;
          color: #000000;
          font-weight: 400;
          word-break: break-word;
        }

        /* Status Colors */
        .value.status-pending {
          color: #FFC107;
          font-weight: 700;
        }

        .value.status-approved {
          color: #52DD75;
          font-weight: 700;
        }

        .value.status-rejected {
          color: #DC3545;
          font-weight: 700;
        }

        /* Decision Section */
        .decision-section {
          margin-top: 24px;
          margin-bottom: 12px;
        }

        .decision-label {
          display: block;
          font-size: 24px;
          font-weight: 400;
          color: #000000;
          margin-bottom: 12px;
        }

        .decision-options {
          display: flex;
          flex-wrap: wrap;
          gap: 30px 50px;
          font-size: 24px;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          color: #000000;
        }

        .radio-option input[type="radio"] {
          width: 20px;
          height: 20px;
          accent-color: #F3D955;
          cursor: pointer;
        }

        /* Remarks Box */
        .remarks-box {
          background: rgba(217, 217, 217, 0.15);
          border-radius: 15px;
          padding: 18px 22px;
          margin-top: 20px;
        }

        .remarks-box.pending-remarks {
          border-left: 5px solid #F3D955;
        }

        .remarks-box.approved-remarks {
          border-left: 5px solid #52DD75;
        }

        .remarks-box.rejected-remarks {
          border-left: 5px solid #DC3545;
        }

        .remarks-label {
          display: block;
         
          font-weight: 400;
          color: #000000;
        }

        .remarks-text {
          font-size: 20px;
          font-weight: 400;
          color: #000000;
          margin: 6px 0 0 0;
        }



        .action-buttons button:hover:not(:disabled) {
          opacity: 0.85;
          transform: scale(1.02);
        }

        .action-buttons button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

     

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .card {
            padding: 24px 20px;
          }

          .row-grid {
            grid-template-columns: 120px 24px 1fr;
            font-size: 18px;
            line-height: 24px;
            margin-bottom: 14px;
          }

          .card h2 {
            font-size: 26px;
          }

          .decision-options {
            font-size: 20px;
            gap: 20px;
          }
[06/07/2026 13:42] Myoyadanar: .action-buttons button {
            font-size: 20px;
            padding: 12px 24px;
            min-width: 140px;
          }

          .remarks-text {
            font-size: 18px;
          }
        }

        @media (max-width: 480px) {
          .row-grid {
            grid-template-columns: 90px 20px 1fr;
            font-size: 16px;
          }

          .card h2 {
            font-size: 22px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 16px;
          }

          .action-buttons button {
            width: 100%;
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
}

export default ClaimStatusAction;