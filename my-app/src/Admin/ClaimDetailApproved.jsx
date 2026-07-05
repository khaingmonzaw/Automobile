import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";


const ClaimDetailApproved = () => {
//   const [claims, setClaims] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAllClaims = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('http://localhost:3000/api/claims');
//         const data = await response.json();
        
//         if (response.ok) {
//           setClaims(data);
//         } else {
//           console.error("Failed to fetch claims");
//         }
//       } catch (error) {
//         console.error("Error fetching claims:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllClaims();
//   }, []);

//   if (loading) return <div className="text-center py-5">Loading your claims list...</div>;

//   return (
//         <div className="container " style={{ backgroundColor: '#F2F9FF', minHeight: '100%' }}>
//             <div className="row text-start my-3">

//                 <Link to="" className="text-decoration-none text-dark" >
//                     <button className='btn  btn-warning'>
//                         <FontAwesomeIcon icon={faCircleLeft} />
//                     </button></Link>

//             </div>
//             <div className="row g-4 justify-content-center ">
//                 {/* Left Card: Claim Information */}
//                 <div className="col-md-8 col-12 ">
//                     <div className="card shadow border-0  p-5" style={{ borderRadius: '25px' }}>
//                         <h2 className="fw-bold mb-3 text-dark fs-3" >Claim Information</h2>
//                         <hr className="border border-dark opacity-100 mb-4" />
//                         <div className="d-flex flex-column gap-3">
//                             <div className="row ">
//                                 <p className="col-6 text-secondary fw-semibold">Claim ID</p>
//                                 <p className="col-6 text-dark fw-bold">{claims.calim_id}</p>
//                             </div>
//                             {/* <div className="row ">
//                                 <p className=" col-6 text-secondary fw-semibold">Claimant Name</p>
//                                 <p className="col-6 text-dark">{claim.claimant}</p>
//                             </div> */}
//                             {/* <div className="row">
//                                 <p className="col-6 text-secondary fw-semibold">Vehicle Model</p>
//                                 <p className="col-6 text-dark">{claim.vehicleModel}</p>
//                             </div>
//                             <div className="row ">
//                                 <p className="col-6 text-secondary fw-semibold">Vehicle Number</p>
//                                 <p className=" col-6 text-dark">{claim.vehicleNumber}</p>
//                             </div> */}
//                             <div className="row ">
//                                 <p className="col-6 text-secondary fw-semibold">Accident Date</p>
//                                 <p className="col-6 text-dark">{claims.accident_date}</p>
//                             </div>
//                             <div className="row ">
//                                 <p className="col-6 text-secondary fw-semibold">Accident Type</p>
//                                 <p className="col-6 text-dark" style={{ maxWidth: '60%' }}>{claim.accident_type}</p>
//                             </div>
//                             <div className="row ">
//                                 <p className="col-6 text-secondary fw-semibold">Claim Amount</p>
//                                 <p className="col-6 text-dark fw-bold text-success">{claims.claimed_amount}</p>
//                             </div>
//                             <div className="row ">
//                                 <p className="col-6 text-secondary fw-semibold">Location</p>
//                                 <p className="col-6 text-dark " style={{ maxWidth: '60%' }}>{claims.location}</p>
//                             </div>
//                             <div className="row ">
//                                 <p className="col-6 text-secondary fw-semibold">Description</p>
//                                 <p className="col-6 text-dark">{claims.description}</p>
//                             </div>

//                             <div className="row ">
//                                 <p className="col-6 text-secondary fw-semibold">Submitted Date</p>
//                                 <p className="col-6 text-dark">{claims.created_date}</p>
//                             </div>
//                             <div className="row ">
//                                 <p className="col-6 text-secondary fw-semibold">Status</p>
//                                 <p className="col-6 badge bg-success-subtle text-success border border-success px-3 py-2 fw-bold  rounded-pill">
//                                     {claims.status}
//                                 </p>
//                             </div>
//                             <div className="p-3 mt-4 rounded-3" style={{ backgroundColor: 'rgba(217, 217, 217, 0.25)', borderLeft: '5px solid #52DD75' }}>
//                                 <p className="d-block fw-bold text-dark mb-2 ">Remarks *</p>
//                                 <p className="text-muted mb-0 fs-5">{claim.remarks}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Right Card
//         <div className="col-12 col-lg-5">
//           <div className="card shadow border-0 p-4 py-5 d-flex flex-column justify-content-between" style={{ borderRadius: '25px', minHeight: '600px' }}>
//             <div>
//               <h2 className="fw-bold mb-3 text-dark" style={{ fontSize: '28px' }}>Status & Details</h2>
//               <hr className="border border-dark opacity-100 mb-4" />
//               <div className="d-flex flex-column gap-3">
//                 <div className="d-flex justify-content-between fs-5">
//                   <span className="text-secondary fw-semibold">Description</span>
//                   <span className="text-dark">{claim.description}</span>
//                 </div>
//                 <div className="d-flex justify-content-between fs-5">
//                   <span className="text-secondary fw-semibold">Submitted Date</span>
//                   <span className="text-dark">{claim.submittedDate}</span>
//                 </div>
//                 <div className="d-flex justify-content-between fs-5">
//                   <span className="text-secondary fw-semibold">Status</span>
//                   <span className="badge bg-success-subtle text-success border border-success px-3 py-2 fw-bold fs-6 rounded-pill">
//                     {claim.status}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="p-3 mt-4 rounded-3" style={{ backgroundColor: 'rgba(217, 217, 217, 0.25)', borderLeft: '5px solid #52DD75' }}>
//               <span className="d-block fw-bold text-dark mb-2 fs-5">Remarks *</span>
//               <p className="text-muted mb-0 fs-5">{claim.remarks}</p>
//             </div>
//           </div>
//         </div> */}
//             </div>
//         </div>
//     );
};

export default ClaimDetailApproved;