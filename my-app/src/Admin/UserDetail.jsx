import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    <div className="container mt-4 bg-white p-4 shadow-sm rounded" style={{ fontSize: '0.85rem' }}>
      {/* Header with Back and Edit buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">User Information</h4>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm fw-bold" 
            style={{ backgroundColor: '#F3D955', color: '#000', border: 'none' }} 
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <button 
            className="btn btn-sm fw-bold" 
            style={{ backgroundColor: '#F3D955', color: '#000', border: 'none' }} 
            onClick={() => navigate(`/Admin/Adduser/${user.id}`)}
          >
            Edit
          </button>
        </div>
      </div>
      
      <hr style={{ borderColor: '#34495e' }} />

      {/* Info Table */}
      <table className="table table-borderless text-start" style={{ fontSize: '0.85rem' }}>
        <tbody>
          <tr><td style={{ width: "30%", fontWeight: "bold" }}>User ID</td><td style={{ width: "5%" }}>:</td><td>{user.id}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>User Name</td><td>:</td><td>{user.name}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Email</td><td>:</td><td>{user.email}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Phone</td><td>:</td><td>{user.phone}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Date of Birth</td><td>:</td><td>{user.dob}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Driver License</td><td>:</td><td>{user.driver_license}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Driving Year</td><td>:</td><td>{user.driver_year}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>NRC</td><td>:</td><td>{user.nrc}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Address</td><td>:</td><td>{user.address}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Policy Number</td><td>:</td><td>{user.policyNumber || "-"}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Coverage Type</td><td>:</td><td>{user.coverageType || "-"}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Vehicle Model</td><td>:</td><td>{user.vehicleModel || "-"}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Vehicle Number</td><td>:</td><td>{user.vehicleNumber || "-"}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>Start Date</td><td>:</td><td>{user.startDate || "-"}</td></tr>
          <tr><td style={{ fontWeight: "bold" }}>End Date</td><td>:</td><td>{user.endDate || "-"}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export default UserDetail;