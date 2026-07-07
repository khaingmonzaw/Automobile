import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";

function ClaimDetails() {


    const { id } = useParams();
    const [claim, setClaim] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/api/claims/${id}`)
            .then(res => res.json())
            .then((data) => {
                setClaim(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [id]);



    return (
        <div>
            <div className="row text-start mt-2">

                <Link to="../MyClaims" className="text-decoration-none text-dark" >
                    <button className='btn  btn-warning'>
                        <FontAwesomeIcon icon={faCircleLeft} />
                    </button></Link>


            </div>

            {loading ? (
                <h3>Loading...</h3>
            ) : !claim ? (
                <h3>No Claim Found</h3>
            ) : (
                <div className="row my-3">
                    <div className="card  mx-auto bg-white p-5 border rounded-3">
                        <h3 className="text-start">Claim Detail</h3>
                        <hr />

                        <div className="row">
                            <div className="col-10 mx-auto text-start">
                                <table className="table ">
                                    <tbody>

                                        <tr>
                                            <th>Claim ID</th>
                                            <td>CLM-{claim.claim_id}</td>
                                        </tr>

                                        <tr>
                                            <th>Claim Date</th>
                                            <td>{claim.created_at.split("T")[0]}</td>
                                        </tr>


                                        <tr>
                                            <th>Vehicle Model</th>
                                            <td>{claim.v_model}</td>
                                        </tr>
                                        <tr>
                                            <th>Vehicle Number</th>
                                            <td>{claim.v_number}</td>
                                        </tr>
                                        <tr>
                                            <th>Accident Type</th>
                                            <td>{claim.accident_type}</td>
                                        </tr>

                                        <tr>
                                            <th>Accident Date</th>
                                            <td>{claim.accident_date.split("T")[0] }</td>
                                        </tr>

                                          <tr>
                                            <th>Accident Location</th>
                                            <td style={{ whiteSpace: "normal", wordBreak: "break-word" }}>{claim.location}</td>
                                        </tr>

                                        <tr>
                                            <th>Description</th>
                                            <td>{claim.description}</td>
                                        </tr>

                                        <tr>
                                            <th>Claimed Amount</th>
                                            <td>{claim.claimed_amount}</td>
                                        </tr>

                                        <tr>
                                            <th>Compensation Amount</th>
                                            <td>{claim.compensation_amount || "N/A"}</td>
                                        </tr>

                                        <tr>
                                            <th>Status</th>
                                            <td>{claim.status}</td>
                                        </tr>

                                        <tr>
                                            <th>Message</th>
                                            <td>{claim.remark || "No message"}</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default ClaimDetails