import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? "70px" : "230px";

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
                `d-block p-3 rounded text-decoration-none ${
                  isActive ? "bg-warning text-white" : "text-dark"
                }`
              }
            >
              {collapsed ? "D" : " Dashboard"}
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink
              to="/User/NewClaims"
              className={({ isActive }) =>
                `d-block p-3 rounded text-decoration-none ${
                  isActive ? "bg-warning text-white" : "text-dark"
                }`
              }
            >
              {collapsed ? "N" : " New Claims"}
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
              {collapsed ? "M" : " My Claims"}
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
              {collapsed ? "P" : "Profile"}
            </NavLink>
          </li>


         

        </ul>

  <ul className="list-unstyled p-3 mt-auto border-top ">
  <li className="mb-2">
    <NavLink
      to="/LoginPage"
      className={({ isActive }) =>
        `d-block p-3 rounded text-decoration-none ${
          isActive ? "bg-warning text-white" : "text-dark"
        }`
      }
    >
      {collapsed ? "L" : "Logout"}
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
        <nav className="navbar navbar-expand-lg bg-warning shadow-sm px-4 py-3 sticky-top">
          <h3 className="mb-0 fw-bold">AIMS</h3>

          <div className="ms-auto">
            <span className="fw-semibold"> UserName</span>
          </div>
        </nav>

        {/* Page Content */}
        <div className="container-fluid p-4 bg-light" style={{ minHeight: "100vh" }}>
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default Layout;