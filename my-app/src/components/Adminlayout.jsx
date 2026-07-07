import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaThList, FaHome, FaBriefcase, FaUsers, FaSignOutAlt } from "react-icons/fa";

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? "70px" : "230px";

  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Claims", icon: <FaBriefcase /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Coverage", icon: <FaBriefcase /> },
  ];

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="d-flex flex-column bg-white border-end shadow-sm position-fixed text-start"
           style={{ width: sidebarWidth, height: "100vh", transition: "0.3s", zIndex: 1000 }}>
        
        <div className="p-3 border-bottom">
          <button className="btn btn-light" onClick={() => setCollapsed(!collapsed)}>
            <FaThList />
          </button>
        </div>

        <ul className="list-unstyled p-3">
          {menuItems.map((item) => (
            <li className="mb-2" key={item.name}>
              <NavLink to={`/Admin/${item.name}`}
                className={({ isActive }) =>
                  `d-flex align-items-center p-3 rounded text-decoration-none ${
                    isActive ? "bg-warning text-dark fw-bold" : "text-dark"
                  }`
                }>
                <span className="me-3">{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        <ul className="list-unstyled p-3 mt-auto border-top">
          <li>
            <NavLink to="/LoginPage" className="d-flex align-items-center p-3 text-dark text-decoration-none">
              <span className="me-3"><FaSignOutAlt /></span>
              {!collapsed && <span>Logout</span>}
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div style={{ marginLeft: sidebarWidth, width: "100%", transition: "0.3s" }}>
        
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg bg-warning shadow-sm px-4 py-3 sticky-top">
          <h3 className="mb-0 fw-bold">AIMS</h3>
          <div className="ms-auto">
            <span className="fw-semibold">AdminZ</span>
          </div>
        </nav>

        {/* Page Content */}
        <div className="container-fluid p-4 bg-light" style={{ minHeight: "calc(100vh - 70px)" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;