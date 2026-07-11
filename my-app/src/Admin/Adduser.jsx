import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as mmNrc from "mm-nrc";

function AddUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [showAlert, setShowAlert] = useState(false);
const [alertMessage, setAlertMessage] = useState("");
const [alertType, setAlertType] = useState("warning");
  const [errors, setErrors] = useState({});
  const [coverageOptions, setCoverageOptions] = useState([]); // Database မှလာမည့် Coverage များ
  // Consistent yellow border style
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
    let age = 0;
    const nameRegex = /^[a-zA-Z\s\u1000-\u109F]+$/;
    const emailRegex = /^[^0-9][a-zA-Z0-9._%+-]+@[a-zA-Z]{4,}\.[a-zA-Z]{3,}$/;
    const phoneRegex = /^09\d{9}$/;
    const licenseRegex = /^[A-D]\/[A-Z]{2,4}-\d{5,6}$/;
    const vehicleNoRegex = /^[0-9]{1,2}[A-Z]-[0-9]{4}$/;
    const policyRegex = /^POL-\d+$/;
    console.log("formData =", formData);
    // Full Name 
    if (!formData.fullName|| formData.fullName.trim() === "") {
      newErrors.fullName = "*Full Name is required";
    } else if (!nameRegex.test(formData.fullName)) {
      newErrors.fullName = "*Full Name must not contain digits or special characters";
    }
    //email
    if (!formData.email.trim()) {
      newErrors.email = "*Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    //Phone
    if (!formData.phone.trim()) {
      newErrors.phone = "*Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "*Phone number must start with 09 and contain 11 digits";
    }
    //DOB
    if (!formData.dob) {
      newErrors.dob = "*Date of Birth is required";
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();

      // age 18
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dob = "*You must be at least 18 years old";
      }
      else if (age > 99) {
        newErrors.dob = "*Age must be under 100 years";
      }
    }
    //license
    if (!formData.driverLicense.trim()) {
      newErrors.driverLicense = "*Driver License is required";
    } else if (!licenseRegex.test(formData.driverLicense.toUpperCase())) {
      newErrors.driverLicense = "*Format error! Example: A/YGN-123456";
    } else if (formData.driverLicense.length < 10) {
      newErrors.driverLicense = "*Driver License must be at least 10 characters";
    }

    // ၂။ Driving Duration check
    if (!formData.drivingYear) {
      newErrors.drivingYear = "*Driving duration is required";
    } else {
      const duration = parseInt(formData.drivingYear);
      // logic: အသက် (Age) - duration = စမောင်းတဲ့အချိန်အသက် (Age at start)
      if (isNaN(duration) || duration < 0 || duration > 80) {
        newErrors.drivingYear = "*Please enter a valid duration (0 - 80 years)";
      } else if ((age - duration) < 18) {
        // ဥပမာ - အသက် ၁၈ နှစ်၊ duration ၄ နှစ်ဆိုရင် ၁၄ နှစ်ကတည်းက စမောင်းတာဖြစ်လို့ Invalid ဖြစ်မယ်
        newErrors.drivingYear = "Invalid experience: You cannot start driving before 18 years old";
      }
    }
    // Address
    if (!formData.address.trim()) {
      newErrors.address = "*Address is required";
    }
    //Vehicle
    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = "*Vehicle Model is required";
    }
    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = "*Vehicle Number is required";
    } else if (!vehicleNoRegex.test(formData.vehicleNumber.toUpperCase())) {
      newErrors.vehicleNumber = "*Invalid format. Example: 1Y-1234";
    }
    //Policy
    /*if (!formData.policyNumber.trim()) {
      newErrors.policyNumber = "*Policy Number is required";
    } else if (!policyRegex.test(formData.policyNumber)) {
      newErrors.policyNumber = "*Invalid format! Example: POL-0001";
    }

    else if (formData.policyNumber.length < 8) {
      newErrors.policyNumber = "*Policy Number must be at least 8 characters";
    }*/

    // Start Date
    if (!formData.startDate) {
      newErrors.startDate = "*Start Date is required";
    }

    // End Date
    if (!formData.endDate) {
      newErrors.endDate = "*End Date is required";
    } else if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate <= startDate) {
        newErrors.endDate = "*End Date must be greater than Start Date";
      }

       // Calculate minimum end date (6 months after start date)
  const minEndDate = new Date(startDate);
  minEndDate.setMonth(minEndDate.getMonth() + 6);


  if (endDate < minEndDate) {
    newErrors.endDate = "*End Date must be at least 6 months after Start Date";
  }
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", dob: "", nrcState: "",
    nrcTownship: "", nrcType: "N", nrcNumber: "", address: "",
    driverLicense: "", drivingYear: "", vehicleModel: "",
    vehicleNumber: "", modelYear: "", policyNumber: "",
    coverage: [], startDate: "", endDate: "", coverageLimit: "" ,
    monthlyPremium: "",  totalPremium: ""  , policyDuration: ""
     
  });

  // Fetch coverage options
  useEffect(() => {
    fetch("http://localhost:3000/api/coverage_types")
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({ ...prev, policyNumber: data.policyNumber }));
  //const activeOnly = data.filter(item => item.status === 'active');
  console.log("Database မှရလာသော အချက်အလက်များ:", data);
  setCoverageOptions(data);
})
      .catch(err => console.error("Error fetching coverage:", err));
  }, []);
  
  useEffect(() => {
    if (isEditMode) {
      fetch(`http://localhost:3000/api/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
          const formatDate = (dateStr) => {
          if (!dateStr) return "";
          // 'T' ဆိုတဲ့ အမှတ်အသားနေရာမှာ ဖြတ်ထုတ်လိုက်ရင် YYYY-MM-DD သီးသန့်ကျန်ခဲ့ပါမယ်
          return dateStr.split("T")[0]; 
        };
          setFormData(prev => ({ ...prev, policyNumber: data.newPolicyNumber }));
    
          // NRC Parsing
          let nrcS = "", nrcT = "", nrcTy = "N", nrcN = "";
          if (data.nrc) {
            const match = data.nrc.match(/([^\/]*)\/([a-zA-Z-]+)\(([a-zA-Z])\)(\d+)/);
            if (match) { [nrcS, nrcT, nrcTy, nrcN] = [match[1], match[2], match[3], match[4]]; }
          }
        const coverageIds = data.coverageTypeIds 
      ? data.coverageTypeIds.split(',').map(id => Number(id.trim())) 
      : [];
    const limitStrings = data.coverageLimit ? data.coverageLimit.toString().split(',') : [];
    const totalLimit = limitStrings.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    
    const duration = parseInt(data.policyDuration) || 12;
    const premiums = calculatePremiums(totalLimit, duration);
          
    // Map the database response to your formData state
          setFormData({
            
            fullName: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            dob: data.dob ? data.dob.split('T')[0] : "",
            nrcState: nrcS,
            nrcTownship: nrcT,
            nrcType: nrcTy,
            nrcNumber: nrcN,
            address: data.address || "",
            driverLicense: data.driver_license || "",
            drivingYear: data.driver_year || "",
            vehicleModel: data.vehicleModel || "",
            vehicleNumber: data.vehicleNumber || "",
            modelYear: data.model_year || "",
            policyNumber: data.policyNumber || "",
            coverage: coverageIds,
            startDate:data.startDate,
            endDate: data.endDate,
            coverageLimit: data.coverageLimit || "" ,
            policyDuration: duration.toString() ,           
            monthlyPremium:premiums.monthlyPremium, // Database column name ကို သေချာစစ်ပါ
            totalPremium: premiums.totalPremium,     // Database column name ကို သေချာစစ်ပါ
          });
        })
        .catch((err) => console.error("Error fetching user for edit:", err));
    }
  }, [isEditMode, id]);
  const states = mmNrc.getNrcStates();
  const types = mmNrc.getNrcTypes();
  const allTownships = mmNrc.getNrcTownships();
  const selectedState = states.find(
    state => state.number.en === formData.nrcState
  );

  const townships = selectedState
    ? mmNrc.getNrcTownshipsByStateId(selectedState.id)
    : [];
  
  const calculateTotalLimit = (limitString) => {

  if (!limitString) return 0;

  return limitString
    .toString()
    .split(',')
    .reduce(
      (sum, val) => sum + (parseFloat(val.replace(/,/g, "")) || 0),
      0
    );

};

  const calculatePremiums = (limit, months) => {

  // prevent NaN
  const limitNum = parseFloat(limit) || 0;
  const monthsNum = parseInt(months) || 12;

  const rate = 0.05;
  const serviceFee = 1000;

  const yearlyTotal = limitNum * rate;

  let total = 0;
  let monthly = 0;

  if (monthsNum === 6) {

    total = (yearlyTotal / 2) + serviceFee;
    monthly = total / 6;

  } else {

    const years = monthsNum / 12;
    total = yearlyTotal * years;
    monthly = total / monthsNum;

  }

  return {
    totalPremium: total.toFixed(2),
    monthlyPremium: monthly.toFixed(2)
  };
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
    // ၁။ လက်ရှိ input value ကို အရင် update လုပ်ပါ
    const updated = { ...prev, [name]: value };

    // ၂။ startDate နှင့် policyDuration ရှိနေမှသာ endDate ကို တွက်ချက်ပါ
    if (updated.startDate && updated.policyDuration) {
      //const start = new Date(updated.startDate);
      //const end = new Date(start);
     // ၁။ Start Date String ကို (YYYY-MM-DD) အဖြစ် ခွဲယူပါ
      const [y, m, d] = updated.startDate.split('-').map(Number);
      
      // ၂။ လပေါင်းကို ပေါင်းပြီး Date Object တည်ဆောက်ပါ
      const dateObj = new Date(y, m - 1, d); 
      dateObj.setMonth(dateObj.getMonth() + parseInt(updated.policyDuration));
      
      // ၃။ Timezone အလွှဲအပြောင်းမဖြစ်စေရန် ဤနည်းဖြင့်သာ ပြန်ယူပါ
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      
      updated.endDate = `${year}-${month}-${day}`;
    }
    // ၃။ Premium တွက်ချက်မှု Logic ကို ဆက်လက်လုပ်ဆောင်ပါ
       
    
    const totalLimit = calculateTotalLimit(updated.coverageLimit);
    
    const months = parseInt(updated.policyDuration) || 12;
    const premiums = calculatePremiums(totalLimit, months);
    updated.totalPremium = premiums.totalPremium;
    updated.monthlyPremium = premiums.monthlyPremium;
    
    return updated;
  });
  };
  const handleCheckboxChange = (id) => {
    setFormData(prev => {
      const newCoverage = prev.coverage.includes(id)
        ? prev.coverage.filter(c => c !== id)
        : [...prev.coverage, id];

      // ၂။ ရွေးထားတဲ့ Coverage အားလုံးအတွက် Limit စုစုပေါင်းကို တွက်ချက်ခြင်း
      let newTotalLimit = 0;
      newCoverage.forEach(cId => {
        const option = coverageOptions.find(o => Number(o.coverage_type_id) === Number(cId));
        if (option && option.coverage_limit) {
        const val = parseFloat(option.coverage_limit.toString().replace(/,/g, '')) || 0;
        newTotalLimit += val;
        }
      });
       const duration = prev.policyDuration || 12;
       const premiums = calculatePremiums(
      newTotalLimit,
      duration
    );

      return {
        ...prev,
        coverage: newCoverage,
        coverageLimit: newTotalLimit.toString(),// တွက်ပြီးသား Limit ကို Auto ထည့်ပေးခြင်း
        totalPremium: premiums.totalPremium,
        monthlyPremium: premiums.monthlyPremium
      };
    });
  };
  //   const checklicenseExists = async (driverLicense) => {
  //     if (!driverLicense) return;

  //     // Edit Mode ဆိုရင် Validation ကို ခဏရပ်ထားရန် (သို့မဟုတ်) Edit Mode အတွက် စစ်ဆေးရန်
  //     if (isEditMode) return;

  //     try {
  // const response = await fetch(
  //   `http://localhost:3000/api/check-driverlicense?driverLicense=${encodeURIComponent(driverLicense)}`
  // );      const data = await response.json();

  //       if (data.isUsed) {
  //         setErrors(prev => ({ ...prev, driverLicense: "This License no is already in use!" }));
  //       } else {
  //         setErrors(prev => {
  //           const newErrors = { ...prev };
  //           delete newErrors.driverLicense;
  //           return newErrors;
  //         });
  //       }
  //     } catch (error) {
  //       console.error("License check error:", error);
  //     }





  //   };


  const checkPolicyExists = async (policyNum) => {
    if (!policyNum) return;

    // Edit Mode ဆိုရင် Validation ကို ခဏရပ်ထားရန် (သို့မဟုတ်) Edit Mode အတွက် စစ်ဆေးရန်
    if (isEditMode) return;

    try {
      const response = await fetch(`http://localhost:3000/api/check-policy?number=${policyNum}`);
      const data = await response.json();

      if (data.isUsed) {
        setErrors(prev => ({ ...prev, policyNumber: "Your policy no is already in use!" }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.policyNumber;
          return newErrors;
        });
      }
    } catch (error) {
      console.error("Policy check error:", error);
    }
  };

  const checkVehicleExists = async (vehicleNumber) => {
    if (!vehicleNumber) return;

    // Edit Mode ဆိုရင် Validation ကို ခဏရပ်ထားရန် (သို့မဟုတ်) Edit Mode အတွက် စစ်ဆေးရန်
    if (isEditMode) return;

    try {
      const response = await fetch(`http://localhost:3000/api/check-vehicle?vehicle_number=${vehicleNumber}`);
      const data = await response.json();

      if (data.isUsed) {
        setErrors(prev => ({ ...prev, vehicleNumber: "The Vehicle number is already in use!" }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.vehicleNumber;
          return newErrors;
        });
      }
    } catch (error) {
      console.error("Policy check error:", error);
    }
  };
  const handleSave = async () => {
    const cleanCoverageLimit = formData.coverageLimit.toString().replace(/,/g, '');
    if (validate()) {
      if (formData.coverage.length === 0) {
showCustomAlert(
  "Please select at least one coverage type.",
  "warning"
);        return;
      }
     const limit = calculateTotalLimit(formData.coverageLimit);
      const duration = parseInt(formData.policyDuration) || 12;
     const premiums = calculatePremiums(limit, duration);
      const fullNrc = `${formData.nrcState}/${formData.nrcTownship}(${formData.nrcType})${formData.nrcNumber}`;
      console.log("Current Form NRC :", fullNrc);
      // ဥပမာ - Email တစ်ခုတည်းကိုပဲ စစ်မယ်ဆိုရင်
      // const checkDuplicate = async (field, value) => {

      //   if (!value) return false;

      //   const res = await fetch(
      //     `http://localhost:3000/api/check-duplicate?field=${field}&value=${encodeURIComponent(value)}&userId=${id || ""}`
      //   );

      //   const data = await res.json();

      //   if (data.isUsed) {

      //     setErrors(prev => ({
      //       ...prev,
      //       [field]: `This ${field.replace("_", " ")} is already registered`
      //     }));

      //     return true;
      //   }

      //   return false;
      // };

      // သုံးတဲ့အခါ
      // if (await checkDuplicate('email', formData.email)) return;
      // if (await checkDuplicate('phone', formData.phone)) return;
      // if (await checkDuplicate("driver_license", formData.driverLicense)) return;

      // if (await checkDuplicate("vehicle_number", formData.vehicleNumber)) return;

      // if (await checkDuplicate("policy_number", formData.policyNumber)) return;
      // ... စသဖြင့် ဆက်စစ်သွားလို့ရပါတယ်
      const dataToSend = {
        ...formData,
        nrc: fullNrc,
        coverageLimit: cleanCoverageLimit,
        totalPremium: premiums.totalPremium,     // တွက်ပြီးသားတန်ဖိုး
        monthlyPremium: premiums.monthlyPremium, // တွက်ပြီးသားတန်ဖိုး
        policyDuration: duration
      };
        console.log("Sending Data:", dataToSend);
      const url = isEditMode ? `http://localhost:3000/api/update-user/${id}` : "http://localhost:3000/api/add-user";
      const method = isEditMode ? "PUT" : "POST";
      try {

        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
        const result = await response.json();

if (response.ok) {
const successMsg = isEditMode ? "Update user successfully!" : "Save successfully!";
showCustomAlert(
  result.message || "Success",
  "success"
);

setTimeout(() => {
  navigate('/Admin/Users');
}, 1500);  //navigate('/Admin/Users');

} else {

  showCustomAlert(
  "Error: " + result.message,
  "danger"
);

}
      } catch (error) {
        console.error("Error:", error);
        showCustomAlert(
  "Connection Error to Server",
  "danger"
);
      }
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

        <div className={`modal-header bg-${alertType} text-white`}>

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
)}
      <div className="mb-2 text-start">
        <button
          className="btn btn-warning d-flex align-items-center justify-content-center text-dark p-0"
          style={{ width: "40px", height: "36px", borderRadius: "8px" }}
          onClick={() => navigate('/Admin/Users')}
          aria-label="Back to coverage list"
        >
          {/* Centered, Bold/Thick Vector Arrow Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </div>

      <div className="container mt-4 bg-white p-4 shadow-sm rounded text-start">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold">{isEditMode ? "🚗 Edit User" : "🚗 Add New User"}</h4>

        </div>

        <div className="row ">
          <div className="col-md-6 ">
            <SectionHeader icon="👤" title="User Information" />
            {renderRow("Full Name", <input name="fullName" value={formData.fullName ?? ""} onChange={handleInputChange} className={`form-control form-control-sm ${errors.fullName ? "is-invalid" : ""
              }`} style={inputStyle} />,
              errors.fullName)}
            {renderRow("Email", <input name="email" value={formData.email ?? ""} onChange={handleInputChange} className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""
              }`} style={inputStyle} />,
              errors.email)}
            {renderRow("Phone", <input name="phone" value={formData.phone ?? "" } onChange={handleInputChange} className={`form-control form-control-sm ${errors.phone ? "is-invalid" : ""
              }`} style={inputStyle} />, errors.phone)}
            {renderRow("DOB", <input name="dob" type="date" value={formData.dob ?? ""} onChange={handleInputChange} className={`form-control form-control-sm ${errors.dob ? "is-invalid" : ""
              }`} style={inputStyle} />, errors.dob)}
            {renderRow("Driver License", <input name="driverLicense" value={formData.driverLicense?? ""} onChange={handleInputChange} className={`form-control form-control-sm ${errors.driverLicense ? "is-invalid" : ""
              }`} style={inputStyle} placeholder="A/YGN-123456" />, errors.driverLicense)}
            {renderRow("Driving Year", <input name="drivingYear" type="number" value={formData.drivingYear ?? "" } onChange={handleInputChange} className={`form-control form-control-sm ${errors.driver_year ? "is-invalid" : ""
              }`} style={inputStyle} />, errors.drivingYear)}
            {renderRow("NRC", (
              <div className="d-flex gap-1">
                <select name="nrcState" className="form-select form-select-sm" value={formData.nrcState ?? ""} onChange={handleInputChange} style={inputStyle}>
                  <option value="">Select</option>
                  {states.map((s) => <option key={s.id} value={s.number.en}>{s.number.en}</option>)}
                </select>
                <select name="nrcTownship" className="form-select form-select-sm" value={formData.nrcTownship ?? "" } onChange={handleInputChange} style={inputStyle}>
                  <option value="">Select</option>
                  {townships.map((t) => <option key={t.id} value={t.code}>{t.short.en}</option>)}
                </select>
                <select name="nrcType" className="form-select form-select-sm" value={formData.nrcType ?? "" } onChange={handleInputChange} style={inputStyle}>
                  {types.map((t) => <option key={t.id} value={t.name.en}>{t.name.en}</option>)}
                </select>
                <input name="nrcNumber" type="text" className="form-control form-control-sm" value={formData.nrcNumber ?? "" } onChange={handleInputChange} maxLength={6} style={inputStyle} />
              </div>
            ), errors.nrcNumber)}

            {renderRow("Address", <input name="address" value={formData.address ?? ""} onChange={handleInputChange} className={`form-control form-control-sm ${errors.address ? "is-invalid" : ""
              }`} style={inputStyle} />, errors.address)}

            <SectionHeader icon="🚗" title="Vehicle Information" />
            {renderRow("Vehicle Model", <input name="vehicleModel" value={formData.vehicleModel ?? ""} onChange={handleInputChange} className={`form-control form-control-sm ${errors.vehicleModel ? "is-invalid" : ""
              }`} style={inputStyle} />, errors.vehicleModel)}
            {renderRow("Vehicle Number", <input name="vehicleNumber" value={formData.vehicleNumber?? ""} onChange={handleInputChange} onBlur={(e) => checkVehicleExists(e.target.value)} className={`form-control form-control-sm ${errors.vehicleNumber ? "is-invalid" : ""
              }`} style={inputStyle} />, errors.vehicleNumber)}
            {renderRow("Model Year", (
              <select name="modelYear" className="form-select form-select-sm" value={formData.modelYear?? ""} onChange={handleInputChange} style={inputStyle}>
                <option value="">Select Year</option>
                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            ))}
          </div>

          <div className="col-md-6">
            <SectionHeader icon="🛡" title="Policy Information" />
            { isEditMode && (renderRow("Policy Number", <input name="policyNumber" value={formData.policyNumber || ""} readOnly  className={`form-control form-control-sm ${errors.policyNumber ? "is-invalid" : ""
              }`} style={inputStyle} />, errors.policyNumber))}

            <div className="row mb-2" style={{ fontSize: '0.85rem', textAlign: 'left' }}>
              <label className="col-sm-4 col-form-label fw-bold">Coverage Type</label>
              <div className="col-sm-8 d-flex flex-column align-items-start">
                {coverageOptions.map((item) => (
                  <div className="form-check" key={item.coverage_type_id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={formData.coverage.includes(Number(item.coverage_type_id))}
                      onChange={() => handleCheckboxChange(item.coverage_type_id)}
                    />
                    <label className="form-check-label">{item.coverage_type}</label>
                  </div>
                ))}
              </div>
            </div>
            {renderRow("Policy Duration", (
          <select 
           name="policyDuration" 
           value={formData.policyDuration || ""} 
           onChange={handleInputChange} 
           className="form-control form-control-sm" 
          style={inputStyle}
          >
             <option value="">Select Duration</option>
             <option value="6">6 Months</option>
             <option value="12">12 Months</option>
             <option value="24">24 Months</option>
          </select>
           ))}

            {renderRow(
              "Start Date",
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
                className={`form-control form-control-sm ${errors.startDate ? "is-invalid" : ""
                  }`}
                style={inputStyle}
              />,
              errors.startDate
            )}{renderRow(
              "End Date",
              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                readOnly
                className={`form-control form-control-sm ${errors.endDate ? "is-invalid" : ""
                  }`}
                style={inputStyle}
              />,
              errors.endDate
            )}       {renderRow("Coverage Limit", <input name="coverageLimit" value={formData.coverageLimit?? ""} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
                     {renderRow("Monthly Premium", <input name="monthlyPremium"  value={formData.monthlyPremium?? ""} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
                     {renderRow("Total Premium", <input name="totalPremium"  value={formData.totalPremium?? ""} onChange={handleInputChange} className="form-control form-control-sm" style={inputStyle} />)}
          </div>
        </div>
         
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn  fw-bold" style={{ backgroundColor: '#f4d03f', color: '#000', border: 'none', width: '100px' }} onClick={handleSave}>Save</button>
          <button className="btn  fw-bold" style={{ backgroundColor: '#f93e3e', color: 'white', border: 'none' , width: '100px'}} onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </div>
    </>
  );
}

export default AddUser;