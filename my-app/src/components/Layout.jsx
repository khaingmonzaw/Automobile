import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faCircleUser, faSackDollar, faHandHoldingDollar, faFileInvoiceDollar, faHouseChimney } from "@fortawesome/free-solid-svg-icons";
function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const sidebarWidth = collapsed ? "80px" : "230px";

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
        <div className="p-3 text-center border-bottom ">
          <button
            className="btn btn-warning"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>
        </div>

        <ul className="list-unstyled p-3">

          <li className="mb-2">
            <NavLink
              to="/User/Dashboard"
              className={({ isActive }) =>
                `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                }`

              }
            >
              {collapsed ? <FontAwesomeIcon icon={faHouseChimney} /> :

                <><FontAwesomeIcon icon={faHouseChimney} className="me-3" />Dashboard</>

              }
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
              {collapsed ? <FontAwesomeIcon icon={faSackDollar} /> :
                <><FontAwesomeIcon icon={faSackDollar} className="me-3" /> New Claim</>
              }
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
              {collapsed ? <FontAwesomeIcon icon={faFileInvoiceDollar} /> :

                <><FontAwesomeIcon icon={faFileInvoiceDollar} className="me-3" />All Claims
                </>
              }
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink
              to="/LoginPage"
              className={({ isActive }) =>
                `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                }`
              }
            >
              {collapsed ? <FontAwesomeIcon icon={faCircleUser} /> : <><FontAwesomeIcon icon={faCircleUser} className="me-3" />Profile</>}
            </NavLink>
          </li>




        </ul>

        <ul className="list-unstyled p-3 mt-auto border-top ">
          <li className="mb-2">
            <NavLink
              to="/LoginPage"
              className={({ isActive }) =>
                `d-block p-3 rounded text-decoration-none ${isActive ? "bg-warning text-white" : "text-dark"
                }`
              }
            >
              {collapsed ? <FontAwesomeIcon icon={faRightFromBracket} />
                :
                <><FontAwesomeIcon icon={faRightFromBracket} className="me-3" />Logout</>
              }
            </NavLink>
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
          <div className="d-flex justify-content-between w-100 align-items-center">
            <h3 className="mb-0 fw-bold">AIMS</h3>


            <div className="dropdown position-relative">
              <button
                className="btn btn-warning dropdown-toggle"
                onClick={() => setOpen(!open)}
              >
                username
              </button>

              {open && (
                <ul className="dropdown-menu show"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "100%"
                  }}
                >
                  <li>
                    <button className="dropdown-item">Username</button>
                  </li>
                  <li>
                    <button className="dropdown-item">Plan Name</button>
                  </li>
                  <hr />
                  <li>
                    <button className="dropdown-item">Change Password</button>
                  </li>
                </ul>
              )}
            </div>
          </div>

        </nav>

        {/* Page Content */}
        <div className="container-fluid p-4 " style={{ minHeight: "100vh", backgroundColor: "F2F9FF" }}>
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default Layout;