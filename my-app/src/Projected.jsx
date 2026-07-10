import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Projected({ role, children }) {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      setShowAlert(true);
    }
  }, [user]);

  const handleLogin = () => {
    setShowAlert(false);
    navigate("/", { replace: true });
  };

  if (!user) {
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
                    Login Required
                  </h5>
                </div>

                <div className="modal-body text-center">
                  <p className="mb-0">
                    Please login first.
                  </p>
                </div>

                <div className="modal-footer justify-content-center">
                  <button
                    className="btn btn-warning"
                    onClick={handleLogin}
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

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default Projected;