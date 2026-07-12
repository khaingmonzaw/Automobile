import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function MyClaims() {

  const [status, setStatus] = useState("All");
  const [claims, setClaims] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3000/api/claims/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Claims:", data);
        setClaims(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.log(err);
        setClaims([]);
      });
  }, [userId]);
  const handleSelect = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  //  FILTER LOGIC
  const filteredClaims =
    status === "All"
      ? claims
      : claims.filter(c => c.status === status.toUpperCase());


  // Pagination Login

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredClaims.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);


  return (
    <div className="container-fluid ">




      {/* Table */}
      <div className="row bg-white border rounded">

        <div className="col-12 p-5">




          {/* Dropdown */}
          <div className="d-flex justify-content-between me-5 mb-4">

            <h1 className="">All Claim List</h1>
            <div className="dropdown">

              <button className="btn btn-warning dropdown-toggle" data-bs-toggle="dropdown">
                {status}
              </button>

              <ul className="dropdown-menu">

                <li><button className="dropdown-item" onClick={() => handleSelect("All")}>All</button></li>
                <li><button className="dropdown-item" onClick={() => handleSelect("PENDING")}>PENDING</button></li>
                <li><button className="dropdown-item" onClick={() => handleSelect("APPROVED")}>APPROVED</button></li>
                <li><button className="dropdown-item" onClick={() => handleSelect("REJECTED")}>REJECTED</button></li>

              </ul>

            </div>
          </div>
          <div className=" table-responsive">
            <table className="table table-bordered w-100 ">
              <thead>
                <tr>
                  <th style={{ backgroundColor: "#ffed92" }}>Claim ID</th>
                  <th style={{ backgroundColor: "#ffed92" }}>Policy Number</th>
                  <th style={{ backgroundColor: "#ffed92" }}>Vehcile Number</th>


                  <th style={{ backgroundColor: "#ffed92" }}>Accident Date</th>
                  <th style={{ backgroundColor: "#ffed92" }}>Status</th>
                  <th style={{ backgroundColor: "#ffed92" }}>Claim Amount</th>
                  <th style={{ backgroundColor: "#ffed92" }}>Claim Description</th>
                  <th style={{ backgroundColor: "#ffed92" }}>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No claims found
                    </td>
                  </tr>
                ) : (
                  currentItems.map((c) => (
                    <tr key={c.claim_id}>
                      <td className="text-primary">CLM-{c.claim_id}</td>
                      <td>{c.policy_number}</td>
                      <td>{c.vehicle_number}</td>


                      <td>{c.accident_date ? new Date(c.accident_date).toISOString().split("T")[0] : "-"}</td>
                      <td

                        className={
                          c.status === "PENDING" ? "text-warning"
                            : c.status === "APPROVED" ? "text-success"
                              : c.status === "REJECTED" ? "text-danger"
                                : ""
                        }

                      >{c.status}</td>
                      <td



                      >{c.claimed_amount}</td>
                      <td style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "250px" }}>
                        {c.description}
                      </td>
                      <td>
                        <Link to={`../MyClaims/ClaimDetails/${c.claim_id}`}>
                          <button className="btn btn-warning">
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>

          </div>
          <div className="d-flex justify-content-center my-5">
            <button
              className="btn btn-outline-warning me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Prev
            </button>

            <span className="px-3 py-1">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="btn btn-outline-warning ms-2"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>

        </div>



      </div>

    </div>
  );
}

export default MyClaims;