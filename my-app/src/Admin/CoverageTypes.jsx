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
      <style>{`
        .custom-pag-btn {
          background: transparent;
          transition: all 0.15s ease-in-out;
        }
        .custom-pag-btn:hover:not(:disabled) {
          background-color: #ffed92 !important;
          color: #000000 !important;
        }

        @media (max-width: 768px) {
          div[style*="width: 230px"] {
            display: none !important;
          }
          div[style*="margin-left: 230px"] {
            margin-left: 0 !important;
            width: 100% !important;
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
        }
      `}</style>

      {/* Table Main Wrapper Card Container */}
      <div className="card bg-white border border-secondary-subtle rounded shadow-sm w-100  p-4">

        {/* Header Block */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 w-100">
          <h2 className="mb-0 fw-bold fs-3 text-dark">Coverage Types</h2>
          <button 
            className="btn btn-warning d-flex align-items-center justify-content-center fw-bold fs-4 text-dark shadow-sm align-self-start align-self-sm-auto" 
            style={{ width: "42px", height: "42px", borderRadius: "8px" }}
            onClick={() => navigate('/Admin/CoverageTypes/NewCoverage')}
            aria-label="Add New Coverage"
          >
            +
          </button>
        </div>

        {/* TABLE WRAPPER - class added for horizontal scrolling on small viewports */}
        <div className="table-responsive w-100">
          <table className="table table-hover align-middle mb-0 text-start w-100">
            <thead>
              <tr>
                <th className="border-bottom-0 text-dark fw-bold py-3" style={{ backgroundColor: "#ffed92", whiteSpace: "nowrap" }}>Coverage ID</th>
                <th className="border-bottom-0 text-dark fw-bold py-3" style={{ backgroundColor: "#ffed92", whiteSpace: "nowrap" }}>Coverage Type</th>
                <th className="border-bottom-0 text-dark fw-bold py-3" style={{ backgroundColor: "#ffed92", whiteSpace: "nowrap" }}>Description</th>
                <th className="border-bottom-0 text-dark fw-bold py-3" style={{ backgroundColor: "#ffed92", whiteSpace: "nowrap" }}>Coverage Limit (MMK)</th>
                <th className="border-bottom-0 text-dark fw-bold py-3 text-center" style={{ backgroundColor: "#ffed92", whiteSpace: "nowrap" }}>Status</th>
                <th className="border-bottom-0 text-dark fw-bold py-3 text-center" style={{ backgroundColor: "#ffed92", whiteSpace: "nowrap" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-secondary border-0" style={{ fontSize: "14px", opacity: 0.7 }}>
                    No data found.
                  </td>
                </tr>
              ) : (
                currentRecords.map((coverage) => (
                  <tr key={coverage.coverage_type_id} className="border-bottom border-light-subtle">
                    <td className="py-3 text-dark fw-semibold" style={{ whiteSpace: "nowrap" }}>{coverage.coverage_type_id}</td>
                    <td className="py-3 text-dark fw-semibold" style={{ whiteSpace: "nowrap" }}>{coverage.coverage_type}</td>
                    <td className="py-3 text-dark fw-semibold" style={{ fontSize: "14px", lineHeight: "1.4", minWidth: "200px" }}>
                      {coverage.description}
                    </td>                    
                    <td className="py-3 text-dark fw-semibold" style={{ whiteSpace: "nowrap" }}>
                      {Number(coverage.coverage_limit).toLocaleString()}
                    </td>
                    <td className="py-3 text-center">
                      {coverage.status === 'active' ? (
                        <span className="badge rounded-pill fw-bold text-info-emphasis bg-success-subtle px-3 py-2" style={{ fontSize: "13px" }}>
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
              )}
            </tbody>
          </table>
        </div>

        {/* Persistent Pagination Component matches styling in Image 2 */}
        <div className="d-flex justify-content-center align-items-center my-4 pt-3 gap-2 border-top border-light-subtle">
          <button 
            className="btn btn-outline-warning fw-semibold custom-pag-btn px-3"
            style={{ borderRadius: "6px" }}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>

          <span className="text-secondary fw-medium px-2" style={{ fontSize: "14px" }}>
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            className="btn btn-outline-warning fw-semibold custom-pag-btn px-3"
            style={{ borderRadius: "6px" }}
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

export default CoverageTypes;