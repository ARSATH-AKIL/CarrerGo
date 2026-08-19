import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CompanyDashboard() {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
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

      fetch(
        `https://servercarrergo.onrender.com/api/company/jobs/${companyData.id}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unable to get company jobs");
          }
          return response.json();
        })
        .then((data) => {
          setJobs(data.jobs || []);
        })
        .catch((error) => {
          console.error("COMPANY JOBS ERROR:", error);
          setJobs([]);
        });

      fetch(
        `https://servercarrergo.onrender.com/api/company/applications/${companyData.id}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unable to get company applications");
          }
          return response.json();
        })
        .then((data) => {
          setApplications(data.applications || []);
        })
        .catch((error) => {
          console.error("COMPANY APPLICATIONS ERROR:", error);
          setApplications([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("COMPANY DATA ERROR:", error);
      localStorage.removeItem("company");
      navigate("/company-login");
    }
  }, [navigate]);

  const activeJobs = jobs.filter((job) => {
    const status = String(job.status || "")
      .toLowerCase()
      .trim();

    return status !== "closed";
  }).length;

  const pendingApplications = applications.filter((application) => {
    const status = String(application.status || "")
      .toLowerCase()
      .trim();

    return status === "applied" || status === "pending";
  }).length;

  const acceptedApplications = applications.filter((application) => {
    const status = String(application.status || "")
      .toLowerCase()
      .trim();

    return status === "accepted" || status === "accept";
  }).length;

  const rejectedApplications = applications.filter((application) => {
    const status = String(application.status || "")
      .toLowerCase()
      .trim();

    return status === "rejected" || status === "reject";
  }).length;

  const handleLogout = () => {
    localStorage.removeItem("company");
    navigate("/company-login");
  };

  if (!company || loading) {
    return (
      <div className="company-loading">
        <p>Loading company dashboard...</p>
      </div>
    );
  }

  return (
    <div className="company-dashboard-page">

      {/* SIDEBAR */}
      <aside className="company-sidebar">

        <div className="company-sidebar-logo">
          <div className="company-logo-box">
            C
          </div>
          <span>CareerGo</span>
        </div>

        <nav className="company-sidebar-nav">

          <Link
            to="/company-dashboard"
            className="company-sidebar-link active"
          >
            <span className="sidebar-icon">⌂</span>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/post-job"
            className="company-sidebar-link"
          >
            <span className="sidebar-icon">+</span>
            <span>Post a Job</span>
          </Link>

          <Link
            to="/my-jobs"
            className="company-sidebar-link"
          >
            <span className="sidebar-icon">▣</span>
            <span>My Jobs</span>
          </Link>

          <Link
            to="/applications"
            className="company-sidebar-link"
          >
            <span className="sidebar-icon">◉</span>
            <span>Applications</span>
          </Link>

          <Link
            to="/company-profile"
            className="company-sidebar-link"
          >
            <span className="sidebar-icon">●</span>
            <span>Company Details</span>
          </Link>

        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="company-sidebar-bottom">

          <div className="company-sidebar-profile">

            <div className="sidebar-profile-icon">
              {company.name
                ? company.name.charAt(0).toUpperCase()
                : "C"}
            </div>

            <div className="sidebar-profile-info">
              <strong>{company.name}</strong>
              <span>{company.email}</span>
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

        {/* HEADER */}
        <section className="company-dashboard-header">

          <div>
            <span className="company-dashboard-label">
              COMPANY DASHBOARD
            </span>

            <h1>
              Welcome back, {company.name}
            </h1>

            <p>
              Manage your jobs, candidates and company profile.
            </p>
          </div>

        </section>

        {/* COMPANY CARD */}
        <section className="company-info-card">

          <div className="company-info-left">

            <div className="company-main-logo">
              {company.name
                ? company.name.charAt(0).toUpperCase()
                : "C"}
            </div>

            <div className="company-main-details">
              <h2>{company.name}</h2>
              <p>{company.email}</p>
            </div>

          </div>

          <div className="company-info-right">

            <div className="company-role">
              <span>Role</span>
              <strong>{company.role || "company"}</strong>
            </div>

            <Link
              to="/company-profile"
              className="company-details-button"
            >
              View Company Details
            </Link>

          </div>

        </section>

        {/* OVERVIEW */}
        <section className="company-overview">

          <div className="overview-heading">
            <h2>Overview</h2>
            <p>Your recruitment activity at a glance.</p>
          </div>

          <div className="overview-grid">

            <div className="overview-card">

              <div className="overview-card-top">
                <div className="overview-icon">
                  J
                </div>

                <span className="overview-status">
                  Active
                </span>
              </div>

              <h3>{activeJobs}</h3>

              <strong>Active Jobs</strong>

              <p>
                Currently active job posts
              </p>

            </div>

            <div className="overview-card">

              <div className="overview-card-top">
                <div className="overview-icon">
                  P
                </div>

                <span className="overview-status">
                  Review
                </span>
              </div>

              <h3>{pendingApplications}</h3>

              <strong>Pending Applications</strong>

              <p>
                Applications waiting for review
              </p>

            </div>

            <div className="overview-card">

              <div className="overview-card-top">
                <div className="overview-icon">
                  ✓
                </div>

                <span className="overview-status">
                  Selected
                </span>
              </div>

              <h3>{acceptedApplications}</h3>

              <strong>Accepted Applications</strong>

              <p>
                Successfully accepted applicants
              </p>

            </div>

            <div className="overview-card">

              <div className="overview-card-top">
                <div className="overview-icon">
                  ×
                </div>

                <span className="overview-status">
                  Closed
                </span>
              </div>

              <h3>{rejectedApplications}</h3>

              <strong>Rejected Applications</strong>

              <p>
                Rejected applications
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default CompanyDashboard;
