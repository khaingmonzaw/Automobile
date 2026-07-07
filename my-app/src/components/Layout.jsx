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
  faShieldHalved
} from "@fortawesome/free-solid-svg-icons";
function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
const navigate = useNavigate();
  const user=JSON.parse(localStorage.getItem('user'));
  const sidebarWidth = collapsed ? "90px" : "230px";

  const handleClick=(e)=>{
    e.preventDefault();
    const confirmLogout=window.confirm("Do You want to Logout");
    if(confirmLogout){
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate('/LoginPage');
    }

  }

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
        <div className="p-3 text-center border-bottom ">
          <button
            className="btn btn-warning"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>
        </div>

         <ul className="list-unstyled p-3">

  {user?.role === "user" && (
    <>
      <li className="mb-2">
        <NavLink
          to="/User/Dashboard"
          className={({ isActive }) =>
            `d-block p-3 rounded text-decoration-none ${
              isActive ? "bg-warning text-white" : "text-dark"
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
            `d-block p-3 rounded text-decoration-none ${
              isActive ? "bg-warning text-white" : "text-dark"
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
            `d-block p-3 rounded text-decoration-none ${
              isActive ? "bg-warning text-white" : "text-dark"
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
            `d-block p-3 rounded text-decoration-none ${
              isActive ? "bg-warning text-white" : "text-dark"
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
    </>
  )}

</ul>



<ul className="list-unstyled p-3">

  {user?.role === "admin" && (
    <>
      <li className="mb-2">
        <NavLink
          to="/Admin/AdminDashboard"
          className={({ isActive }) =>
            `d-block p-3 rounded text-decoration-none ${
              isActive ? "bg-warning text-white" : "text-dark"
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
            `d-block p-3 rounded text-decoration-none ${
              isActive ? "bg-warning text-white" : "text-dark"
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
        {/* <li className="mb-2">
  <NavLink
    to="/admin/claims" 
    className={({ isActive }) =>
      `d-block p-3 rounded text-decoration-none ${
        isActive ? "bg-warning text-white" : "text-dark"
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
</li> */}

{/* ❌ အဟောင်း: /Admin/ClaimListExample သို့သွားထားသည် */}
<li className="mb-2">
  <NavLink
    to="/Admin/Users" 
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
        Users
      </>
    )}
  </NavLink>
      </li>


        <li className="mb-2">
        <NavLink
          to="/Admin/CoverageTypes"
          className={({ isActive }) =>
            `d-block p-3 rounded text-decoration-none ${
              isActive ? "bg-warning text-white" : "text-dark"
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
    </>
  )}

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
                <><FontAwesomeIcon icon={faRightFromBracket} className="me-3" /><button className="btn" type="button" onClick={handleClick}>Logout</button></>
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
                {user?.name}
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
                    <button className="dropdown-item">{user?.name}</button>
                  </li>
                  <li>
                    <button className="dropdown-item">{user?.email}</button>
                  </li>
                  <hr />
                  <li>
                    <button className="dropdown-item" onClick={handleChangePassword}>Change Password</button>
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