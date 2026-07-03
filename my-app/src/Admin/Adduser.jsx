import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as mmNrc from "mm-nrc";

function AddUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [errors, setErrors] = useState({});

  // Consistent yellow border style
  const inputStyle = { borderColor: '#A0CFFF', outline: 'none', boxShadow: 'none' };
  //validation
const validate = () => {
  let newErrors = {};
  let age = 0;
  const nameRegex = /^[a-zA-Z\s\u1000-\u109F]+$/;
  const emailRegex = /^[^0-9][a-zA-Z0-9._%+-]+@[a-zA-Z]{4,}\.[a-zA-Z]{3,}$/;
  const phoneRegex = /^09\d{9}$/;
  const licenseRegex = /^[A-D]\/[A-Z]{2,4}-\d{5,6}$/;
  const vehicleNoRegex = /^[0-9]{1,2}[A-Z]-[0-9]{4,5}$/;
  const policyRegex = /^POL-\d{4}$/;
  // Full Name 
  if (!formData.fullName.trim()) {
    newErrors.fullName = "Full Name is required";
  } else if (!nameRegex.test(formData.fullName)) {
    newErrors.fullName = "Full Name must not contain digits or special characters";
  }
  //email
  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = "Please enter a valid email address";
  }
  //Phone
   if (!formData.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!phoneRegex.test(formData.phone)) {
    newErrors.phone = "Phone number must start with 09 and contain 11 digits";
  }
  //DOB
  if (!formData.dob) {
    newErrors.dob = "Date of Birth is required";
  } else {
    const birthDate = new Date(formData.dob);
    const today = new Date();
    
    // age 18
     age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18 ) {
      newErrors.dob = "You must be at least 18 years old";
    }
    else if (age > 99) {
    newErrors.dob = "Age must be under 100 years";
  }
  }
  //license
  if (!formData.driverLicense.trim()) {
    newErrors.driverLicense = "Driver License is required";
  } else if (!licenseRegex.test(formData.driverLicense.toUpperCase())) {
    newErrors.driverLicense = "Format error! Example: A/YGN-123456";
  }

  // ၂။ Driving Duration check
  if (!formData.drivingYear) {
    newErrors.drivingYear = "Driving duration is required";
  } else {
    const duration = parseInt(formData.drivingYear);
    // logic: အသက် (Age) - duration = စမောင်းတဲ့အချိန်အသက် (Age at start)
    if (isNaN(duration) || duration < 0 || duration > 80) {
      newErrors.drivingYear = "Please enter a valid duration (0 - 80 years)";
    } else if ((age - duration) < 18) {
      // ဥပမာ - အသက် ၁၈ နှစ်၊ duration ၄ နှစ်ဆိုရင် ၁၄ နှစ်ကတည်းက စမောင်းတာဖြစ်လို့ Invalid ဖြစ်မယ်
      newErrors.drivingYear = "Invalid experience: You cannot start driving before 18 years old";
    }
  }
  // Address
  if (!formData.address.trim()) {
    newErrors.address= "Address is required";
  } else if (!nameRegex.test(formData.address)) {
    newErrors.address = "Address must not contain digits or special characters";
  }
  //Vehicle
  if (!formData.vehicleModel.trim()) {
  newErrors.vehicleModel = "Vehicle Model is required";
}
if (!formData.vehicleNumber.trim()) {
  newErrors.vehicleNumber = "Vehicle Number is required";
} else {
  //  ( 1A/1234)
  if (!vehicleNoRegex.test(formData.vehicleNumber.toUpperCase())) {
    newErrors.vehicleNumber = "Invalid format. Use (e.g., 1Y-1234)";
  }
}
//Policy
const validatePolicy = (policyNumber, usedPolicies) => {
const policyValue = policyNumber.trim().toUpperCase();
if (!policyValue) {
    newErrors.policyNumber = "Policy number is required";
  }
if (!policyRegex.test(policyValue)) {
    newErrors.policyNumber = "Invalid format! Example: POL-0001";
  } /*else {
    ၂။ Database ထဲမှာ ရှိ/မရှိ စစ်ဆေးခြင်း
    try {
      const response = await fetch(`/api/check-policy?number=${policyValue}`);
      const data = await response.json();
      
      if (data.isUsed) {
        newErrors.policyNumber = "This policy has already been used!";
      }
    } catch (error) {
      console.error("Database check failed:", error);
      newErrors.policyNumber = "Error checking policy. Please try again.";
    }
  }*/
}
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", dob: "", nrcState: "", 
    nrcTownship: "", nrcType: "N", nrcNumber: "", address: "", 
    driverLicense: "", drivingYear: "", vehicleModel: "", 
    vehicleNumber: "", modelYear: "", policyNumber: "", 
    coverage: [], startDate: "", endDate: "", coverageLimit: ""
  });

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        fullName: "Tia Bett", email: "tiabett@gmail.com", phone: "09123456789",
        dob: "1995-05-15", nrcState: "12", nrcTownship: "LAGANA", nrcType: "N", 
        nrcNumber: "123456", address: "Yangon", driverLicense: "DL-123", 
        drivingYear: "2023", vehicleModel: "Honda Fit", vehicleNumber: "3P-8452", 
        modelYear: "2020", policyNumber: "PLC001", coverage: ["Third Party"], 
        startDate: "2023-12-01", endDate: "2025-12-01", coverageLimit: "5000000"
      });
    }
  }, [isEditMode, id]);

  const states = mmNrc.getNrcStates();
  const types = mmNrc.getNrcTypes();
  const allTownships = mmNrc.getNrcTownships();
  const townships = formData.nrcState ? mmNrc.getNrcTownshipsByStateId(formData.nrcState) : allTownships;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
    const handleSave = () => {
    if (validate()) {
      alert("Form saved successfully!");
      // ဒီနေရာမှာ API call သို့မဟုတ် data သိမ်းမည့် function ကို ထည့်ပါ
    }
  };
  const handleCheckboxChange = (type) => {
    setFormData(prev => {
      const coverage = prev.coverage.includes(type) 
        ? prev.coverage.filter(c => c !== type) 
        : [...prev.coverage, type];
      return { ...prev, coverage };
    });
  };

  const renderRow = (label, input , error) => (
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
    <div className="container mt-4 bg-white p-4 shadow-sm rounded text-start">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">{isEditMode ? "🚗 Edit User" : "🚗 Add New User"}</h4>
         <div className="mb-2 text-start">
        <button 
          className="btn btn-warning d-flex align-items-center justify-content-center text-dark p-0" 
          style={{ width: "40px", height: "36px", borderRadius: "8px" }}
          onClick={() =>  navigate('/Admin/Users')} 
          aria-label="Back to coverage list"
        >
          {/* Centered, Bold/Thick Vector Arrow Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </div>
      </div>

      <div className="row ">
        <div className="col-md-6 ">
          <SectionHeader icon="👤" title="User Information" />
          {renderRow("Full Name", <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />,
        errors.fullName )}
          {renderRow("Email", <input name="email" value={formData.email} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} /> ,
        errors.email )}
          {renderRow("Phone", <input name="phone" value={formData.phone} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} /> , errors.phone)}
          {renderRow("DOB", <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />, errors.dob)}
          {renderRow("Driver License", <input name="driverLicense" value={formData.driverLicense} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} placeholder="A/YGN-123456" />, errors.driverLicense)}
          {renderRow("Driving Year", <input name="drivingYear" type="number" value={formData.drivingYear} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} /> , errors.drivingYear)}
          {renderRow("NRC", (
            <div className="d-flex gap-1">
              <select name="nrcState" className="form-select form-select-sm" value={formData.nrcState} onChange={handleInputChange} style={inputStyle}>
                <option value="">Select</option>
                {states.map((s) => <option key={s.id} value={s.id}>{s.number.en}</option>)}
              </select>
              <select name="nrcTownship" className="form-select form-select-sm" value={formData.nrcTownship} onChange={handleInputChange} style={inputStyle}>
                <option value="">Select</option>
                {townships.map((t) => <option key={t.id} value={t.code}>{t.short.en}</option>)}
              </select>
              <select name="nrcType" className="form-select form-select-sm" value={formData.nrcType} onChange={handleInputChange} style={inputStyle}>
                {types.map((t) => <option key={t.id} value={t.name.en}>{t.name.en}</option>)}
              </select>
              <input name="nrcNumber" type="text" className="form-control form-control-sm" value={formData.nrcNumber} onChange={handleInputChange} maxLength={6} style={inputStyle} />
            </div>
          ))}

          {renderRow("Address", <input name="address" value={formData.address} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} /> , errors.address)}

          <SectionHeader icon="🚗" title="Vehicle Information" />
          {renderRow("Vehicle Model", <input name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} /> , errors.vehicleModel)}
          {renderRow("Vehicle Number", <input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} /> , errors.vehicleNumber)}
          {renderRow("Model Year", (
            <select name="modelYear" className="form-select form-select-sm" value={formData.modelYear} onChange={handleInputChange} style={inputStyle}>
              <option value="">▼ Select Year</option>
              {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          ))}
        </div>

        <div className="col-md-6">
          <SectionHeader icon="🛡" title="Policy Information" />
          {renderRow("Policy Number", <input name="policyNumber" value={formData.policyNumber} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} /> , errors.policyNumber)}
          
          <div className="row mb-2" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
            <label className="col-sm-4 col-form-label fw-bold">Coverage Type</label>
            <div className="col-sm-8 d-flex flex-column align-items-start">
              {["Third Party", "Comprehensive", "Fire"].map((type) => (
                <div className="form-check" key={type}>
                  <input className="form-check-input" type="checkbox" checked={formData.coverage.includes(type)} onChange={() => handleCheckboxChange(type)} style={inputStyle} />
                  <label className="form-check-label">{type}</label>
                </div>
              ))}
            </div>
          </div>

          {renderRow("Start Date", <input name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
          {renderRow("End Date", <input name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
          {renderRow("Coverage Limit", <input name="coverageLimit" value={formData.coverageLimit} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <button className="btn btn-sm px-4 fw-bold" style={{ backgroundColor: '#f4d03f', color: '#000', border: 'none' }} onClick={handleSave}>Save</button>
        <button className="btn btn-sm px-4 fw-bold" style={{ backgroundColor: '#f93e3e', color: '#000', border: 'none' }} onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </div>
  );
}

export default AddUser;