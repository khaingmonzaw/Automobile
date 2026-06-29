import React, { useState } from "react";

function MyClaims() {


    const [isOpen,setIsOpen]=React.useState(false);
    const [status,setStatus]=React.useState("All Lists");

    const handleSelect=(value)=>{
      setStatus(value)
      setIsOpen(false)
      
    }
  
  return (
   <>
   <div className="d-flex justify-content-end me-5 mb-4">
 <div className="dropdown ">
      <button
      className="btn btn-warning dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      onClick={() => setIsOpen(!isOpen)}
    >
     {status}
    </button>

  <ul className="dropdown-menu">
         <li>
            <button
              className="dropdown-item"
              onClick={() => handleSelect("All Lists")}
            >
             All List
            </button>
          </li>
    <li>
            <button
              className="dropdown-item"
              onClick={() => handleSelect("Pending")}
            >
             Pending
            </button>
          </li>
            <li>
            <button
              className="dropdown-item"
              onClick={() => handleSelect("Approved")}
            >
              Approved
            </button>
          </li>
            <li>
            <button
              className="dropdown-item"
              onClick={() => handleSelect("Rejected")}
            >
              Rejected
            </button>
          </li>
          </ul>
</div>
   </div>
   <div className="row">
    
      {/* Table */}
                    <table className="table table-bordered">
                        <thead >
                            <tr>
                                <th style={{ backgroundColor: "#ffed92" }}>Claim ID</th>
                                <th style={{ backgroundColor: "#ffed92" }}>Accident Date</th>
                                <th style={{ backgroundColor: "#ffed92" }}>Status</th>
                                <th style={{ backgroundColor: "#ffed92" }}>Claim Amount</th>
                                <th style={{backgroundColor:  "#ffed92"}}>Action</th>

                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>1234</td>

                                <td>John Smith</td>
                                <td>$1,000</td>
                                <td>Approved</td>
                                 <td>View</td>
                            </tr>
                        </tbody>
                    </table><a href=""></a>
   </div>
   </>
  )
}

export default MyClaims