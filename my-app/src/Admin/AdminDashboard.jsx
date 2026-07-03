import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // Mock Data for Recent Claims Table
  const claimsData = [
    { id: "CLM0001", date: "05-12-2026", status: "Approved", amount: "250,000", badgeClass: "bg-success-subtle text-success border-success-subtle" },
    { id: "CLM0002", date: "05-12-2025", status: "Pending", amount: "300,000", badgeClass: "bg-warning-subtle text-warning-emphasis border-warning-subtle" },
    { id: "CLM0003", date: "05-13-2026", status: "Rejected", amount: "350,000", badgeClass: "bg-danger-subtle text-danger border-danger-subtle" },
    { id: "CLM0004", date: "07-12-2025", status: "Approved", amount: "450,000", badgeClass: "bg-success-subtle text-success border-success-subtle" },
    { id: "CLM0005", date: "05-10-2026", status: "Rejected", amount: "550,000", badgeClass: "bg-danger-subtle text-danger border-danger-subtle" },
    { id: "CLM0006", date: "05-02-2026", status: "Pending", amount: "150,000", badgeClass: "bg-warning-subtle text-warning-emphasis border-warning-subtle" },
    { id: "CLM0007", date: "05-06-2026", status: "Rejected", amount: "220,000", badgeClass: "bg-danger-subtle text-danger border-danger-subtle" },
  ];

  return (
    <div className="container-fluid min-vh-100 p-0 bg-light d-flex">
      
      {/* Main Content Area */}
      <div className="flex-grow-1 p-4">
        
        {/* 3. Metrics/Counter Grid Section */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card border-0 rounded-4 p-3 text-center bg-white shadow-sm">
              <span className="fw-semibold mb-1 small text-uppercase tracking-wider text-muted">Total Claims</span>
              <h2 className="fw-bold m-0" style={{ color: "#d63384", fontSize: "2.2rem" }}>7</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 rounded-4 p-3 text-center bg-white shadow-sm">
              <span className="text-warning fw-semibold mb-1 small text-uppercase tracking-wider">Pending</span>
              <h2 className="fw-bold text-dark m-0" style={{ fontSize: "2.2rem" }}>5</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 rounded-4 p-3 text-center bg-white shadow-sm">
              <span className="text-success fw-semibold mb-1 small text-uppercase tracking-wider">Approved</span>
              <h2 className="fw-bold text-dark m-0" style={{ fontSize: "2.2rem" }}>2</h2>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 rounded-4 p-3 text-center bg-white shadow-sm">
              <span className="text-danger fw-semibold mb-1 small text-uppercase tracking-wider">Rejected</span>
              <h2 className="fw-bold text-dark m-0" style={{ fontSize: "2.2rem" }}>0</h2>
            </div>
          </div>
        </div>

        {/* 4. Bottom Main Data Layout Grid */}
        <div className="row g-4">
          
          {/* Left Block: Recent Claims Table */}
          <div className="col-lg-9">
            <div className="card bg-white border-0 rounded-4 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fs-5 fw-bold text-dark mb-0">Recent Claims</h3>
                <Link to="/Admin/AllClaims">
                <button className="btn btn-light btn-sm border-0 fw-semibold px-3 text-primary rounded-pill bg-primary-subtle"> View All</button></Link>
              </div>

              {/* ပြင်ဆင်ထားသော Data Table */}
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr className="text-muted small uppercase fw-bold border-bottom">
                      <th className="py-3 px-3" style={{ width: "20%" }}>Claim ID</th>
                      <th className="py-3" style={{ width: "30%" }}>Accident Date</th>
                      <th className="py-3 text-center" style={{ width: "25%" }}>Status</th>
                      <th className="py-3 text-end px-3" style={{ width: "25%" }}>Amount (MMK)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claimsData.map((claim, index) => (
                      <tr key={index} className="align-middle">
                        <td className="py-3 px-3 fw-semibold text-primary">{claim.id}</td>
                        <td className="py-3 text-secondary small">{claim.date}</td>
                        <td className="py-3 text-center">
                          <span className={`badge ${claim.badgeClass} px-3 py-2 border rounded-pill fw-semibold`} style={{ minWidth: "100px", fontSize: "0.8rem" }}>
                            {claim.status}
                          </span>
                        </td>
                        <td className="py-3 text-end px-3 fw-bold text-dark">{claim.amount}</td>
                      </tr>
                    ))}
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
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-dark fs-5">3</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                  <span className="text-warning fw-semibold small">Medium Risk</span>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-dark fs-5">5</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                  <span className="text-danger fw-semibold small">High Risk</span>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-dark fs-5">4</span>
                  </div>
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