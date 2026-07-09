import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";


function Dashboard() {

    const [claims, setClaims] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id

const recentClaim = Array.isArray(claims) ? claims.slice(0, 5) : [];
    useEffect(() => {
  fetch(`http://localhost:3000/api/claims/user/${userId}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      console.log(Array.isArray(data));
      setClaims(Array.isArray(data) ? data : []);
    })
    .catch(err => console.log(err));
}, [userId]);

    const total = claims.length;
    const pending = claims.filter(c => c.status === "PENDING").length;
    const rejected = claims.filter(c => c.status === "REJECTED").length;
    const approved = claims.filter(c => c.status === "APPROVED").length;

    return (
        <>

            <div className="container-fluid mt-5">

                <div className="row">
                    <div className="col-md-3 mb-3" >
                        <div className="card shadow-sm border-0 h-100" style={{ backgroundColor: "#ffed92" }}>

                            <div className="card-body">
                                <h5 className="card-title">Total</h5>
                                <h5>{total}</h5>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-3  mb-3" >

                        <div className="card shadow-sm border-0 h-100" style={{ backgroundColor: "#aff6ba" }}>
                            <div className="card-body">
                                <h5 className="card-title">Pending</h5>
                                <h5>{pending}</h5>

                            </div>

                        </div>
                    </div>
                    <div className="col-md-3  mb-3">

                        <div className="card shadow-sm border-0 h-100 " style={{ backgroundColor: "#84ebfd" }}>
                            <div className="card-body">
                                <h5 className="card-title">Approved</h5>
                                <h5>{approved}</h5>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-3  mb-3" >

                        <div className="card shadow-sm border-0 h-100" style={{ backgroundColor: "#9bccfe" }}>
                            <div className="card-body">
                                <h5 className="card-title">Rejected</h5>
                                <h5>{rejected}</h5>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Recent Claim List */}

                <div className="row my-4 bg-white px-3 rounded">

                    {/* Header */}
                    <div className="col-11">
                        <div className="d-flex justify-content-between align-items-center my-3 px-3 ">
                            <h4 className="mb-0">Recent Claims</h4>
                            <button className="btn btn-warning "><Link to="../MyClaims" className="text-decoration-none text-dark">All</Link></button>
                        </div>
                    </div>


                    {/* Table */}
                    <table className="table table-bordered">
                        <thead >
                            <tr>
                                <th style={{ backgroundColor: "#ffed92" }}>Claim ID</th>
                                <th style={{ backgroundColor: "#ffed92" }}>Accident Date</th>
                                <th style={{ backgroundColor: "#ffed92" }}>Status</th>
                                <th style={{ backgroundColor: "#ffed92" }}>Claim Amount</th>

                            </tr>
                        </thead>

                       <tbody>
  {recentClaim.length === 0 ? (
    <tr>
      <td colSpan="4" className="text-center">
        No claims found.
      </td>
    </tr>
  ) : (
    recentClaim.map((c) => (
      <tr key={c.claim_id}>
        <td>CLM-{c.claim_id}</td>
        <td>{c.accident_date.split("T")[0]}</td>
        <td>{c.status}</td>
        <td>{c.claimed_amount}</td>
      </tr>
    ))
  )}
</tbody>
                    </table>
                    <a href=""></a>
                </div>
            </div>


        </>
    );
}

export default Dashboard;