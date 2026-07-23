import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Projected({ role, children }) {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      setMessage("Please login first.");
      setShowAlert(true);
    } else if (role && user.role !== role) {
      setMessage("You cannot access this page.");
      setShowAlert(true);
    }
  }, [user, role]);

  const handleOK = () => {
    setShowAlert(false);

    if (!user) {
      navigate("/", { replace: true }); // Login page
    } else {
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/Admin/Dashboard", { replace: true });
      } else {
        navigate("/User/Dashboard", { replace: true });
      }
    }
  };

  if (!user || (role && user.role !== role)) {
    return (
      <>
        {showAlert && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    Access Denied
                  </h5>
                </div>

                <div className="modal-body text-center">
                  <p>{message}</p>
                </div>

                <div className="modal-footer justify-content-center">
                  <button
                    className="btn btn-warning"
                    onClick={handleOK}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return children;
}

export default Projected;