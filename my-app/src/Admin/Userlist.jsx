import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css"; 

function Userlist() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4 bg-white p-4 shadow-sm rounded" style={{ fontSize: '0.85rem' }}>
      {/* Add user button */}
<div className="d-flex justify-content-between align-items-center mb-4">
  <h4 className="fw-bold m-0">Users List</h4>
  <button 
    className="btn fw-bold d-flex align-items-center justify-content-center" 
    style={{ 
      backgroundColor: '#FFC107', 
      color: '#000', 
      border: 'none',
      width: '40px',   
      height: '40px',  
      borderRadius: '8px', 
      fontSize: '20px'
    }} 
    onClick={() => navigate("/Admin/Adduser")}
  >
    +
  </button>
</div>

      <table className="table table-hover shadow-sm" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#FFC107' }}>
          <tr>
            <th>User_ID</th>
            <th>User Name</th>
            <th>Policy Number</th>
            <th>Claimed Freq.</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((item, index) => (
              
              <tr key={index}>
                <td>{item.User_ID}</td>
                <td>{item.User_Name}</td>
                <td>{item.Policy_Number || "-"}</td>
                <td>{item.Claimed_Freq || 0}</td>
                <td>
                  <span className={item.status === 'active' ? 'status-badge-active' : 'status-badge-inactive'}>
                    {item.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
        
              <td style={{ textAlign: 'left' }}>
     <button 
    className="btn btn-sm btn-outline-secondary" 
    onClick={() => navigate(`/Admin/UserDetail/${item.User_ID}`)} 
    title="Edit User" 
  >
   
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      fill="currentColor" 
      className="bi bi-pencil" 
      viewBox="0 0 16 16"
      style={{ marginBottom: '2px' }} 
    >
      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
    </svg>
  </button>
</td>

              </tr>
            ))
          ) : (
            <tr><td colSpan="6" className="text-center">No data available</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Userlist;