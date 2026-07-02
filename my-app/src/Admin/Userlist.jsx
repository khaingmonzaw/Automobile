import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Userlist() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const mockData = [
      { id: 1, name: "Mg Mg", policy_number: "POL-001", claimed_freq: 2, status: "Active" },
      { id: 2, name: "Aung Aung", policy_number: "POL-002", claimed_freq: 0, status: "Inactive" },
    ];
    setUsers(mockData);
  }, []);

  return (
    <div className="container mt-4 bg-white p-4 shadow-sm rounded" style={{ fontSize: '0.85rem' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">Users List</h4>
        <button 
          className="btn btn-sm fw-bold" 
          style={{ backgroundColor: '#F3D955', color: '#000', border: 'none' }}
          onClick={() => navigate("/Admin/Adduser")}
        >
          + Add User
        </button>
      </div>

      <table className="table table-hover shadow-sm" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
        <thead style={{ backgroundColor: '#F3D955' }}>
          <tr>
            <th style={{ textAlign: 'left' }}>User_ID</th>
            <th style={{ textAlign: 'left' }}>User Name</th>
            <th style={{ textAlign: 'left' }}>Policy Number</th>
            <th style={{ textAlign: 'left' }}>Claimed Freq.</th>
            <th style={{ textAlign: 'left' }}>Status</th>
            <th style={{ textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: 'left' }}>{item.id}</td>
                <td style={{ textAlign: 'left' }}>{item.name}</td>
                <td style={{ textAlign: 'left' }}>{item.policy_number}</td>
                <td style={{ textAlign: 'left' }}>{item.claimed_freq}</td>
                <td style={{ textAlign: 'left' }}>
                  <span className={`badge ${item.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {item.status}
                  </span>
                </td>
                <td style={{ textAlign: 'left' }}>
                  <button 
                    className="btn btn-sm btn-outline-secondary" 
                    onClick={() => navigate(`/Admin/UserDetail/${item.id}`)}
                  >
                    👁️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Userlist;