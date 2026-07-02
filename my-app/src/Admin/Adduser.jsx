import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as mmNrc from "mm-nrc";

function AddUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Consistent yellow border style
  const inputStyle = { borderColor: '#F3D955', outline: 'none', boxShadow: 'none' };

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

  const handleCheckboxChange = (type) => {
    setFormData(prev => {
      const coverage = prev.coverage.includes(type) 
        ? prev.coverage.filter(c => c !== type) 
        : [...prev.coverage, type];
      return { ...prev, coverage };
    });
  };

  const renderRow = (label, input) => (
    <div className="row mb-2" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
      <label className="col-sm-4 col-form-label fw-bold text-dark" style={{ textAlign: 'left' }}>{label}</label>
      <div className="col-sm-8">{input}</div>
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
        <h4 className="fw-bold">{isEditMode ? "🚗 Edit Customer" : "🚗 Add New Customer"}</h4>
        <button className="btn btn-sm fw-bold" style={{ backgroundColor: '#F3D955', color: '#000', border: 'none' }} onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="row">
        <div className="col-md-6">
          <SectionHeader icon="👤" title="Customer Information" />
          {renderRow("Full Name", <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
          {renderRow("Email", <input name="email" value={formData.email} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
          {renderRow("Phone", <input name="phone" value={formData.phone} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
          {renderRow("DOB", <input name="dob" type="date" value={formData.dob} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
          
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

          {renderRow("Address", <input name="address" value={formData.address} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}

          <SectionHeader icon="🚗" title="Vehicle Information" />
          {renderRow("Vehicle Model", <input name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
          {renderRow("Vehicle Number", <input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
          {renderRow("Model Year", (
            <select name="modelYear" className="form-select form-select-sm" value={formData.modelYear} onChange={handleInputChange} style={inputStyle}>
              <option value="">▼ Select Year</option>
              {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          ))}
        </div>

        <div className="col-md-6">
          <SectionHeader icon="🛡" title="Policy Information" />
          {renderRow("Policy Number", <input name="policyNumber" value={formData.policyNumber} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
          
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
        <button className="btn btn-sm px-4 fw-bold" style={{ backgroundColor: '#f4d03f', color: '#000', border: 'none' }}>Save</button>
        <button className="btn btn-sm px-4 fw-bold" style={{ backgroundColor: '#f93e3e', color: '#000', border: 'none' }} onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </div>
  );
}

export default AddUser;