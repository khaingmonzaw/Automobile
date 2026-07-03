import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CoverageTypes = () => {
  const navigate = useNavigate();
  const [coverageData, setCoverageData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const fetchCoverages = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/coverages');
        if (response.ok) {
          const data = await response.json();
          setCoverageData(data);
        } else {
          console.error('Server error while reading fields');
        }
      } catch (error) {
        console.error('Network Error:', error);
      }
    };

    fetchCoverages();
  }, []);
  
  const totalPages = Math.ceil(coverageData.length / recordsPerPage) || 1;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = coverageData.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="container-fluid px-2 px-md-4 py-3 text-start">
      {/* Dynamic Style overrides to force parent container responsiveness on mobile layout screens */}
      <style>{`
        .custom-pag-btn {
          background: transparent;
          transition: all 0.15s ease-in-out;
        }
        .custom-pag-btn:hover {
          background-color: #40a9ff !important;
          color: #ffffff !important;
        }

        /* Standard Bootstrap MD Breakpoint (768px and below) */
        @media (max-width: 768px) {
          /* Finds the outer fixed sidebar layout container and hides it on mobile viewports */
          div[style*="width: 230px"] {
            display: none !important;
          }
          
          /* Finds the outer main screen layout block and removes the forced 230px desktop left-margin */
          div[style*="margin-left: 230px"] {
            margin-left: 0 !important;
            width: 100% !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
        }
      `}</style>

      {/* Top Header Row - Fully responsive stacking using standard Bootstrap utilities */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 w-100">
        <h2 className="mb-0 fw-bold fs-3 text-dark">Coverage Types</h2>
        <button 
          className="btn btn-warning d-flex align-items-center justify-content-center fw-bold fs-4 text-dark shadow-sm pb-1 align-self-start align-self-sm-auto" 
          style={{ width: "42px", height: "42px", borderRadius: "8px" }}
          onClick={() => navigate('/Admin/CoverageTypes/NewCoverage')}
          aria-label="Add New Coverage"
        >
          +
        </button>
      </div>

      {/* Table Main Wrapper Card Container */}
      <div className="card bg-white border border-secondary-subtle rounded-4 shadow-sm w-100 overflow-hidden">
        {/* Bootstrap table-responsive class guarantees scrollability without compressing grid layout items */}
        <div className="table-responsive p-1 p-md-3">
          <table className="table table-hover align-middle mb-0 text-start" style={{ minWidth: "850px" }}>
            <thead>
              <tr>
                <th className="border-bottom-0 text-dark fw-bold px-3 py-3" style={{ fontSize: "14px", backgroundColor: "#ffed92", width: "10%" }}>Coverage ID</th>
                <th className="border-bottom-0 text-dark fw-bold px-3 py-3" style={{ fontSize: "14px", backgroundColor: "#ffed92", width: "20%" }}>Coverage Type</th>
                <th className="border-bottom-0 text-dark fw-bold px-3 py-3" style={{ fontSize: "14px", backgroundColor: "#ffed92", width: "30%" }}>Description</th>
                <th className="border-bottom-0 text-dark fw-bold px-3 py-3" style={{ fontSize: "14px", backgroundColor: "#ffed92", width: "15%" }}>Base Rate (MMK)</th>
                <th className="border-bottom-0 text-dark fw-bold px-3 py-3" style={{ fontSize: "14px", backgroundColor: "#ffed92", width: "15%" }}>Coverage Limit (MMK)</th>
                <th className="border-bottom-0 text-dark fw-bold px-3 py-3 text-center" style={{ fontSize: "14px", backgroundColor: "#ffed92", width: "10%" }}>Status</th>
                <th className="border-bottom-0 text-dark fw-bold px-3 py-3 text-center" style={{ fontSize: "14px", backgroundColor: "#ffed92", width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                currentRecords.map((coverage) => (
                  <tr key={coverage.coverage_type_id} className="border-bottom border-light-subtle">
                    <td className="px-3 py-3 text-dark fw-semibold" style={{ fontSize: "14px" }}>{coverage.coverage_type_id}</td>
                    <td className="px-3 py-3 text-dark fw-semibold" style={{ fontSize: "14px" }}>{coverage.coverage_type}</td>
                    <td className="px-3 py-3 text-dark fw-semibold" style={{ fontSize: "14px", lineHeight: "1.4", wordBreak: "break-word" }}>
                      {coverage.description}
                    </td>
                    <td className="px-3 py-3 text-dark fw-semibold" style={{ fontSize: "14px" }}>
                      {Number(coverage.base_rate).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-dark fw-semibold" style={{ fontSize: "14px" }}>
                      {Number(coverage.coverage_limit).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {coverage.status === 'Active' ? (
                        <span className="badge rounded-pill fw-bold text-info-emphasis bg-info-subtle px-3 py-2" style={{ fontSize: "13px" }}>
                          Active
                        </span>
                      ) : (
                        <span className="badge rounded-pill fw-bold text-warning-emphasis bg-warning-subtle px-3 py-2" style={{ fontSize: "13px" }}>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button 
                        className="btn btn-link text-dark p-2 rounded-2 border-0 d-inline-flex align-items-center justify-content-center"
                        style={{ background: "none" }}
                        onClick={() => navigate(`/Admin/CoverageTypes/CoverageUpdate/${coverage.coverage_type_id}`)}
                        aria-label={`Edit ${coverage.coverage_type} coverage`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* Responsive Wrap-Friendly Bootstrap Pagination Layout Footer Container */}
        <div className="d-flex flex-wrap justify-content-center align-items-center gap-1 py-4 px-2 bg-white border-top border-light-subtle">
          <button 
            className="btn custom-pag-btn text-secondary border-0 p-0 d-flex align-items-center justify-content-center" 
            style={{ fontSize: "13px", width: "28px", height: "28px", borderRadius: "6px" }}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </button>
          <button 
            className="btn custom-pag-btn text-secondary border-0 p-0 d-flex align-items-center justify-content-center me-1" 
            style={{ fontSize: "13px", width: "28px", height: "28px", borderRadius: "6px" }}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          
          <div className="d-flex flex-wrap gap-1 align-items-center">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNum = index + 1;
              const isActive = currentPage === pageNum;
              return (
                <button 
                  key={pageNum}
                  className={isActive ? "btn btn-sm text-white fw-bold rounded d-flex align-items-center justify-content-center mx-0" : "btn custom-pag-btn text-secondary border-0 p-0 d-flex align-items-center justify-content-center mx-0"} 
                  style={{ 
                    fontSize: "13px", 
                    width: "28px", 
                    height: "28px", 
                    borderRadius: isActive ? "4px" : "6px",
                    backgroundColor: isActive ? "#40a9ff" : "transparent",
                    border: "none"
                  }}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button 
            className="btn custom-pag-btn text-secondary border-0 p-0 d-flex align-items-center justify-content-center ms-1" 
            style={{ fontSize: "13px", width: "28px", height: "28px", borderRadius: "6px" }}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
          <button 
            className="btn custom-pag-btn text-secondary border-0 p-0 d-flex align-items-center justify-content-center" 
            style={{ fontSize: "13px", width: "28px", height: "28px", borderRadius: "6px" }}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverageTypes;