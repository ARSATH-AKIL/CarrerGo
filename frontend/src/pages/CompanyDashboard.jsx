import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CompanyDashboard.css";

function CompanyDashboard() {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState({
    jobs: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCompany = localStorage.getItem("company");

    if (!storedCompany) {
      navigate("/company-login");
      return;
    }

    try {
      const companyData = JSON.parse(storedCompany);
      setCompany(companyData);
      loadDashboard(companyData);
    } catch (error) {
      console.error("Company data error:", error);
      localStorage.removeItem("company");
      navigate("/company-login");
    }
  }, [navigate]);

  const loadDashboard = async (companyData) => {
    try {
      const companyId =
        companyData.id ||
        companyData.company_id ||
        companyData.user_id;

      let jobs = [];

      if (companyId) {
        const jobsResponse = await fetch(
          `https://carrergo.onrender.com/api/company/jobs/${companyId}`
        );

        if (jobsResponse.ok) {
          jobs = await jobsResponse.json();
        }
      }

      let applications = [];

      try {
        const applicationResponse = await fetch(
          "https://carrergo.onrender.com/api/applications"
        );

        if (applicationResponse.ok) {
          applications = await applicationResponse.json();
        }
      } catch (error) {
        console.log("Applications could not be loaded");
      }

      const companyApplications = applications.filter((application) => {
        return (
          String(application.company_id) === String(companyId) ||
          String(application.companyId) === String(companyId)
        );
      });

      const pending = companyApplications.filter(
        (application) =>
          application.status?.toLowerCase() === "pending"
      ).length;

      const accepted = companyApplications.filter(
        (application) =>
          application.status?.toLowerCase() === "accepted"
      ).length;

      const rejected = companyApplications.filter(
        (application) =>
          application.status?.toLowerCase() === "rejected"
      ).length;

      setStats({
        jobs: jobs.length,
        pending,
        accepted,
        rejected
      });
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("company");
    navigate("/company-login");
  };

  if (loading) {
    return (
      <div className="company-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  const companyName =
    company.company_name ||
    company.companyName ||
    company.name ||
    "Company";

  const companyEmail =
    company.email ||
    company.company_email ||
    "company@email.com";

  const companyId =
    company.id ||
    company.company_id ||
    company.user_id ||
    "-";

  const companyInitial = companyName.charAt(0).toUpperCase();

  return (
    <div className="company-layout">

      {/* SIDEBAR */}

      <aside className="company-sidebar">

        <div className="company-logo-area">
          <div className="company-logo">
            CG
          </div>

          <span className="company-logo-text">
            CareerGo
          </span>
        </div>

        <nav className="company-sidebar-nav">

          <Link
            to="/company-dashboard"
            className="company-nav-item active"
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/post-job"
            className="company-nav-item"
          >
            <span className="nav-icon">+</span>
            <span>Post a Job</span>
          </Link>

          <Link
            to="/my-jobs"
            className="company-nav-item"
          >
            <span className="nav-icon">▣</span>
            <span>My Jobs</span>
          </Link>

          <Link
            to="/applications"
            className="company-nav-item"
          >
            <span className="nav-icon">◉</span>
            <span>Applications</span>
          </Link>

          <Link
            to="/company-profile"
            className="company-nav-item"
          >
            <span className="nav-icon">●</span>
            <span>Company Details</span>
          </Link>

        </nav>

        <div className="company-sidebar-bottom">

          <div className="company-sidebar-profile">

            <div className="company-avatar-small">
              {companyInitial}
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

        <div className="company-dashboard-page">

          {/* HEADER */}

          <header className="company-dashboard-header">

            <div className="company-header-text">

              <span className="company-page-label">
                COMPANY DASHBOARD
              </span>

              <h1>
                Welcome back, {companyName}
              </h1>

              <p>
                Manage your jobs, candidates and company profile.
              </p>

            </div>

          </header>

          {/* COMPANY SUMMARY */}

          <section className="company-summary-card">

            <div className="company-summary-left">

              <div className="company-large-avatar">
                {companyInitial}
              </div>

              <div className="company-summary-details">

                <h2>
                  {companyName}
                </h2>

                <p>
                  {companyEmail}
                </p>

              </div>

            </div>

            <div className="company-summary-right">

              <div className="company-role">

                <span>
                  Role
                </span>

                <strong>
                  company
                </strong>

              </div>

              <Link
                to="/company-profile"
                className="view-company-button"
              >
                View Company Details
              </Link>

            </div>

          </section>

          {/* OVERVIEW */}

          <section className="company-overview">

            <div className="section-heading">

              <h2>
                Overview
              </h2>

              <p>
                Your recruitment activity at a glance.
              </p>

            </div>

            <div className="overview-grid">

              {/* ACTIVE JOBS */}

              <div className="overview-card">

                <div className="overview-card-top">

                  <div className="overview-icon">
                    J
                  </div>

                  <span className="overview-status">
                    Active
                  </span>

                </div>

                <div className="overview-number">
                  {stats.jobs}
                </div>

                <h3>
                  Active Jobs
                </h3>

                <p>
                  Currently active job posts
                </p>

              </div>

              {/* PENDING */}

              <div className="overview-card">

                <div className="overview-card-top">

                  <div className="overview-icon">
                    P
                  </div>

                  <span className="overview-status">
                    Review
                  </span>

                </div>

                <div className="overview-number">
                  {stats.pending}
                </div>

                <h3>
                  Pending Applications
                </h3>

                <p>
                  Applications waiting for review
                </p>

              </div>

              {/* ACCEPTED */}

              <div className="overview-card">

                <div className="overview-card-top">

                  <div className="overview-icon">
                    ✓
                  </div>

                  <span className="overview-status">
                    Selected
                  </span>

                </div>

                <div className="overview-number">
                  {stats.accepted}
                </div>

                <h3>
                  Accepted Applications
                </h3>

                <p>
                  Successfully accepted applicants
                </p>

              </div>

              {/* REJECTED */}

              <div className="overview-card">

                <div className="overview-card-top">

                  <div className="overview-icon">
                    ×
                  </div>

                  <span className="overview-status">
                    Closed
                  </span>

                </div>

                <div className="overview-number">
                  {stats.rejected}
                </div>

                <h3>
                  Rejected Applications
                </h3>

                <p>
                  Rejected applications
                </p>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default CompanyDashboard;
