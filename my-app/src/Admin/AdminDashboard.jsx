import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
 
const AdminDashboard = () => {
  // State Variables သတ်မှတ်ခြင်း
  const [claimsData, setClaimsData] = useState([]);
  
  // ✨ Backend API မှလာမည့် Risk Level ဒေတာအတွက် State 
  const [riskStats, setRiskStats] = useState({ low: 0, medium: 0, high: 0 });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  // Backend API များမှ ဒေတာဆွဲထုတ်ခြင်း
  useEffect(() => {
    let isMounted = true; // Memory Leak ကာကွယ်ရန်
 
    const fetchDashboardData = async () => {
      try {
        // API နှစ်ခုလုံးကို ပြိုင်တူ လှမ်းခေါ်ခြင်း
        const [claimsRes, riskRes] = await Promise.all([
          fetch('http://localhost:3000/api/admin/claims'),
          fetch('http://localhost:3000/api/admin/risk-stats') 
        ]);
 
        if (!claimsRes.ok  && !riskRes.ok) {
          throw new Error('Data Fetching Error.');
        }
 
        const claims = await claimsRes.json();
        const risk = await riskRes.json();
 
        if (isMounted) {
          setClaimsData(Array.isArray(claims) ? claims : []);
          
          // Backend ကလာတဲ့ Risk Object ကို ထည့်သွင်းခြင်း (မတော်တဆ null ဖြစ်ခဲ့ရင် error မတက်အောင်ပါ ကာကွယ်ထားသည်)
          setRiskStats(risk ? {
            low: risk.low ?? 0,
            medium: risk.medium ?? 0,
            high: risk.high ?? 0
          } : { low: 0, medium: 0, high: 0 });
 
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
 
    fetchDashboardData();
 
    return () => {
      isMounted = false;
    };
  }, []);
 
  // ကောင်တာများကို Dynamic တွက်ချက်ခြင်း
  const totalClaims = claimsData.length;
  const pendingClaims = claimsData.filter(c => c?.status?.toUpperCase() === 'PENDING').length;
  const approvedClaims = claimsData.filter(c => c?.status?.toUpperCase() === 'APPROVED').length;
  const rejectedClaims = claimsData.filter(c => c?.status?.toUpperCase() === 'REJECTED').length;
 
  // Status အလိုက် Badge အရောင်ပြောင်းရန် Function
  const getBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': 
        return 'bg-success-subtle text-success border-success-subtle';
      case 'PENDING': 
        return 'bg-warning-subtle text-warning-emphasis border-warning-subtle';
      case 'REJECTED': 
        return 'bg-danger-subtle text-danger border-danger-subtle';
      default: 
        return 'bg-secondary-subtle text-secondary';
    }
  };
 
  // Loading UI
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
 
  // Error UI
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }
 
  return (
    <div className="container-fluid min-vh-100 p-0 bg-light d-flex">
      <div className="flex-grow-1 p-4">
        
        {/* Metrics/Counter Grid Section */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 rounded-4 p-3 text-center bg-white shadow-sm">
              <span className="fw-semibold mb-1 small text-uppercase tracking-wider text-muted">Total</span>
              <h2 className="fw-bold m-0" style={{ color: "#d63384", fontSize: "2.2rem" }}>{totalClaims}</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 rounded-4 p-3 text-center bg-white shadow-sm">
              <span className="text-warning fw-semibold mb-1 small text-uppercase tracking-wider">Pending</span>
              <h2 className="fw-bold text-dark m-0" style={{ fontSize: "2.2rem" }}>{pendingClaims}</h2>
 
</div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 rounded-4 p-3 text-center bg-white shadow-sm">
              <span className="text-success fw-semibold mb-1 small text-uppercase tracking-wider">Approved</span>
              <h2 className="fw-bold text-dark m-0" style={{ fontSize: "2.2rem" }}>{approvedClaims}</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 rounded-4 p-3 text-center bg-white shadow-sm">
              <span className="text-danger fw-semibold mb-1 small text-uppercase tracking-wider">Rejected</span>
              <h2 className="fw-bold text-dark m-0" style={{ fontSize: "2.2rem" }}>{rejectedClaims}</h2>
            </div>
          </div>
        </div>
 
        {/* Bottom Layout Grid */}
        <div className="row g-4">
          
          {/* Left Block: Recent Claims Table */}
          <div className="col-lg-9">
            <div className="card bg-white border-0 rounded-4 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fs-5 fw-bold text-dark mb-0">Recent Claims</h3>
                <Link to="/Admin/AllClaims">
                  <button className="btn btn-warning  border-0 fw-semibold px-3 text-dark rounded me-3 shadow-sm">
                     All Claims
                  </button>
                </Link>
              </div>
 
              <div className="table-responsive rounded-3 overflow-hidden">
                <table className="table table-hover align-middle mb-0">
                  <thead style={{ backgroundColor: "rgb(255, 237, 146)" }} className="text-warning-emphasis border-bottom">
                    <tr className="text-dark small uppercase fw-bold align-middle">
                      <th className="py-3 px-3" style={{ width: "20%", backgroundColor: "inherit" }}>Claim ID</th>
                      <th className="py-3" style={{ width: "30%", backgroundColor: "inherit" }}>Accident Date</th>
                      <th className="py-3 text-center" style={{ width: "25%", backgroundColor: "inherit" }}>Status</th>
                      <th className="py-3 text-end px-3" style={{ width: "25%", backgroundColor: "inherit" }}>Amount (MMK)</th>
                    </tr>
                  </thead>
                <tbody>
  {claimsData.length === 0 ? (
    <tr>
      <td colSpan="4" className="text-center py-4 text-muted">
        No claims found.
      </td>
    </tr>
  ) : (
    claimsData.slice(0, 5).map((claim, index) => (
      <tr key={claim.claim_id || index}>
        <td className="py-3 px-3 fw-semibold text-primary">
          {`CLM${String(claim.claim_id).padStart(4, "0")}`}
        </td>

        <td className="py-3 text-secondary small">
          {claim.accident_date
            ? new Date(claim.accident_date).toLocaleDateString("en-GB")
            : "-"}
        </td>

        <td className="py-3 text-center">
          <span
            className={`badge ${getBadgeClass(
              claim.status
            )} px-3 py-2 border rounded-pill fw-semibold`}
            style={{ minWidth: "100px", fontSize: "0.8rem" }}
          >
            {claim.status}
          </span>
        </td>

        <td className="py-3 text-end px-3 fw-bold text-dark">
          {(claim.claimed_amount || 0)}
        </td>
      </tr>
    ))
  )}
</tbody>
                </table>
              </div>
            </div>
          </div>
 
{/* Right Block: Risk Level Sidebar Card */}
          <div className="col-lg-3">
            <div className="card bg-white border-0 rounded-4 shadow-sm p-4 text-start h-100">
              <h3 className="fs-5 fw-bold text-dark mb-4">Risk Level</h3>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                  <span className="text-success fw-semibold small">Low Risk</span>
                  {/*  Backend API ရဲ့ တွက်ချက်မှုအတိုင်း ကိန်းဂဏန်းများ တိုက်ရိုက်ပြပါမည် */}
                  <span className="fw-bold text-dark fs-5">{riskStats.low}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                  <span className="text-warning fw-semibold small">Medium Risk</span>
                  <span className="fw-bold text-dark fs-5">{riskStats.medium}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                  <span className="text-danger fw-semibold small">High Risk</span>
                  <span className="fw-bold text-dark fs-5">{riskStats.high}</span>
                </div>
              </div>
            </div>
          </div>
 
        </div>
 
      </div>
    </div>
  );
};
 
export default AdminDashboard;
 