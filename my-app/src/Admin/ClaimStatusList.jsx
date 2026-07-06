import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ClaimStatusList() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch claims from backend
  useEffect(() => {
    fetch("http://localhost:3000/api/claims") // your backend URL
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch claims");
        }
        return response.json();
      })
      .then((data) => {
        setClaims(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Helper function for badge colors
  const getBadgeClass = (status) => {
    switch (status) {
      case "Approved": return "bg-success";
      case "Rejected": return "bg-danger";
      case "Pending": return "bg-warning text-dark";
      default: return "bg-secondary";
    }
  };

  // Loading state
  if (loading) {
    return <div className="container mt-4">Loading claims...</div>;
  }

  // Error state
  if (error) {
    return <div className="container mt-4 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-4 bg-white p-4 shadow-sm rounded" style={{ fontSize: '0.85rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">Claims List</h4>
        <button 
          className="btn btn-sm fw-bold" 
          style={{ backgroundColor: '#F3D955', color: '#000', border: 'none' }}
          onClick={() => navigate("/Admin/Adduser")}
        >
          + Add User
        </button>
      </div>

      <table className="table table-hover shadow-sm" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#F3D955' }}>
          <tr>
            <th>Claim-ID</th>
            <th>User-ID</th>
            <th>Policy Number</th>
            <th>Accident-Type</th>
            <th>Accident-Date</th>
            <th>Claimed-Amount</th>
            <th>Status</th>
            {/* <th>Risk-Level</th> */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {claims.length > 0 ? (
            claims.map((item, index) => (
              <tr key={index}>
                <td>{item.claim_id}</td>
                <td>{item.user_id}</td>
                <td>{item.policy_id}</td>
                <td>{item.accident_type}</td>
                <td>{item.accident_date}</td>
                <td>${item.claimed_amount}</td>
                <td>
                  <span className={`badge ${getBadgeClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                {/* <td>{item.risk_level}</td> */}
               <td>
  <button 
    className="btn btn-sm btn-outline-secondary" 
    onClick={() => navigate(`/Admin/ClaimStatusAction/${item.claim_id}`)}
  >
    <i className="fa-solid fa-eye"></i>
  </button>
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">No claims available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ClaimStatusList;