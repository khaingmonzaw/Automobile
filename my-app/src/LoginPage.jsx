import React from 'react'

function LoginPage() {
  return (
    <div className="container-fluid min-vh-100 
    d-flex align-items-center justify-content-center 
     overflow-hidden row mx-auto">

      

        {/* Left Side Text and Image*/}
        <div className="col-md-5 text-white d-flex flex-column justify-content-center align-items-center p-4">
          <h1 className="text-start">
            Automobile
            <div >
            Claim  & <span className="text-warning">Risk</span>
            </div>
            
            <div className="text-warning">

                    Assessment System
                </div></h1>
                        
          
          <img src="./public/images/LoginCar.png" alt="Login" className="img-fluid mb-3 "/>



        </div>



        {/* Right Side Login Form*/}
        <div className="col-md-5 shadow-md border border-3 rounded bg-white p-5 mx-auto">

          <h2 className="text-center mb-5">LOGIN</h2>

          <form>

            {/* Email */}
            <div className="mb-4">
              <label className="form-label d-block text-start">Email address</label>
              <input
                type="email"
                className="form-control border border-1"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="form-label d-block text-start">Password</label>
              <input
                type="password"
                className="form-control border border-1"
                placeholder="Enter your password"
              />
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