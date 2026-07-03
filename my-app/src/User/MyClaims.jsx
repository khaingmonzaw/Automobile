import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function MyClaims() {

  const [status, setStatus] = useState("All");
  const [claims, setClaims] = useState([]);
  const [currentPage,setCurrentPage]=useState(1);

  const itemsPerPage =5;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3000/api/claims/user/${userId}`)
      .then(async (res) => {
        const text = await res.text();
        console.log("RAW RESPONSE:", text);

        return JSON.parse(text);
      })
      .then(data => setClaims(data))
      .catch(err => console.log(err));

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

      const indexOfLastItem =currentPage * itemsPerPage;
      const indexOfFirstItem =indexOfLastItem -itemsPerPage;

      const currentItems=filteredClaims.slice(indexOfFirstItem,indexOfLastItem);
      const totalPages=Math.ceil(filteredClaims.length/itemsPerPage);

    
  return (
    <div className="container-fluid ">


    

      {/* Table */}
      <div className="row bg-white">
        
        <div className="col-12 py-5 px-4">




  {/* Dropdown */}
      <div className="d-flex justify-content-between me-5 mb-4">

<h1 className="">All Claim List</h1>
        <div className="dropdown">

          <button className="btn btn-warning dropdown-toggle" data-bs-toggle="dropdown">
            {status}
          </button>

          <ul className="dropdown-menu">

            <li><button className="dropdown-item" onClick={() => handleSelect("All")}>All</button></li>
            <li><button className="dropdown-item" onClick={() => handleSelect("PENDING")}>Pending</button></li>
            <li><button className="dropdown-item" onClick={() => handleSelect("APPROVED")}>Approved</button></li>
            <li><button className="dropdown-item" onClick={() => handleSelect("REJECTED")}>Rejected</button></li>

          </ul>

        </div>
      </div>
        <div className=" table-responsive">
            <table className="table table-bordered ">
            <thead>
              <tr>
                <th style={{ backgroundColor: "#ffed92" }}>Claim ID</th>
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
                    <td>CLM-{c.claim_id}</td>
                    <td>{c.accident_date}</td>
                    <td>{c.status}</td>
                    <td>{c.claimed_amount}</td>
                    <td> {c.description.length > 10
                      ? c.description.substring(0, 10) + "..."
                      : c.description}</td>
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