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

function StaffDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/staff_details/${id}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user detail:", err));
  }, [id]);

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (

    <>
     <div className="mb-2 text-start">
        <Link to="/Admin/Staff" className="text-decoration-none text-dark" >
                    <button className='btn btn-warning'>
                        <FontAwesomeIcon icon={faCircleLeft} />
                    </button></Link>
      </div>
    <div className="container mt-4 bg-white p-4 shadow-sm rounded" style={{ fontSize: '0.85rem' }}>
      {/* Header with Back and Edit buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fs-2 fw-bold m-0">Staff Details</h4>
        <div className="d-flex gap-2">
        


          
         
        </div>
      </div>
      
      <hr style={{ borderColor: '#34495e' }} />

      {/* Info Table */}
      <table className="table table-borderless text-start" style={{ fontSize: "1rem" }}>
        <tbody>
          {/* <tr><td className="" style={{ width: "30%", fontWeight: "bold" }}>User ID</td><td style={{ width: "5%" }}>:</td><td>{user.id}</td></tr> */}
          <tr><td style={{ fontWeight: "bold" }}> Name</td><td>:</td><td>{user.name}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Email</td><td>:</td><td>{user.email}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Phone</td><td>:</td><td>{user.phone}</td></tr>
<tr>
  <td style={{ fontWeight: "bold" }}>DOB</td>
  <td>:</td>
  <td>
    {new Date(user.dob).toLocaleDateString("en-GB")}
  </td>
</tr>
          <tr><td style={{ fontWeight: "bold" }}>NRC</td><td>:</td><td>{getCleanNrc(user.nrc)}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Address</td><td>:</td><td>{user.address}</td></tr>
                 <tr><td style={{ fontWeight: "bold" }}>Status</td><td>:</td><td>{user.status}</td></tr>

        </tbody>
      </table>
    </div>
    </>
  );
}

export default StaffDetail;