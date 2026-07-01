import React from "react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";


function Dashboard() {
    return (
        <>

            <div className="container-fluid mt-5">

                <div className="row">
                    <div className="col-md-3 mb-3" >
                        <div className="card shadow-sm border-0 h-100" style={{ backgroundColor: "#ffed92" }}>

                            <div className="card-body">
                                <h5 className="card-title">Total</h5>
                                <h5>1</h5>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-3  mb-3" >

                        <div className="card shadow-sm border-0 h-100" style={{ backgroundColor: "#aff6ba" }}>
                            <div className="card-body">
                                <h5 className="card-title">Pending</h5>
                                <h5>2</h5>

                            </div>

                        </div>
                    </div>
                    <div className="col-md-3  mb-3">

                        <div className="card shadow-sm border-0 h-100 " style={{ backgroundColor: "#84ebfd" }}>
                            <div className="card-body">
                                <h5 className="card-title">Approved</h5>
                                <h5>3</h5>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-3  mb-3" >

                        <div className="card shadow-sm border-0 h-100" style={{ backgroundColor: "#9bccfe" }}>
                            <div className="card-body">
                                <h5 className="card-title">Rejected</h5>
                                <h5>3</h5>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Recent Claim List */}

                <div className="row my-4 bg-white px-3 rounded">

                    {/* Header */}
                    <div className="col-11">
                        <div className="d-flex justify-content-between align-items-center my-3 px-3 ">
                            <h5 className="mb-0">Recent Claims</h5>
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
                            <tr>
                                <td>1234</td>

                                <td>John Smith</td>
                                <td>$1,000</td>
                                <td>Approved</td>
                            </tr>
                        </tbody>
                    </table>
                    <a href=""></a>
                </div>
            </div>


        </>
    );
}

export default Dashboard;