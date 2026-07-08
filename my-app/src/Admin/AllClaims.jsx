import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

const AllClaims = () => {
  // State Variables သတ်မှတ်ခြင်း
  const [claimsData, setClaimsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // တစ်မျက်နှာလျှင် ပြသမည့် အရေအတွက် (၅ ခု ပြောင်းထားပါသည်)

  // Backend API မှ ဒေတာဆွဲထုတ်ခြင်း
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/admin/claims');
        if (!response.ok) {
          throw new Error('ဒေတာဆွဲထုတ်ရာတွင် အမှားအယွင်းရှိနေပါသည်။');
        }
        const data = await response.json();
        setClaimsData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Status အလိုက် Badge အရောင်ပြောင်းရန် Function
  const getBadgeConfig = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED': 
        return { badge: 'bg-success-subtle text-success border-success-subtle', risk: 'Low', riskClass: 'text-success' };
      case 'PENDING': 
        return { badge: 'bg-warning-subtle text-warning-emphasis border-warning-subtle', risk: 'Medium', riskClass: 'text-info' };
      case 'REJECTED': 
        return { badge: 'bg-danger-subtle text-danger border-danger-subtle', risk: 'High', riskClass: 'text-danger' };
      default: 
        return { badge: 'bg-secondary-subtle text-secondary', risk: 'Unknown', riskClass: 'text-muted' };
    }
  };

  // Status Filter စစ်ထုတ်ခြင်း logic
  const filteredClaims = claimsData.filter(claim => {
    return statusFilter === "All" || claim.status?.toUpperCase() === statusFilter.toUpperCase();
  });

  // Filter ပြောင်းလျှင် ပထမစာမျက်နှာသို့ ပြန်ပို့ရန်
  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Pagination တွက်ချက်မှုများ
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClaims.slice(indexOfFirstItem, indexOfLastItem);

  // Loading ပြသမည့် UI
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error ပြသမည့် UI
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="alert alert-danger" role="alert">{error}</div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4 bg-light">
      
   

      {/* Main Content Card Container */}
      <div className="card bg-white border-0 rounded-4 shadow-sm p-4">
           {/* Top Title & Header Row */}
     
        {/* Controls Section: Filter */}
        <div className="d-flex g-3 mb-4 justify-content-between px-4 pt-3">


           <div className="mb-4">
        <h2 className="fs-2 fw-bold text-dark ">All Claims</h2>
      </div>
          <div className="col-md-3">
            <div className="d-flex align-items-center rounded-pill border px-3 py-1 bg-white shadow-sm" style={{ backgroundColor: "rgba(var(--bs-warning-rgb), var(--bs-bg-opacity)) !important" }}>
              <FontAwesomeIcon icon={faFilter} className="text-warning-emphasis opacity-75 me-2" />
              <select 
                className="form-select bg-transparent border-0  small fw-semibold text-warning-emphasis" 
                value={statusFilter}
                onChange={handleFilterChange}
                style={{ boxShadow: "none", cursor: "pointer" }}
              >
                <option value="All" className="text-dark bg-white">All</option>
                <option value="APPROVED" className="text-dark bg-white">APPROVED</option>
                <option value="PENDING" className="text-dark bg-white">PENDING</option>
                <option value="REJECTED" className="text-dark bg-white">REJECTED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className=" rounded-3 ">
          <table className="table table-hover align-middle mb-0 w-100 "  style={{ tableLayout: "fixed" }}>
            <thead style={{ backgroundColor: "rgb(255, 237, 146)" }} className="text-warning-emphasis border-bottom">
              <tr className="text-dark  uppercase fw-bold align-middle  ">
                <th className="py-3" style={{ backgroundColor: "inherit" }}>Claim ID</th>
                <th className="py-3" style={{  backgroundColor: "inherit" }}>Claimed Amount</th>
                <th className="py-3" style={{backgroundColor: "inherit" }}>Accident Date</th>
                <th className="py-3 text-center" style={{ backgroundColor: "inherit" }}>Status</th>
                <th className="py-3 text-center" style={{ backgroundColor: "inherit" }}>Risk Level</th>
                <th className="py-3 text-center" style={{ backgroundColor: "inherit" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((claim, index) => {
                  const config = getBadgeConfig(claim.status);
                  return (
                    <tr key={claim.id || index} className="border-bottom">
                      <td className="py-3 px-3 fw-bold text-primary small">CLM{String(claim.id).padStart(4, '0')}</td>
                      <td className="py-3 text-dark small fw-bold">
                        {claim.amount ? `${Number(claim.amount).toLocaleString()} MMK` : '0 MMK'}
                      </td>
                      <td className="py-3 text-secondary small">
                        {claim.date ? new Date(claim.date).toLocaleDateString('en-GB') : '-'}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`badge ${config.badge} border rounded-pill fw-semibold`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`fw-bold small ${config.riskClass}`}>{config.risk}</span>
                      </td>
                   <td className="py-3 text-center">
  <Link to={`/Admin/AllClaims/ClaimStatusAction/${claim.id}`}>
    <button className="btn btn-warning border text-dark">
      <FontAwesomeIcon icon={faEye} />
    </button>
  </Link>
</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted small">No data found matching your selection.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Buttons */}
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-outline-warning me-2 fw-semibold px-3 "
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>

          <span className="px-3 py-1 small fw-semibold align-self-center text-secondary">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="btn btn-outline-warning ms-2 fw-semibold px-3 "
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllClaims;