import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faSearch } from "@fortawesome/free-solid-svg-icons";

function Userlist() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log("Status values:");
      data.forEach(item => console.log(JSON.stringify(item.Policy_Status)));
        setUsers(data.reverse());
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  const filteredUsers = users.filter((item) => {
  const keyword = searchTerm.trim().toLowerCase();

  const userName = String(item.User_Name || "").trim().toLowerCase();
  const policyNo = String(item.Policy_Number || "").trim().toLowerCase();
  const status = String(item.Policy_Status || "").trim().toLowerCase();

  // Search box ဗလာဆိုရင် အားလုံးပြ
  if (keyword === "") return true;

  // Status ကို exact match လုပ်
  if (keyword === "active" || keyword === "inactive") {
    return status === keyword;
  }

  // User Name နဲ့ Policy Number ကို partial search
  return (
    userName.includes(keyword) ||
    policyNo.includes(keyword)
  );
});

 const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

 const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mt-4 bg-white px-4 py-5 shadow-md" >
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
      
  <div className="d-flex justify-content-end mb-3">
  <div
    className="input-group"
    style={{ width: "250px" }}
  >
    <span
      className="input-group-text"
      style={{
        backgroundColor: "#ffed92",
        border: "1px solid #FFC107",
        padding: "6px 10px"
      }}
    >
       <FontAwesomeIcon icon={faSearch} />
    </span>

    <input
      type="text"
      className="form-control"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
      style={{
        height: "38px",
        fontSize: "0.85rem",
        border: "1px solid #FFC107",
        boxShadow: "none"
      }}
    />
  </div>
</div>

      <div className="table-responsive">
        <table className="table table-hover shadow-sm" style={{ textAlign: 'left' }}>
          <thead className="custom-header ">
            <tr >
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>User_ID</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>User Name</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Policy Number</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Claimed Freq.</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Policy Status</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (

                <tr key={index}>
                  <td>{item.User_ID}</td>
                  <td>{item.User_Name}</td>
                  <td>{item.Policy_Number || "-"}</td>
                  <td>{item.Claimed_Freq || 0}</td>
                  <td>
                    <span
  style={{
    backgroundColor:
      String(item.Policy_Status).trim().toLowerCase() === "active"
        ? "#d1fae5"
        : "#fee2e2",
    color:
      String(item.Policy_Status).trim().toLowerCase() === "active"
        ? "#065f46"
        : "#991b1b",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "600",
    display: "inline-block",
    minWidth: "75px",
    textAlign: "center"
  }}
>
  {String(item.Policy_Status).trim()}
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
