import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faSearch,faPenToSquare ,faTrash,faRotateLeft} from "@fortawesome/free-solid-svg-icons";

function StaffLists() {
    const [showConfirm, setShowConfirm] = useState(false);
const [selectedStaff, setSelectedStaff] = useState(null);
const [showAlert, setShowAlert] = useState(false);
const [alertMessage, setAlertMessage] = useState("");
const [alertType, setAlertType] = useState("success");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/staff_lists")
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
 const filteredUsers = users.filter((item) => {
  const keyword = searchTerm.trim().toLowerCase();

  const name = String(item.name || "").trim().toLowerCase();
  const email = String(item.email || "").trim().toLowerCase();
  const status = String(item.status || "").trim().toLowerCase();

  // Status filter
  if (statusFilter !== "all" && status !== statusFilter) {
    return false;
  }

  // Search filter
  if (keyword === "") {
    return true;
  }

  return (
    name.includes(keyword) ||
    email.includes(keyword)
  );
});

const openConfirmDialog = (id, status) => {
  setSelectedStaff({
    id,
    currentStatus: status.toLowerCase()
  });

  setShowConfirm(true);
};


const handleStatusChange = async () => {

  const { id, currentStatus } = selectedStaff;

  const newStatus = currentStatus === "active"
    ? "inactive"
    : "active";

  try {
    const response = await fetch(
      `http://localhost:3000/api/staff_status/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus
        }),
      }
    );


    const data = await response.json();


    if (response.ok) {

      // Bootstrap success alert
      setAlertMessage(data.message);
      setAlertType("success");
      setShowAlert(true);


      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id
            ? {
                ...user,
                status: newStatus
              }
            : user
        )
      );


      setTimeout(() => {
        setShowAlert(false);
      }, 2000);


    } else {

      // Bootstrap error alert
      setAlertMessage(data.message);
      setAlertType("danger");
      setShowAlert(true);

    }


  } catch (error) {

    console.error(error);

    setAlertMessage("Server Error");
    setAlertType("danger");
    setShowAlert(true);

  }
};
 const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

 const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mt-4 bg-white px-4 py-5 shadow-md" >


{showAlert && (
  <div
    className={`alert alert-${alertType} alert-dismissible fade show`}
    role="alert"
  >
    <strong>
      {alertType === "success" ? "Success!" : "Error!"}
    </strong>
    <br />
    {alertMessage}

    <button
      type="button"
      className="btn-close"
      onClick={() => setShowAlert(false)}
    ></button>
  </div>
)}
        {showConfirm && (
  <div
    className="modal fade show d-block"
    style={{
      backgroundColor: "rgba(0,0,0,0.5)"
    }}
  >

    <div className="modal-dialog modal-dialog-centered">

      <div className="modal-content">

        <div className="modal-header bg-light">

          <h5 className="modal-title fw-bold">
            Confirmation
          </h5>

          <button
            className="btn-close"
            onClick={() => setShowConfirm(false)}
          >
          </button>

        </div>


        <div className="modal-body text-center">

          <p className="fw-semibold">
            {
              selectedStaff?.currentStatus === "active"
              ? "Are you sure you want to deactivate this staff?"
              : "Are you sure you want to activate this staff?"
            }
          </p>

        </div>


        <div className="modal-footer justify-content-center">

        


          <button
            className="btn btn-warning"
            onClick={() => {
              setShowConfirm(false);
              handleStatusChange();
            }}
          >
            Confirm
          </button>

            <button
            className="btn btn-danger"
            onClick={() => setShowConfirm(false)}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>

  </div>
)}
      {/* Add user button */}
      <div className="d-flex justify-content-between align-items-center px-2 mb-4">
        <h3 className="fs-2 fw-bold m-0">Staff Lists</h3>
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
          onClick={() => navigate("/Admin/Staff/AddStaff")}
        >
          +
        </button>
      </div>
     
      
<div className="d-flex justify-content-end gap-2 mb-3">

  <select
    className="form-select"
    style={{ width: "150px" }}
    value={statusFilter}
    onChange={(e) => {
      setStatusFilter(e.target.value);
      setCurrentPage(1);
    }}
  >
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
    <option value="all">All</option>
  </select>

  <div className="input-group" style={{ width: "250px" }}>
    <span
      className="input-group-text"
      style={{
        backgroundColor: "#ffed92",
        border: "1px solid #FFC107",
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
        border: "1px solid #FFC107",
        boxShadow: "none",
      }}
    />
  </div>

</div>
      <div className="table-responsive">
        <table className="table table-hover shadow-sm" style={{ textAlign: 'left' }}>
          <thead className="custom-header ">
            <tr >
              {/* <th className="py-3" style={{ backgroundColor: "#ffed92" }}>User_ID</th> */}
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Name</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Ph No</th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Email </th>
              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Address</th>
                            <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Status</th>

              <th className="py-3" style={{ backgroundColor: "#ffed92" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (

                <tr key={index}>
                  {/* <td>{item.Staff_ID}</td> */}
                  <td>{item.name}</td>
                  <td>{item.phone }</td>
                  <td>{item.email}</td>
                   <td>{item.address}</td>
                  <td>
                    <span
  style={{
    backgroundColor:
      String(item.status).trim().toLowerCase() === "active"
        ? "#d1fae5"
        : "#fee2e2",
    color:
      String(item.status).trim().toLowerCase() === "active"
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
  {String(item.status).trim()}
</span>
                  </td>

              <td>
  <div className="d-flex gap-2">
    <button
      className="btn btn-sm btn-warning"
      title="View Staff"
    >
      <FontAwesomeIcon icon={faEye} />
    </button>

    <button
      className="btn btn-sm btn-primary"
      title="Edit Staff"
    >
      <FontAwesomeIcon icon={faPenToSquare} />
    </button>

 {
  item.status.toLowerCase() === "active" ? (

    <button
      className="btn btn-sm btn-danger"
      title="Deactivate Staff"
onClick={() => openConfirmDialog(item.id, item.status)}  
 >
      <FontAwesomeIcon icon={faTrash} />
    </button>

  ) : (

    <button
      className="btn btn-sm btn-success"
      title="Activate Staff"
onClick={() => openConfirmDialog(item.id, item.status)}   

>
      <FontAwesomeIcon icon={faRotateLeft} />
    </button>

  )
}
  </div>
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

export default StaffLists;
