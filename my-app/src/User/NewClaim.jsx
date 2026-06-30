import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
function NewClaim() {


    const handleReset=(e)=>{
        
        setFormData({
            accidentDate: "",
            accidentType: "",
            claimAmount: "",
            location: "",
            vehicleModel: "",
            vehicleNumber: "",
            description: ""
        });

    }



    const saveSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
        alert("Data submitted successfully!");
        handleReset();



    }



    const [formData, setFormData] = useState({
        accidentDate: "",
        accidentType: "",
        claimAmount: "",
        location: "",
        vehicleModel: "",
        vehicleNumber: "",
        description: ""
    });


    const handleData = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

    const getLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation not found");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;

                    const respone = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                    );

                    const data = await respone.json();
                    setFormData((prev) => ({
                        ...prev,
                        location: data.display_name || ""
                    }));
                } catch (error) {
                    alert("Failed to fetch Location")
                } finally {
                    setLoading(false)
                }
            },
            (error) => {
                setLoading(false);
            }
        );







    };

    return (
        <div>
            <h3 className="text-start">New Claim Submission</h3>

            <form onSubmit={saveSubmit}>
                <div className="row bg-white p-5 border rounded-4 my-4 text-start">

                    <div className="col-md-6">

                        <div className="mb-4">
                            <label>Accident Date</label>
                            <input type="date"
                                name="accidentDate"
                                value={formData.accidentDate}
                                onChange={handleData}
                                className="form-control" />
                        </div>

                        <div className="mb-4">
                            <label>Accident Type</label>
                            <select className="form-select"
                                name="accidentType"
                                value={formData.accidentType}
                                onChange={handleData}
                            >
                                <option>Select Accident Type</option>
                                <option>Thief</option>
                                <option>Third Party Collision</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label>Claim Amount</label>
                            <input type="text" className="form-control"
                                name="claimAmount"
                                value={formData.claimAmount}
                                onChange={handleData}
                            />
                        </div>

                        <div className="mb-4">
                            <label>Location</label>

                            <div className="row">
                                <div className="col-9">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="location"
                                        placeholder="Current Location"
                                        value={formData.location}

                                    />
                                </div>

                                <div className="col-3">
                                    <button
                                        type="button"
                                        className="btn btn-warning btn-sm"
                                        onClick={getLocation}
                                        disabled={loading}
                                    >
                                        {loading ? <FontAwesomeIcon icon={faMagnifyingGlass} />
                                            : <FontAwesomeIcon icon={faMagnifyingGlass} />
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="col-md-6">

                        <div className="mb-4">
                            <label>Vehicle Model</label>
                            <input className="form-control"
                                name="vehicleModel"
                                value={formData.vehicleModel}
                                onChange={handleData} />
                        </div>

                        <div className="mb-4">
                            <label>Vehicle Number</label>
                            <input className="form-control"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleData} />
                        </div>

                        <div className="mb-4">
                            <label>Description</label>
                            <textarea className="form-control" rows="5"
                                name="description"
                                value={formData.description}
                                onChange={handleData}
                            ></textarea>
                        </div>

                    </div>

                </div>

                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-warning" type="submit">
                        Submit
                    </button>
                    <button className="btn btn-danger" type="button" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NewClaim;