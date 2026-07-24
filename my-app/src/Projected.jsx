import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Projected({ role, children }) {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // Check whether the user's role is allowed
  const hasAccess = user &&
    
  (
    Array.isArray(role)
      ? role.includes(user.role)
      : user.role === role
  );

  useEffect(() => {
    if (!user) {
      setMessage("Please login first.");
      setShowAlert(true);
    } else if (!hasAccess) {
      setMessage("You cannot access this page.");
      setShowAlert(true);
    }
  }, [user, hasAccess]);

  const handleOK = () => {
    setShowAlert(false);

    if (!user) {
      navigate("/", { replace: true });
    } 
    
     else if (user.status !== "active") {
    // inactive admin/staff/user
    navigate("/", { replace: true });
  } 
    
    else if (user.role === "admin" || user.role === "staff") {
      navigate("/Admin/Dashboard", { replace: true });
    } else {
      navigate("/User/Dashboard", { replace: true });
    }
  };

  if (!hasAccess) {
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