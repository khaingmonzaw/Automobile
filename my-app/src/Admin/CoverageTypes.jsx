import React from 'react';
import { useNavigate } from 'react-router-dom';

const CoverageTypes = () => {
  const navigate = useNavigate();
  const coverageData = [
    { id: 1, type: 'Liability', description: 'Damage or injury to other people or their property', baseRate: '95,000', limit: '960,000', status: 'Active' },
    { id: 2, type: 'Collision', description: 'Own vehicle damage caused by a collision', baseRate: '87,000', limit: '890,000', status: 'Active' },
    { id: 3, type: 'Breakdown', description: 'Covers certain mechanical failures', baseRate: '65,000', limit: '680,000', status: 'Inactive' },
    { id: 4, type: 'Comprehensive', description: 'Damage from non-collision events', baseRate: '100,000', limit: '1,000,000', status: 'Active' },
  ];

  return (
    <div className="container-fluid py-3 text-start">
      {/* Inline style block to handle the exact active-blue hover state cleanly */}
      <style>{`
        .custom-pag-btn {
          background: transparent;
          transition: all 0.15s ease-in-out;
        }
        .custom-pag-btn:hover {
          background-color: #40a9ff !important;
          color: #ffffff !important;
        }
      `}</style>


      {/* Top Header Row */}
      <div className='row'>
      <div className="d-flex justify-content-between align-items-center mb-4 mx-auto w-100" >
        <h2 className="mb-0 fw-bold fs-3 text-dark">Coverage Types</h2>
        <button 
          className="btn btn-warning d-flex align-items-center justify-content-center fw-bold fs-4 text-dark shadow-sm" 
          style={{ width: "42px", height: "36px", borderRadius: "8px" }}
          onClick={() => navigate('/Admin/CoverageTypes/NewCoverage')}
          aria-label="Add New Coverage"
        >
          +
        </button>
      </div>

      {/* Table Main Wrapper Card Container */}
      
      <div 
        className="card bg-white border border-secondary-subtle rounded-4 shadow-sm mx-auto w-100 overflow-hidden" 
        
      >
        <div className="table-responsive m-4 ">
          <table className="table  align-middle mb-0 text-start">
            <thead>
              <tr>
                <th className="border-bottom-0 text-dark fw-bold px-4 py-3" style={{ fontSize: "14px", backgroundColor: "#ffed92" }}>Coverage _ID</th>
                <th className="border-bottom-0 text-dark fw-bold px-4 py-3" style={{ fontSize: "14px", backgroundColor: "#ffed92" }}>Coverage type</th>
                <th className="border-bottom-0 text-dark fw-bold px-4 py-3" style={{ fontSize: "14px", backgroundColor: "#ffed92" }}>Description</th>
                <th className="border-bottom-0 text-dark fw-bold px-4 py-3" style={{ fontSize: "14px", backgroundColor: "#ffed92" }}>Base Rate (MMK)</th>
                <th className="border-bottom-0 text-dark fw-bold px-4 py-3" style={{ fontSize: "14px", backgroundColor: "#ffed92" }}>Coverage Limit (MMK)</th>
                <th className="border-bottom-0 text-dark fw-bold px-4 py-3 text-center" style={{ fontSize: "14px", backgroundColor: "#ffed92" }}>Status</th>
                <th className="border-bottom-0 text-dark fw-bold px-4 py-3 text-center" style={{ fontSize: "14px", backgroundColor: "#ffed92" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {coverageData.map((coverage) => (
                <tr key={coverage.id} className="border-bottom border-light-subtle">
                  <td className="px-4 py-4 text-dark fw-semibold" style={{ fontSize: "14px" }}>{coverage.id}</td>
                  <td className="px-4 py-4 text-dark fw-semibold" style={{ fontSize: "14px" }}>{coverage.type}</td>
                  <td className="px-4 py-4 text-dark fw-semibold" style={{ fontSize: "14px", maxWidth: "280px", lineHeight: "1.4" }}>
                    {coverage.description}
                  </td>
                  <td className="px-4 py-4 text-dark fw-semibold" style={{ fontSize: "14px" }}>{coverage.baseRate}</td>
                  <td className="px-4 py-4 text-dark fw-semibold" style={{ fontSize: "14px" }}>{coverage.limit}</td>
                  <td className="px-4 py-4 text-center">
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
                  <td className="px-4 py-4 text-center">
                    <button 
                      className="btn btn-link text-secondary p-2 rounded-2 border-0 d-inline-flex align-items-center justify-content-center"
                      style={{ background: "none" }}
                      onClick={() => navigate('/Admin/CoverageTypes/CoverageUpdate/${coverage.id}')}
                      aria-label={`Edit ${coverage.type} coverage`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Updated Pagination Footer Section */}
        <div className="d-flex justify-content-center align-items-center gap-1 py-4 bg-white">
          <button 
            className="btn custom-pag-btn text-secondary border-0 p-0 d-flex align-items-center justify-content-center" 
            style={{ fontSize: "13px", width: "28px", height: "28px", borderRadius: "6px" }}
          >
            &lt;&lt;
          </button>
          <button 
            className="btn custom-pag-btn text-secondary border-0 p-0 d-flex align-items-center justify-content-center me-2" 
            style={{ fontSize: "13px", width: "28px", height: "28px", borderRadius: "6px" }}
          >
            &lt;
          </button>
          
          {/* Active Highlight Button */}
          <button 
            className="btn btn-sm text-white fw-bold rounded d-flex align-items-center justify-content-center mx-1" 
            style={{ fontSize: "13px", border: "none", width: "28px", height: "28px", backgroundColor: "#40a9ff" }}
          >
            1
          </button>
          
          {/* Clean Interactive Number Elements with blue hover variables */}
          <button 
            className="btn custom-pag-btn text-secondary border-0 p-0 d-flex align-items-center justify-content-center" 
            style={{ fontSize: "13px", width: "28px", height: "28px", borderRadius: "6px" }}
          >
            2
          </button>
          <button 
            className="btn custom-pag-btn text-secondary border-0 p-0 d-flex align-items-center justify-content-center mx-1" 
            style={{ fontSize: "13px", width: "28px", height: "28px", borderRadius: "6px" }}
          >
            3
          </button>
          
          <button 
            className="btn custom-pag-btn text-secondary border-0 p-0 d-flex align-items-center justify-content-center ms-2" 
            style={{ fontSize: "13px", width: "28px", height: "28px", borderRadius: "6px" }}
          >
            &gt;
          </button>
          <button 
            className="btn custom-pag-btn text-secondary border-0 p-0 d-flex align-items-center justify-content-center" 
            style={{ fontSize: "13px", width: "28px", height: "28px", borderRadius: "6px" }}
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CoverageTypes;