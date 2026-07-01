import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faCircleLeft } from "@fortawesome/free-solid-svg-icons";

function ClaimDetails() {
    return (
        <div>
            <div className="row text-start mt-2">
             
                    <Link to="../MyClaims" className="text-decoration-none text-dark" >
                        <button className='btn  btn-warning'>
                            <FontAwesomeIcon icon={faCircleLeft} />
</button></Link>
                

              
                    
                
            </div>

            <div className="row  my-3">
                    <div className="card col-9 mx-auto bg-white p-5  border rounded-3">
                       <h3 className='text-start'>Claim Detail</h3>
                       <hr/>
                       <div className="col-6 text-start">

                        <p>Claim ID</p><br></br>
                        <p>Claim Date</p><br></br>
                        <p>Accident Type</p><br></br>
                        <p>Accident Date</p><br></br>
                        <p>Accident Description</p><br></br>
                        <p>Claimed Amount</p><br></br>
                        <p>Compensation Amount</p><br></br>
                        <p>Status</p><br></br>
                        <p>Message</p><br></br>
                       </div>
                       <div className="col-6"></div>
                    </div>
            </div>
        </div>
    )
}

export default ClaimDetails