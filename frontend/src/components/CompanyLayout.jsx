import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../CompanyLayout.css";

function CompanyLayout() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const storedCompany = localStorage.getItem("company");

    if (!storedCompany) {
      navigate("/company-login");
      return;
    }

    try {
      const companyData = JSON.parse(storedCompany);
      setCompany(companyData);
    } catch (error) {
      console.error("COMPANY DATA ERROR:", error);
      localStorage.removeItem("company");
      navigate("/company-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("company");
    navigate("/company-login");
  };

  if (!company) {
    return (
      <div className="company-loading">
        <p>Loading...</p>
      </div>
    );
  }

  const companyName = company.name || "Company";
  const companyEmail = company.email || "";
  const firstLetter = companyName.charAt(0).toUpperCase();

  return (
    <div className="company-layout">

      {/* SIDEBAR */}
      <aside className="company-sidebar">

        {/* LOGO */}
        <div className="company-logo-area">
          <div className="company-logo">
            <span>CG</span>
          </div>

          <div className="company-logo-text">
            CareerGo
          </div>
        </div>

        {/* SIDEBAR NAVIGATION */}
        <nav className="company-sidebar-nav">

          <NavLink
            to="/company-dashboard"
            className={({ isActive }) =>
              `company-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/post-job"
            className={({ isActive }) =>
              `company-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">+</span>
            <span>Post a Job</span>
          </NavLink>

          <NavLink
            to="/my-jobs"
            className={({ isActive }) =>
              `company-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">▣</span>
            <span>My Jobs</span>
          </NavLink>

          <NavLink
            to="/applications"
            className={({ isActive }) =>
              `company-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">◉</span>
            <span>Applications</span>
          </NavLink>

          <NavLink
            to="/company-profile"
            className={({ isActive }) =>
              `company-nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">●</span>
            <span>Company Details</span>
          </NavLink>

        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="company-sidebar-bottom">

          <div className="company-sidebar-profile">

            <div className="company-avatar-small">
              {firstLetter}
            </div>

            <div className="company-sidebar-info">
              <strong>{companyName}</strong>
              <span>{companyEmail}</span>
            </div>

          </div>

          <button
            type="button"
            className="company-sidebar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="company-main-content">
        <Outlet />
      </main>

    </div>
  );
}

export default CompanyLayout;
