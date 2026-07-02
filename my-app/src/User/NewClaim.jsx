import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function NewClaim() {

    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(false);

    // ================= ADDED: formData now includes vehicle_id =================
    const [formData, setFormData] = useState({
        accidentDate: "",
        accidentType: "",
        claimAmount: "",
        location: "",
        description: "",
        
    });

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    // ================= GET POLICIES =================
    useEffect(() => {
        if (!userId) return;

        fetch(`http://localhost:3000/api/policies/${userId}`)
            .then(res => res.json())
            .then(data => setPolicies(data))
            .catch(err => console.log(err));
    }, [userId]);

    // ================= POLICY CHANGE =================
    const handlePolicyChange = (e) => {
        const id = e.target.value;

        const selected = policies.find(p => p.id == id);

        setSelectedPolicy(selected);


        setFormData(prev => ({
            ...prev,
            coverage: "",
            vehicle_id: selected?.vehicle_id || ""
        }));
    };

    // ================= FORM CHANGE =================
    const handleData = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ================= RESET =================
    const handleReset = () => {
        setFormData({
            accidentDate: "",
            accidentType: "",
            claimAmount: "",
            location: "",
            description: "",
         

        });
    };

    // ================= SUBMIT (FIXED async) =================
    const saveSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            user_id: userId,
            policy_id: selectedPolicy?.id,
            accident_type: formData.accidentType,
            claimed_amount: formData.claimAmount,
            accident_date:formData.accidentDate,
            location: formData.location,
            description: formData.description,
            remark: "",                
            status: "PENDING",         
            approved_staff: null,    
            compensation_amount: 0    
        };

        const res = await fetch("http://localhost:3000/api/claims", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        alert(data.message);
    };

    // ================= LOCATION =================
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
                    alert("Failed to fetch Location");
                } finally {
                    setLoading(false);
                }
            },
            () => setLoading(false)
        );
    };

    return (
        <div>
            <h3 className="text-start">New Claim Submission</h3>

            {/* ================= POLICY SELECT ================= */}
            <div className="mb-3">
                <label>Select Policy</label>

                <select className="form-select" onChange={handlePolicyChange}>
                    <option value="">Select Policy</option>

                    {policies.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.policy_number}
                        </option>
                    ))}
                </select>
            </div>

            {/* ================= POLICY INFO ================= */}
            {selectedPolicy && (
                <div className="card p-3 mb-3 bg-light">
                    <p><b>Vehicle:</b> {selectedPolicy.vehicle_number}</p>
                    <p><b>Model:</b> {selectedPolicy.vehicle_model}</p>


                   
                </div>
            )}

            {/* ================= COVERAGE ================= */}
            {selectedPolicy && (
                <div className="mb-3">
                    <label>Select Coverage</label>

                    <select
                        className="form-select"
                        name="coverage"
                        value={formData.coverage}
                        onChange={handleData}
                    >
                        <option value="">Select Coverage</option>
                        <option>Liability</option>
                        <option>Collision</option>
                        <option>Theft</option>
                    </select>
                </div>
            )}

            <form onSubmit={saveSubmit}>
                <div className="row bg-white p-5 border rounded-4 my-4 text-start">

                    <div className="col-md-6">

                        <div className="mb-4">
                            <label>Accident Date</label>
                            <input
                                type="date"
                                name="accidentDate"
                                value={formData.accidentDate}
                                onChange={handleData}
                                className="form-control"
                            />
                        </div>

                        <div className="mb-4">
                            <label>Accident Type</label>
                            <select
                                className="form-select"
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
                            <input
                                type="text"
                                className="form-control"
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
                                        value={formData.location}
                                        onChange={handleData}
                                    />
                                </div>

                                <div className="col-3">
                                    <button
                                        type="button"
                                        className="btn btn-warning btn-sm"
                                        onClick={getLocation}
                                        disabled={loading}
                                    >
                                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="col-md-6">

                        <div className="mb-4">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                name="description"
                                value={formData.description}
                                onChange={handleData}
                            />
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