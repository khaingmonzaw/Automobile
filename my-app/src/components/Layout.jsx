import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faCircleUser,
  faSackDollar,
  faFileInvoiceDollar,
  faHouseChimney,
  faUsers,
  faShieldHalved,
  faKey,
  faUser
} from "@fortawesome/free-solid-svg-icons";
function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const sidebarWidth = collapsed ? "90px" : "230px";

  const handleClick = (e) => {
    e.preventDefault();
    setShowLogout(true);

  }

  const confirmLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/LoginPage");
  };

  const handleChangePassword = () => {
    if (user?.role === "admin") {
      navigate("/Admin/PasswordChangeAdmin");
    } else {
      navigate("/User/PasswordChangeUser");
    }
  };
  return (
    <div className="d-flex ">

      {/* Sidebar */}
      <div
        className=" d-flex flex-column bg-white border-end shadow-sm position-fixed text-start "
        style={{
          width: sidebarWidth,
          height: "100vh",
          top: 0,
          left: 0,

        }}
      >



        <div className="p-3 text-end border-bottom ">


          {collapsed ? (
            <button
              className="btn me-2 "
              onClick={() => setCollapsed(!collapsed)}
            >
              ☰
            </button>
          ) : (
            <>
              <div className="d-flex justify-content-between">




                <h3 className="mb-0 fw-bold">AIMS</h3>

                <button
                  className="btn "
                  onClick={() => setCollapsed(!collapsed)}
                >


                  ☰
                </button>
              </div>


            </>
          )}

        </div>

        

          {user?.role === "user" && (
            <>
            <ul className="list-unstyled p-3">
              <li className="mb-2 ">
                <NavLink
                  to="/User/Dashboard"
                  className={({ isActive }) =>
                    `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                    }`
                  }
                >
                  {collapsed ? (
                    <FontAwesomeIcon icon={faHouseChimney} />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faHouseChimney} className="me-3" />
                      Dashboard
                    </>
                  )}
                </NavLink>
              </li>

              <li className="mb-2">
                <NavLink
                  to="/User/NewClaim"
                  className={({ isActive }) =>
                    `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                    }`
                  }
                >
                  {collapsed ? (
                    <FontAwesomeIcon icon={faSackDollar} />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSackDollar} className="me-3" />
                      New Claim
                    </>
                  )}
                </NavLink>
              </li>

              <li className="mb-2">
                <NavLink
                  to="/User/MyClaims"
                  className={({ isActive }) =>
                    `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                    }`
                  }
                >
                  {collapsed ? (
                    <FontAwesomeIcon icon={faFileInvoiceDollar} />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faFileInvoiceDollar} className="me-3" />
                      All Claims
                    </>
                  )}
                </NavLink>
              </li>

              <li className="mb-2">
                <NavLink
                  to="/User/Profile"
                  className={({ isActive }) =>
                    `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                    }`
                  }
                >
                  {collapsed ? (
                    <FontAwesomeIcon icon={faCircleUser} />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCircleUser} className="me-3" />
                      Profile
                    </>
                  )}
                </NavLink>
              </li>
              </ul>
            </>
          )}

       



        <ul className="list-unstyled p-3">

          {(user?.role === "admin" || user?.role==="staff")&& (
            <>
              <li className="mb-2">
                <NavLink
                  to="/Admin/Dashboard"
                  className={({ isActive }) =>
                    `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                    }`
                  }
                >
                  {collapsed ? (
                    <FontAwesomeIcon icon={faHouseChimney} />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faHouseChimney} className="me-3" />
                      Dashboard
                    </>
                  )}
                </NavLink>
              </li>

              <li className="mb-2">
                <NavLink
                  to="/Admin/AllClaims"
                  className={({ isActive }) =>
                    `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                    }`
                  }
                >
                  {collapsed ? (
                    <FontAwesomeIcon icon={faSackDollar} />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSackDollar} className="me-3" />
                      Claims
                    </>
                  )}
                </NavLink>
              </li>



              <li className="mb-2">
                <NavLink
                  to="/Admin/Users"
                  className={({ isActive }) =>
                    `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                    }`
                  }
                >
                  {collapsed ? (
                    <FontAwesomeIcon icon={faUsers} />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUsers} className="me-3" />
                      Users
                    </>
                  )}
                </NavLink>
              </li>



{/* Only Admin can see Staffs */}
{user?.role === "admin" && (
  <li className="mb-2">
    <NavLink
      to="/Admin/Staff"
      className={({ isActive }) =>
        `d-block p-3 rounded text-decoration-none ${
          isActive ? "bg-warning text-white" : "text-dark"
        }`
      }
    >
      {collapsed ? (
        <FontAwesomeIcon icon={faUsers} />
      ) : (
        <>
          <FontAwesomeIcon icon={faUsers} className="me-3" />
          Staffs
        </>
      )}
    </NavLink>
  </li>
)}
              <li className="mb-2">
                <NavLink
                  to="/Admin/CoverageTypes"
                  className={({ isActive }) =>
                    `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                    }`
                  }
                >
                  {collapsed ? (
                    <FontAwesomeIcon icon={faShieldHalved} />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faShieldHalved} className="me-3" />
                      Coverage
                    </>
                  )}
                </NavLink>
              </li>


               <li className="mb-2">
                <NavLink
                  to="/Admin/PasswordChangeAdmin"
                  className={({ isActive }) =>
                    `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                    }`
                  }
                >
                  {collapsed ? (
                    <FontAwesomeIcon icon={faKey} />
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faKey} className="me-3" />
                      Change Password
                    </>
                  )}
                </NavLink>
              </li>
            </>
          )}

        </ul>

        <ul className="d-flex align-items-center list-unstyled py-1 px-3 mt-auto border-top ">
          <li >
    <div
        className="d-block p-3 rounded text-dark"
        style={{ cursor: "pointer" }}
        onClick={handleClick}
    >
        {collapsed ? (
            <FontAwesomeIcon icon={faRightFromBracket} />
        ) : (
            <>
                <FontAwesomeIcon icon={faRightFromBracket} className="me-3" />
                Logout
            </>
        )}
    </div>
</li>
        </ul>
      </div>

      {/* Right Side */}
      <div
        style={{
          marginLeft: sidebarWidth,
          width: "100%",
          transition: "0.3s",
        }}
      >
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg bg-warning shadow-sm px-4 py-3 sticky-top"


        >
          <div className="d-flex w-100 align-items-center justify-content-end">

            <div className="">
              <h5
                className=""

              >
                <FontAwesomeIcon icon={faUser} className="me-2" />{user?.name}
              </h5>


            </div>
          </div>

        </nav>

        {/* Page Content */}
        <div className="container-fluid p-4" style={{ minHeight: "100vh", backgroundColor: "F2F9FF" }}>
          {showLogout && (
            <div
              className="modal fade show d-block"
              style={{ backgroundColor: "rgba(0,0,0,.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">
                      Logout Confirmation
                    </h5>

                    <button
                      className="btn-close"
                      onClick={() => setShowLogout(false)}
                    ></button>
                  </div>

                  <div className="modal-body text-center">
                    <p className="mb-0">
                      Are you sure you want to logout?
                    </p>
                  </div>

                  <div className="modal-footer justify-content-center">


                    <button
                      className="btn btn-warning"
                      onClick={confirmLogout}
                    >
                      Yes
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => setShowLogout(false)}
                    >
                      No
                    </button>



                  </div>

                </div>
              </div>
            </div>
          )}
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default Layout;