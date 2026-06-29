import React from 'react'
import { useState } from "react";
function NewClaim() {


    const [location, setLocation] = useState("");
    const getLocation = () => {
        if (!navigator.geolocation) {
            alert("Error: Your Current Location can not Get");
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude
                const lon = position.coords.longitude


                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                );

                const data = await response.json();
                setLocation(data.display_name)
            });
    };
    return (
        <div>
            <h3 className='text-start'>New Claim Submission</h3>
              <form>
            <div className="row bg-white  p-5 border rounded-4 my-4">
              
                    <div className="col-md-6">

                        {/* Accident Date */}
                        <div className="mb-4">
                            <label className="form-label d-block text-start">Accident Date</label>
                            <input
                                type="date"
                                className="form-control border border-1"
                                placeholder="Enter Accident Date"
                            />
                        </div>
                        {/* Accident Type */}
                        <div className="mb-4">
                            <label className="form-label d-block text-start">Accident Type</label>
                            <select className='form-select ' >
                                <option>Selct Accident Type</option>
                                <option>Thief</option>
                                <option>Third Party Collision</option>
                            </select>
                        </div>

                        {/* Claim Amount */}
                        <div className="mb-4">
                            <label className="form-label d-block text-start">Claim Amount</label>
                            <input
                                type='text'
                                className='form-control border border-1'
                                placeholder='Enter Amount  MMK'
                            />
                        </div>

                        {/* Location */}
                        <div className="mb-4">
                            <div className="row ">
                                <label className='form-label d-block text-start'>Location</label>
                                <div className="col-9">

                                    <input
                                        type="text"
                                        className='form-control'
                                        value={location}
                                        placeholder='Current Location'
                                        readOnly
                                    />
                                </div>
                                <div className="col-3">
                                    <button
                                        class="btn btn-sm btn-warning"
                                        type="button"
                                        onClick={getLocation}
                                    >Find</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-4">
                            <label className="form-label d-block text-start">
                                Vehicle Model
                            </label>
                            <input className='form-control border border-1'
                            type="text"
                            placeholder='Enter Vehicle Model'
                            
                            />
                        </div>
                        <div className="mb-4">
                            <label className='form-label d-block text-start'>Vehicle Number</label>
                            <input
                            className="form-control"
                            type="text"
                            placeholder='Enter Vehicle Number'
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label d-block text-start">Description</label>
                            <textarea
                            className="form-control"
                            rows="5"
                           
                            placeholder='Describe the accident......'

                            ></textarea>
                        </div>
                    </div>
               
            </div>
            <div className='d-flex justify-content-center gap-3'>
                <button className="btn btn-warning " type="submit">Submit</button>
                <button className="btn btn-danger " type="reset">Reset</button>
            </div>
 </form>
        </div>
    )
}

export default NewClaim