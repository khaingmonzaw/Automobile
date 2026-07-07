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

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/claims/${id}`);
        const data = await response.json();
        if (response.ok) {
          setClaim(Array.isArray(data) ? data[0] : data);
        } else {
          setError("Claim not found.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Server connection failed.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClaim();
  }, [id]);

  // Status အလိုက် အရောင်ပြောင်းပေးတဲ့ Badge
  const renderStatus = (status) => {
    const statusMap = {
      'Approved': 'bg-success',
      'Rejected': 'bg-danger',
      'Pending': 'bg-warning text-dark'
    };
    const cls = statusMap[status] || 'bg-secondary';
    return <span className={`badge ${cls} px-3 py-2`}>{status.toUpperCase()}</span>;
  };

  if (loading) {
    return <div className="text-center py-5">အချက်အလက်များ ဖော်ပြနေသည်…</div>;
  }

  if (error || !claim) {
    return <div className="text-center py-5 text-danger">{error || "အချက်အလက် မတွေ့ပါ။"}</div>;
  }

  return (
    <div>
      {/* နောက်သို့ပြန်ကြားခလုတ် */}
      <div className="row text-start mt-2">
        <button
          className="btn btn-warning"
          onClick={() => navigate(-1)}
        >
          <FontAwesomeIcon icon={faCircleLeft} />
        </button>
      </div>

      {/* Claim Detail ကတ်ပြား - two-column layout */}
      <div className="row my-3">
        <div className="card col-9 mx-auto bg-white p-5 border rounded-3">
          <h3 className="text-start">Claim Detail (Approved / Admin View)</h3>
          <hr />

          <div className="row">
            {/* ဘယ်ဘက်တန်း – Label များ */}
            <div className="col-6 text-start">
              <p><strong>Claim ID</strong></p>
              <p><strong>Claim Date</strong></p>
              <p><strong>Accident Type</strong></p>
              <p><strong>Accident Date</strong></p>
              <p><strong>Accident Description</strong></p>
              <p><strong>Claimed Amount</strong></p>
              <p><strong>Compensation Amount</strong></p>
              <p><strong>Status</strong></p>
              <p><strong>Message</strong></p>
            </div>

            {/* ညာဘက်တန်း – Value များ */}
            <div className="col-6 text-start">
              <p>{claim.claim_id || claim.id || 'N/A'}</p>
              <p>{claim.created_at ? new Date(claim.created_at).toLocaleDateString() : 'N/A'}</p>
              <p>{claim.accident_type || 'N/A'}</p>
              <p>{claim.accident_date ? new Date(claim.accident_date).toLocaleDateString() : 'N/A'}</p>
              <p>{claim.description || 'N/A'}</p>
              <p>{claim.claimed_amount ? `${claim.claimed_amount} MMK` : 'N/A'}</p>
              <p>
                {claim.status === 'Approved' && claim.compensation_amount
                  ? `${claim.compensation_amount} MMK`
                  : claim.status === 'Rejected' ? '0 MMK' : '—'}
              </p>
              <p>{renderStatus(claim.status)}</p>
              <p>{claim.remark || 'No message'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClaimStatusAction;