import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import * as mmNrc from "mm-nrc";

function AddStaff() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("warning");
    const [errors, setErrors] = useState({});
    const [coverageOptions, setCoverageOptions] = useState([]);

    const inputStyle = { borderColor: '#A0CFFF', outline: 'none', boxShadow: 'none' };





    //alert box


    const showCustomAlert = (message, type = "warning") => {
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
    };
    //validation
    const validate = () => {
        let newErrors = {};

        const nameRegex = /^[a-zA-Z\s\u1000-\u109F]+$/;
        const emailRegex = /^[^0-9][a-zA-Z0-9._%+-]+@[a-zA-Z]{4,}\.[a-zA-Z]{3,}$/;
        const phoneRegex = /^09\d{9}$/;

        // Full Name
        if (!formData.fullName.trim()) {
            newErrors.fullName = "*Full Name is required";
        } else if (!nameRegex.test(formData.fullName)) {
            newErrors.fullName =
                "*Full Name must not contain digits or special characters";
        }

        // Email
        if (!formData.email.trim()) {
            newErrors.email = "*Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "*Please enter a valid email";
        }

        // Phone
        if (!formData.phone.trim()) {
            newErrors.phone = "*Phone number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone =
                "*Phone number must start with 09 and contain 11 digits";
        }

        // DOB
        if (!formData.dob) {
            newErrors.dob = "*Date of Birth is required";
        } else {
            const birthDate = new Date(formData.dob);
            const today = new Date();

            let age = today.getFullYear() - birthDate.getFullYear();

            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            if (age < 18) {
                newErrors.dob = "*You must be at least 18 years old";
            } else if (age > 99) {
                newErrors.dob = "*Age must be under 100 years";
            }
        }

        // NRC
        if (!formData.nrcState)
            newErrors.nrcState = "*State is required";

        if (!formData.nrcTownship)
            newErrors.nrcTownship = "*Township is required";

        if (!formData.nrcNumber.trim())
            newErrors.nrcNumber = "*NRC Number is required";

        // Address
        if (!formData.address.trim()) {
            newErrors.address = "*Address is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };
    const [formData, setFormData] = useState({
        fullName: "", email: "", phone: "", dob: "", nrcState: "",
        nrcTownship: "", nrcType: "N", nrcNumber: "", address: ""


    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const states = mmNrc.getNrcStates();
    const types = mmNrc.getNrcTypes();
    const allTownships = mmNrc.getNrcTownships();
    const selectedState = states.find(
        state => state.number.en === formData.nrcState
    );

    const townships = selectedState
        ? mmNrc.getNrcTownshipsByStateId(selectedState.id)
        : [];







    const handleSave = async () => {
        if (!validate()) return;

        try {
            const response = await fetch(
                "http://localhost:3000/api/add_staff",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (response.ok) {
                showCustomAlert("Staff added successfully.", "success");

                setTimeout(() => {
                    navigate("/Admin/Staff");
                }, 1000);
            } else {
                showCustomAlert(data.message, "danger");
            }
        } catch (err) {
            console.log(err);
            showCustomAlert("Server Error", "danger");
        }
    };
    const renderRow = (label, input, error) => (
        <div className="row mb-2" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
            <label className="col-sm-4 col-form-label fw-bold text-dark" style={{ textAlign: 'left' }}>{label}</label>
            <div className="col-sm-8">{input}
                {error && <small className="text-danger d-block mt-1">{error}</small>}
            </div>
        </div>
    );

    const SectionHeader = ({ icon, title }) => (
        <h5 className="fw-bold my-3 pb-2 border-bottom" style={{ color: '#F3D955', borderColor: '#34495e', textAlign: 'left' }}>
            {icon} {title}
        </h5>
    );


    return (
        <>

            {showAlert && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content shadow">

                            <div className={`modal-header bg-light text-dark`}>

                                <h5 className="modal-title fw-bold">
                                    {
                                        alertType === "success"
                                            ? "Success"
                                            : alertType === "danger"
                                                ? "Error"
                                                : "Warning"
                                    }
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAlert(false)}
                                >
                                </button>

                            </div>


                            <div className="modal-body text-center">

                                <p className="fw-semibold mb-0">
                                    {alertMessage}
                                </p>

                            </div>


                            <div className="modal-footer justify-content-center">

                                <button
                                    className={`btn btn-${alertType} fw-bold px-4`}
                                    onClick={() => setShowAlert(false)}
                                >
                                    OK
                                </button>

                            </div>


                        </div>

                    </div>

                </div>
            )}   <div className="mb-2 text-start">
                <Link to="/Admin/Staff" className="text-decoration-none text-dark" >
                    <button className='btn btn-warning'>
                        <FontAwesomeIcon icon={faCircleLeft} />
                    </button></Link>
            </div>

            <div className="container mt-4 bg-white p-4 shadow-sm rounded text-start">
                <div className="d-flex justify-content-center align-items-center mb-4">
                    <h3 className="fw-bold ">Add New Staff</h3>

                </div>

                <div className="row mx-auto px-3">
                    <div className="col-md-10 ">
                        <SectionHeader icon="" title="Staff Information" />
                        {renderRow( <>
    Full Name <span className="text-danger">*</span>
  </> , <input name="fullName" value={formData.fullName ?? ""} onChange={handleInputChange} className={`form-control  ${errors.fullName ? "is-invalid" : ""
                            }`} style={inputStyle} />,
                            errors.fullName)}
                        {renderRow( <>
    Email <span className="text-danger">*</span>
  </>, <input name="email" value={formData.email ?? ""} onChange={handleInputChange} className={`form-control ${errors.email ? "is-invalid" : ""
                            }`} style={inputStyle} />,
                            errors.email)}
                        {renderRow( <>
    Phone <span className="text-danger">*</span>
  </>, <input name="phone" value={formData.phone ?? ""} onChange={handleInputChange} className={`form-control ${errors.phone ? "is-invalid" : ""
                            }`} style={inputStyle} />, errors.phone)}
                        {renderRow( <>
    DOB <span className="text-danger">*</span>
  </>, <input name="dob" type="date" value={formData.dob ?? ""} onChange={handleInputChange} className={`form-control ${errors.dob ? "is-invalid" : ""
                            }`} style={inputStyle} />, errors.dob)}

                        {renderRow( <>
    NRC <span className="text-danger">*</span>
  </>, (
                            <div className="d-flex gap-1">
                                <select name="nrcState" className="form-select " value={formData.nrcState ?? ""} onChange={handleInputChange} style={inputStyle}>
                                    <option value="">Select</option>
                                    {states.map((s) => <option key={s.id} value={s.number.en}>{s.number.en}</option>)}
                                </select>
                                <select name="nrcTownship" className="form-select " value={formData.nrcTownship ?? ""} onChange={handleInputChange} style={inputStyle}>
                                    <option value="">Select</option>
                                    {townships.map((t) => <option key={t.id} value={t.code}>{t.short.en}</option>)}
                                </select>
                                <select name="nrcType" className="form-select " value={formData.nrcType ?? ""} onChange={handleInputChange} style={inputStyle}>
                                    {types.map((t) => <option key={t.id} value={t.name.en}>{t.name.en}</option>)}
                                </select>
                                <input name="nrcNumber" type="text" className="form-control " value={formData.nrcNumber ?? ""} onChange={handleInputChange} maxLength={6} style={inputStyle} />
                            </div>
                        ), errors.nrcState ||
                        errors.nrcTownship ||
                        errors.nrcNumber)}

                        {renderRow( <>
   Address <span className="text-danger">*</span>
  </>, <input name="address" value={formData.address ?? ""} onChange={handleInputChange} className={`form-control  ${errors.address ? "is-invalid" : ""
                            }`} style={inputStyle} />, errors.address)}





                    </div>


                </div>

                <div className="d-flex justify-content-center gap-3 mt-4">
                    <button className="btn  fw-bold" style={{ backgroundColor: '#f4d03f', color: '#000', border: 'none', width: '100px' }} onClick={handleSave}>Save</button>
                    <button className="btn  fw-bold" style={{ backgroundColor: '#f93e3e', color: 'white', border: 'none', width: '100px' }} onClick={() => navigate(-1)}>Cancel</button>
                </div>
            </div>
        </>
    );
}

export default AddStaff;