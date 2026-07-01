import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";

function ClaimDetailApproved() {
    const claim = {
        id: 'CLM001',
        claimant: 'Tia Bett',
        vehicleModel: 'Honda Fit',
        vehicleNumber: '3P-8452',
        accidentDate: '2026/06/23',
        accidentType: 'Third-party collision',
        claimAmount: '100000 MMK',
        location: 'No 84, Kamaryut Township, Yangon',
        description: 'Collision',
        submittedDate: '2026/06/30',
        status: 'Approved',
        remarks: 'Information is valid. Claim is approved.',
    };

    return (
        <div className="container " style={{ backgroundColor: '#F2F9FF', minHeight: '100%' }}>
            <div className="row text-start my-3">

                <Link to="" className="text-decoration-none text-dark" >
                    <button className='btn  btn-warning'>
                        <FontAwesomeIcon icon={faCircleLeft} />
                    </button></Link>

            </div>
            <div className="row g-4 justify-content-center ">
                {/* Left Card: Claim Information */}
                <div className="col-md-8 col-12 ">
                    <div className="card shadow border-0  p-5" style={{ borderRadius: '25px' }}>
                        <h2 className="fw-bold mb-3 text-dark fs-3" >Claim Information</h2>
                        <hr className="border border-dark opacity-100 mb-4" />
                        <div className="d-flex flex-column gap-3">
                            <div className="row ">
                                <p className="col-6 text-secondary fw-semibold">Claim ID</p>
                                <p className="col-6 text-dark fw-bold">{claim.id}</p>
                            </div>
                            <div className="row ">
                                <p className=" col-6 text-secondary fw-semibold">Claimant Name</p>
                                <p className="col-6 text-dark">{claim.claimant}</p>
                            </div>
                            <div className="row">
                                <p className="col-6 text-secondary fw-semibold">Vehicle Model</p>
                                <p className="col-6 text-dark">{claim.vehicleModel}</p>
                            </div>
                            <div className="row ">
                                <p className="col-6 text-secondary fw-semibold">Vehicle Number</p>
                                <p className=" col-6 text-dark">{claim.vehicleNumber}</p>
                            </div>
                            <div className="row ">
                                <p className="col-6 text-secondary fw-semibold">Accident Date</p>
                                <p className="col-6 text-dark">{claim.accidentDate}</p>
                            </div>
                            <div className="row ">
                                <p className="col-6 text-secondary fw-semibold">Accident Type</p>
                                <p className="col-6 text-dark" style={{ maxWidth: '60%' }}>{claim.accidentType}</p>
                            </div>
                            <div className="row ">
                                <p className="col-6 text-secondary fw-semibold">Claim Amount</p>
                                <p className="col-6 text-dark fw-bold text-success">{claim.claimAmount}</p>
                            </div>
                            <div className="row ">
                                <p className="col-6 text-secondary fw-semibold">Location</p>
                                <p className="col-6 text-dark " style={{ maxWidth: '60%' }}>{claim.location}</p>
                            </div>
                            <div className="row ">
                                <p className="col-6 text-secondary fw-semibold">Description</p>
                                <p className="col-6 text-dark">{claim.description}</p>
                            </div>

                            <div className="row ">
                                <p className="col-6 text-secondary fw-semibold">Submitted Date</p>
                                <p className="col-6 text-dark">{claim.submittedDate}</p>
                            </div>
                            <div className="row ">
                                <p className="col-6 text-secondary fw-semibold">Status</p>
                                <p className="col-6 badge bg-success-subtle text-success border border-success px-3 py-2 fw-bold  rounded-pill">
                                    {claim.status}
                                </p>
                            </div>
                            <div className="p-3 mt-4 rounded-3" style={{ backgroundColor: 'rgba(217, 217, 217, 0.25)', borderLeft: '5px solid #52DD75' }}>
                                <p className="d-block fw-bold text-dark mb-2 ">Remarks *</p>
                                <p className="text-muted mb-0 fs-5">{claim.remarks}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Card
        <div className="col-12 col-lg-5">
          <div className="card shadow border-0 p-4 py-5 d-flex flex-column justify-content-between" style={{ borderRadius: '25px', minHeight: '600px' }}>
            <div>
              <h2 className="fw-bold mb-3 text-dark" style={{ fontSize: '28px' }}>Status & Details</h2>
              <hr className="border border-dark opacity-100 mb-4" />
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between fs-5">
                  <span className="text-secondary fw-semibold">Description</span>
                  <span className="text-dark">{claim.description}</span>
                </div>
                <div className="d-flex justify-content-between fs-5">
                  <span className="text-secondary fw-semibold">Submitted Date</span>
                  <span className="text-dark">{claim.submittedDate}</span>
                </div>
                <div className="d-flex justify-content-between fs-5">
                  <span className="text-secondary fw-semibold">Status</span>
                  <span className="badge bg-success-subtle text-success border border-success px-3 py-2 fw-bold fs-6 rounded-pill">
                    {claim.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-3 mt-4 rounded-3" style={{ backgroundColor: 'rgba(217, 217, 217, 0.25)', borderLeft: '5px solid #52DD75' }}>
              <span className="d-block fw-bold text-dark mb-2 fs-5">Remarks *</span>
              <p className="text-muted mb-0 fs-5">{claim.remarks}</p>
            </div>
          </div>
        </div> */}
            </div>
        </div>
    );
};



export default ClaimDetailApproved