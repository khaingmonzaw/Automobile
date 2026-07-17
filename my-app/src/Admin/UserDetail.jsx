import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import * as mmNrc from "mm-nrc";

const getCleanNrc = (rawNrc) => {
  if (!rawNrc) return "-";
  
  const match = rawNrc.match(/([^\/]*)\/([a-zA-Z-]+)\(([a-zA-Z])\)(\d+)/);
  if (!match) return rawNrc; 
  
  const stateId = match[1];   
  const townshipCode = match[2];  
  const type = match[3];      
  const number = match[4];    
  
  let stateNumber = stateId; 
  
  if (stateId) {
    const states = mmNrc.getNrcStates();
    const matchedState = states.find(s => s.id === stateId);
    
    if (matchedState) {
      stateNumber = matchedState.number?.en || matchedState.number || stateId;
    }
  } else {
    stateNumber = ""; 
  }
  let townshipDisplay = townshipCode;
  const townships = mmNrc.getNrcTownships(); 
  const matchedTownship = townships.find(t => t.code === townshipCode);
  if (matchedTownship) {
    townshipDisplay = matchedTownship.short.en; 
  }

  return `${stateNumber ? stateNumber : ''}/${townshipDisplay}(${type})${number}`;
};

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user detail:", err));
  }, [id]);

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (

    <>
     <div className="mb-2 text-start">
        <Link to="/Admin/Users" className="text-decoration-none text-dark" >
                    <button className='btn btn-warning'>
                        <FontAwesomeIcon icon={faCircleLeft} />
                    </button></Link>
      </div>
    <div className="container mt-4 bg-white p-4 shadow-sm rounded" style={{ fontSize: '0.85rem' }}>
      {/* Header with Back and Edit buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fs-2 fw-bold m-0">User Information</h4>
        <div className="d-flex gap-2">
        


          
          <button 
            className="btn fw-bold btn-warning" 

            onClick={() => navigate(`/Admin/Users/Adduser/${user.policy_id}`)}
          >
            Edit
          </button>
        </div>
      </div>
      
      <hr style={{ borderColor: '#34495e' }} />

      {/* Info Table */}
      <table className="table table-borderless text-start" style={{ fontSize: "1rem" }}>
        <tbody>
          <tr><td className="" style={{ width: "30%", fontWeight: "bold" }}>User ID</td><td style={{ width: "5%" }}>:</td><td>{user.id}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>User Name</td><td>:</td><td>{user.name}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Email</td><td>:</td><td>{user.email}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Phone</td><td>:</td><td>{user.phone}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Date of Birth</td><td>:</td><td>{user.dob}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Driver License</td><td>:</td><td>{user.driver_license}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Driving Year</td><td>:</td><td>{user.driver_year}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>NRC</td><td>:</td><td>{getCleanNrc(user.nrc)}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Address</td><td>:</td><td>{user.address}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Policy Number</td><td>:</td><td>{user.policyNumber || "-"}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Coverage Type</td><td>:</td><td>{user.coverageType || "-"}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Vehicle Model</td><td>:</td><td>{user.vehicleModel || "-"}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Vehicle Number</td><td>:</td><td>{user.vehicleNumber || "-"}</td></tr>
                    <tr><td style={{ fontWeight: "bold" }}>Remaining Balance</td><td>:</td><td>{user.remaining_balance || "-"}</td></tr>

          <tr><td style={{ fontWeight: "bold" }}>Start Date</td><td>:</td><td>{user.startDate || "-"}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>End Date</td><td>:</td><td>{user.endDate || "-"}</td></tr>
        </tbody>
      </table>
    </div>
    </>
  );
}

export default UserDetail;