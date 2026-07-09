import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import LocationMap from "../components/LocationMap";

function NewClaim() {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [coverages, setCoverages] = useState([]);
  const [submit, setSubmit] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [mapPosition, setMapPosition] = useState({
    lat: 16.8409,
    lng: 96.1735,
  });

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
      .then((res) => res.json())
      .then((data) => setPolicies(data))
      .catch((err) => console.log(err));
  }, [userId]);

  // ================= POLICY CHANGE =================
  const handlePolicyChange = (e) => {
    const id = e.target.value;
    const selected = policies.find((p) => p.policy_id == id);
    setSelectedPolicy(selected);

    setErrors((prev) => ({
      ...prev,
      policy: "",
    }));

    if (id) {
      fetch(`http://localhost:3000/api/coverages/${id}`)
        .then((res) => res.json())
        .then((data) => setCoverages(data))
        .catch((err) => console.log(err));
    }
  };

  // ================= FORM CHANGE =================
  const handleData = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
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
    setErrors({});
  };

  // ================= SUBMIT (WITH PENDING DUPLICATE CHECK) =================
  const saveSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const accidentDate = new Date(formData.accidentDate);
    accidentDate.setHours(0, 0, 0, 0);
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(today.getDate() - 6);

    const newErrors = {};
    if (!selectedPolicy) {
      newErrors.policy = "*Please select a policy.";
    }

    if (!formData.accidentDate) {
      newErrors.accidentDate = "*Accident Date is required.";
    } else if (accidentDate > today) {
      newErrors.accidentDate = "*Accident Date cannot be in the future.";
    } else if (accidentDate < fiveDaysAgo) {
      newErrors.accidentDate = "*Claim must be submitted within 5 days of the accident date.";
    }

    if (
      !formData.accidentType ||
      formData.accidentType === "--Select Accident Type---"
    ) {
      newErrors.accidentType = "*Please select an accident type.";
    }

    if (!formData.claimAmount) {
      newErrors.claimAmount = "*Claim amount is required.";
    } else if (isNaN(formData.claimAmount) || Number(formData.claimAmount) <= 0) {
      newErrors.claimAmount = "*Claim amount must be greater than 0.";
    }

    if (!formData.location) {
      newErrors.location = "*Location is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "*Description is required.";
    }

    // First level validation
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 🟢 Check for existing PENDING claim for the same user, policy, and accident type 
    //myo code start
    setIsValidating(true);
    try {
      const checkUrl = `http://localhost:3000/api/claims/check-pending?policy_id=${selectedPolicy.policy_id}&accident_type=${formData.accidentType}&user_id=${userId}`;
      const res = await fetch(checkUrl);
     
// ✅ Response က OK မဟုတ်ရင် Error ထုတ်ပြီး ရပ်လိုက်
if (!res.ok) {
  const errorData = await res.json();
  throw new Error(errorData.error || "Failed to check pending claim");
}

const checkData = await res.json();

if (checkData.hasPending) {
  newErrors.accidentType = "*You already have a pending claim for this accident type under this policy.";
  setErrors(newErrors);
  return;
}
      //myo code end

      // No pending claim → show confirmation modal
      setShowConfirm(true);
    } catch (err) {
      console.error("Pending status validation failed:", err);
      alert("Something went wrong while validating claim status.");
    } finally {
      setIsValidating(false);
    }
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setSubmit(true);

    try {
      const payload = {
        user_id: userId,
        policy_id: selectedPolicy?.policy_id,
        accident_type: formData.accidentType,
        accident_date: formData.accidentDate,
        claimed_amount: formData.claimAmount,
        location: formData.location,
        description: formData.description,
        remark: "",
        status: "PENDING",
        approved_staff: null,
        compensation_amount: 0,
      };

      const res = await fetch("http://localhost:3000/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setMessage(data.message || "Claim submitted successfully.");
      setShowSuccess(true);
      handleReset();

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setMessage("Failed to submit claim.");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div>
      {showSuccess && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowSuccess(false)}
          ></button>
        </div>
      )}

      {showConfirm && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Confirm Submission</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p>Are you sure you want to submit this claim?</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button className="btn btn-warning" onClick={confirmSubmit}>
                  Submit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h3 className="fw-bold mb-4">New Claim Submission</h3>

      {/* Policy Selection */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-3">
              <label className="fw-bold mb-0">
                Select Policy<span className="text-danger">*</span>
              </label>
            </div>
            <div className="col-md-9">
              <select
                className={`form-select ${errors.policy ? "is-invalid" : ""}`}
                onChange={handlePolicyChange}
                value={selectedPolicy?.policy_id || ""}
              >
                <option value="">-- Select Policy Number --</option>
                {policies.map((p) => (
                  <option key={p.policy_id} value={p.policy_id}>
                    {p.policy_number}
                  </option>
                ))}
              </select>
              {errors.policy && <small className="text-danger">{errors.policy}</small>}
            </div>
          </div>
        </div>
      </div>

      {/* Policy Information */}
      {selectedPolicy && (
        <div className="card shadow border-0 rounded-4 mb-4">
          <div className="card-header bg-warning text-dark fw-bold">
            Policy Information
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-3">
                <p className="text-muted">Policy Number</p>
                <h5 className="fw-bold">{selectedPolicy.policy_number}</h5>
              </div>
              <div className="col-md-4 mb-3">
                <p className="text-muted">Vehicle Number</p>
                <h5 className="fw-bold">{selectedPolicy.vehicle_number}</h5>
              </div>
              <div className="col-md-4 mb-3">
                <p className="text-muted">Vehicle Model</p>
                <h5 className="fw-bold">{selectedPolicy.vehicle_model}</h5>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={saveSubmit}>
        <div className="row bg-white p-5 border rounded-4 my-4 text-start">
          <div className="col-md-6">
            <div className="mb-4">
              <label>
                Accident Date
                <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                name="accidentDate"
                value={formData.accidentDate}
                onChange={handleData}
                max={new Date().toISOString().split("T")[0]}
                className={`form-control ${errors.accidentDate ? "is-invalid" : ""}`}
              />
              {errors.accidentDate && (
                <small className="text-danger">{errors.accidentDate}</small>
              )}
            </div>

            <div className="mb-4">
              <label>
                Accident Type
                <span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.accidentType ? "is-invalid" : ""}`}
                name="accidentType"
                value={formData.accidentType}
                onChange={handleData}
              >
                <option>--Select Accident Type---</option>
                {Array.isArray(coverages) &&
                  coverages.map((c) => (
                    <option key={c.coverage_type_id} value={c.coverage_type}>
                      {c.coverage_type}
                    </option>
                  ))}
              </select>
              {errors.accidentType && (
                <small className="text-danger">{errors.accidentType}</small>
              )}
            </div>

            <div className="mb-4">
              <label>
                Claim Amount
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.claimAmount ? "is-invalid" : ""}`}
                name="claimAmount"
                value={formData.claimAmount}
                onChange={handleData}
              />
              {errors.claimAmount && (
                <small className="text-danger">{errors.claimAmount}</small>
              )}
            </div>

            <div className="mb-4">
              <label>
                Location
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.location ? "is-invalid" : ""}`}
                name="location"
                value={formData.location}
                onChange={handleData}
              />
              {errors.location && (
                <small className="text-danger">{errors.location}</small>
              )}
            </div>

            <div className="mb-4">
              <label>
                Pick Accident Location on Map
                <span className="text-danger">*</span>
              </label>
              <LocationMap
                position={mapPosition}
                setPosition={setMapPosition}
                setFormData={setFormData}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="mb-4">
              <label>
                Description
                <span className="text-danger">*</span>
              </label>
              <textarea
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleData}
              />
              {errors.description && (
                <small className="text-danger">{errors.description}</small>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button
              className="btn btn-warning"
              type="submit"
              disabled={submit || isValidating}
              style={{ width: "140px" }}
            >
              {isValidating ? "Checking..." : submit ? "Submitting" : "Submit"}
            </button>
            <button
              className="btn btn-danger"
              type="button"
              onClick={handleReset}
              style={{ width: "120px" }}
            >
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default NewClaim;