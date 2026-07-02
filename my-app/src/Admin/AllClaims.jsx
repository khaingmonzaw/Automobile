import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter, faEye } from "@fortawesome/free-solid-svg-icons";

const AllClaims = () => {
  // Mock Data (Pagination စမ်းသပ်ရန် တူညီသော Data အချို့ ထပ်တိုးထားပါသည်)
  const initialClaimsData = [
    { id: "CLM0001", name: "Htet Yati Zar Ni", date: "05-12-2026", status: "Approved", risk: "Medium", badgeClass: "bg-success-subtle text-success border-success-subtle", riskClass: "text-info" },
    { id: "CLM0002", name: "Htet Yati Zar Ni", date: "05-12-2025", status: "Approved", risk: "Medium", badgeClass: "bg-success-subtle text-success border-success-subtle", riskClass: "text-info" },
    { id: "CLM0003", name: "Htet Yati Zar Ni", date: "05-13-2026", status: "Pending", risk: "Low", badgeClass: "bg-warning-subtle text-warning-emphasis border-warning-subtle", riskClass: "text-success" },
    { id: "CLM0004", name: "Htet Yati Zar Ni", date: "07-12-2025", status: "Rejected", risk: "High", badgeClass: "bg-danger-subtle text-danger border-danger-subtle", riskClass: "text-danger" },
    { id: "CLM0005", name: "Htet Yati Zar Ni", date: "05-10-2026", status: "Approved", risk: "High", badgeClass: "bg-success-subtle text-success border-success-subtle", riskClass: "text-danger" },
    { id: "CLM0006", name: "Htet Yati Zar Ni", date: "05-02-2026", status: "Pending", risk: "Low", badgeClass: "bg-warning-subtle text-warning-emphasis border-warning-subtle", riskClass: "text-success" },
    { id: "CLM0007", name: "Htet Yati Zar Ni", date: "05-06-2026", status: "Rejected", risk: "High", badgeClass: "bg-danger-subtle text-danger border-danger-subtle", riskClass: "text-danger" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // 💡 Pagination အတွက် State များ
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // တစ်မျက်နှာလျှင် ပြသမည့် အရေအတွက်

  // ၁။ Search နှင့် Filter အရင်လုပ်ဆောင်ခြင်း
  const filteredClaims = initialClaimsData.filter(claim => {
    const matchesSearch = claim.name.toLowerCase().includes(searchTerm.toLowerCase()) || claim.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ဇယားထဲမှာ အပြောင်းအလဲလုပ်ရင် ပထမစာမျက်နှာကို ပြန်ပို့ရန်
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // ဇ။ Pagination အတွက် တွက်ချက်မှုများ
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // လက်ရှိ စာမျက်နှာအတွက်ပဲ Data များကို ဖြတ်ထုတ်ခြင်း
  const currentItems = filteredClaims.slice(indexOfFirstItem, indexOfLastItem);

  // စာမျက်နှာ နံပါတ်စဉ် Array ထုတ်ရန် (ဥပမာ - [1, 2, 3])
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container-fluid min-vh-100 p-4 bg-light">
      
      {/* Top Title & Header Row */}
      <div className="mb-4">
        <h2 className="fs-4 fw-bold text-dark mb-1">All Claims</h2>
        <p className="text-muted small mb-0">Manage and monitor all submitted automobile claims.</p>
      </div>

      {/* Main Content Card Container */}
      <div className="card bg-white border-0 rounded-4 shadow-sm p-4">
        
        {/* Controls Section: Search and Filter */}
        <div className="row g-3 mb-4 align-items-center">
          <div className="col-md-5">
            <div className="input-group bg-light rounded-pill border px-3 py-1 align-items-center">
              <FontAwesomeIcon icon={faSearch} className="text-secondary opacity-50 me-2" />
              <input 
                type="text" 
                className="form-control bg-transparent border-0 p-1 small" 
                placeholder="Search by Claim ID or Name..." 
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ boxShadow: "none" }}
              />
            </div>
          </div>
          
          <div className="col-md-3 ms-auto">
            <div className="d-flex align-items-center bg-light rounded-pill border px-3 py-1">
              <FontAwesomeIcon icon={faFilter} className="text-secondary opacity-50 me-2" />
              <select 
                className="form-select bg-transparent border-0 p-1 small" 
                value={statusFilter}
                onChange={handleFilterChange}
                style={{ boxShadow: "none", cursor: "pointer" }}
              >
                <option value="All">Filter Status: All</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr className="text-muted small uppercase fw-bold border-bottom">
                <th className="py-3 px-3" style={{ width: "15%" }}>Claim ID</th>
                <th className="py-3" style={{ width: "25%" }}>Claimed Name</th>
                <th className="py-3" style={{ width: "18%" }}>Accident Date</th>
                <th className="py-3 text-center" style={{ width: "14%" }}>Status</th>
                <th className="py-3 text-center" style={{ width: "14%" }}>Risk Level</th>
                <th className="py-3 text-center" style={{ width: "14%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((claim, index) => (
                  <tr key={index} className="border-bottom-0">
                    <td className="py-3 px-3 fw-bold text-dark small">{claim.id}</td>
                    <td className="py-3 text-dark small fw-semibold">{claim.name}</td>
                    <td className="py-3 text-secondary small">{claim.date}</td>
                    <td className="py-3 text-center">
                      <span className={`badge ${claim.badgeClass} px-3 py-2 border rounded-pill fw-semibold`} style={{ minWidth: "95px", fontSize: "0.8rem" }}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`fw-bold small ${claim.riskClass}`}>{claim.risk}</span>
                    </td>
                    <td className="py-3 text-center">
                      <button className="btn btn-sm btn-light border rounded-circle text-secondary p-2" style={{ width: "35px", height: "35px" }}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted small">No data found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 💡 အလုပ်လုပ်သော Pagination အပိုင်း */}
        {filteredClaims.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
            <span className="text-muted small">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredClaims.length)} of {filteredClaims.length} entries
            </span>
            <nav>
              <ul className="pagination pagination-sm m-0">
                {/* ‹ မြှားခလုတ် (Previous) */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link rounded-start-pill px-3" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                </li>

                {/* စာမျက်နှာနံပါတ်များ (1, 2, 3) */}
                {pageNumbers.map(number => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button 
                      className={`page-link px-3 ${currentPage === number ? 'bg-warning text-dark border-warning fw-bold' : 'text-secondary'}`}
                      onClick={() => setCurrentPage(number)}
                    >
                      {number}
                    </button>
                  </li>
                ))}

                {/* › မြှားခလုတ် (Next) */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link rounded-end-pill px-3" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}

      </div>
    </div>
  );
};

export default AllClaims;