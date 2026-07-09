import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function Userlist() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
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


  const totalPages = Math.ceil(users.length / itemsPerPage) || 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mt-4 bg-white px-4 py-5 shadow-sm rounded" >
      {/* Add user button */}
      <div className="d-flex justify-content-between align-items-center px-2 mb-4">
        <h3 className="fs-2 fw-bold m-0">User's Policy List</h3>
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
          onClick={() => navigate("/Admin/Users/Adduser")}
        >
          +
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-hover shadow-sm" style={{ textAlign: 'left' }}>
          <thead className="custom-header ">
            <tr >
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>User_ID</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>User Name</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Policy Number</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Claimed Freq.</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Status</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              currentItems.map((item, index) => (

                <tr key={index}>
                  <td>{item.User_ID}</td>
                  <td>{item.User_Name}</td>
                  <td>{item.Policy_Number || "-"}</td>
                  <td>{item.Claimed_Freq || 0}</td>
                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-2 fw-semibold ${item.status === "active"
                          ? "bg-success-subtle text-success-emphasis"
                          : "bg-primary-subtle text-primary-emphasis"
                        }`}
                    >
                      {item.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td style={{ textAlign: 'left' }}>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => navigate(`/Admin/Users/UserDetail/${item.Policy_ID}`)}
                      title="Edit User"
                    >


                      <FontAwesomeIcon icon={faEye} />


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


      {/* Pagination Buttons */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-outline-warning me-2 fw-semibold px-3 "
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Prev
        </button>

        <span className="px-3 py-1 small fw-semibold align-self-center text-secondary">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-outline-warning ms-2 fw-semibold px-3 "
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Userlist;
