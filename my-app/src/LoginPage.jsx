import * as React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
function LoginPage() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    console.log(formData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};
    if (!formData.email) {
      newErrors.email = "*Email is required"
    }

    if (!formData.password) {
      newErrors.password = "*Password is required"
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    try {

      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.role == "admin") {
          navigate("../Admin/AdminDashboard")
        } else {
          navigate("../User/Dashboard");
        }
      } else {
        setServerError(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Error")
    }

  };

  return (
    <div className="container-fluid min-vh-100 
    d-flex align-items-center justify-content-center 
     overflow-hidden row mx-auto">



      {/* Left Side Text and Image*/}
      <div className="col-md-5 text-dark d-flex flex-column justify-content-center align-items-center p-4">
        <h1 className="text-start">
          Automobile
          <div >
           Insurance Claim  & <span className="text-warning">Risk</span>
          </div>

          <div className="text-warning">

            Assessment System
          </div></h1>


        <img src="./images/LoginCar.png" alt="Login" className="img-fluid mb-3 " />



      </div>



      {/* Right Side Login Form*/}
      <div className="col-md-5 shadow-md border border-3 rounded bg-white p-5 mx-auto">

        <h2 className="text-center mb-5">LOGIN</h2>

        <form onSubmit={handleSubmit} method="POST">



          {/* Email */}
          <div className="mb-4">
            <label className="form-label d-block text-start">Email address</label>
            <input
              type="email"
              name="email"
              className={`form-control   ${errors.email ? "is-invalid" : ""} border border-1`}
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
            />


            
            <div className=" text-start"> {errors.email && (
              <small className="text-danger text-start">{errors.email}</small>
            )}</div>
            <div>
              <div className='text-start'> {serverError && (
                <small className="text-danger">
                  {serverError}
                </small>
              )}</div>
            </div>
          </div>


          {/* Password */}

          <div className="">
            <div className="mb-4">
              <label className="form-label d-block text-start">Password</label>

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Enter your password"
                  onChange={handleChange}
                  value={formData.password}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              {errors.password && (
                <small className="text-danger">{errors.password}</small>
              )}
            </div>
           

            <div>
              <div className='text-start'> {serverError && (
                <small className="text-danger">
                  {serverError}
                </small>
              )}
              </div>
            </div>
          </div>

          {/* Button */}
          <button type="submit" className="btn btn-warning w-100 py-2 my-2">
            LOGIN
          </button>


        </form>

      </div>

    </div>

  )
}

export default LoginPage