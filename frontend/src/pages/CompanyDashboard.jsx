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
          console.log("COMPANY JOBS:", data);
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
          console.log("COMPANY APPLICATIONS:", data);
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
      <div className="company-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading company dashboard...</p>
      </div>
    );
  }

  return (
    <div className="company-dashboard">

      {/* SIDEBAR */}

      <aside className="company-sidebar">

        <div className="sidebar-logo">
          <div className="logo-box">C</div>

          <div>
            <h2>CareerGo</h2>
            <span>Company Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <Link
            to="/company-dashboard"
            className="sidebar-link active"
          >
            <span className="sidebar-icon">⌂</span>
            Dashboard
          </Link>

          <Link
            to="/post-job"
            className="sidebar-link"
          >
            <span className="sidebar-icon">+</span>
            Post a Job
          </Link>

          <Link
            to="/my-jobs"
            className="sidebar-link"
          >
            <span className="sidebar-icon">▣</span>
            My Jobs
          </Link>

          <Link
            to="/applications"
            className="sidebar-link"
          >
            <span className="sidebar-icon">◉</span>
            Applications
          </Link>

          <Link
            to="/company-details"
            className="sidebar-link"
          >
            <span className="sidebar-icon">●</span>
            Company Details
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-company">

            <div className="company-avatar">
              {company.name
                ? company.name.charAt(0).toUpperCase()
                : "C"}
            </div>

            <div>
              <strong>{company.name}</strong>
              <span>{company.email}</span>
            </div>

          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="company-main">

        {/* TOP HEADER */}

        <header className="company-topbar">

          <div>
            <p className="dashboard-label">
              COMPANY DASHBOARD
            </p>

            <h1>
              Welcome back, {company.name}
            </h1>

            <p className="dashboard-subtitle">
              Manage your jobs, candidates and company profile.
            </p>
          </div>

          <Link
            to="/post-job"
            className="top-post-btn"
          >
            <span>+</span>
            Post a Job
          </Link>

        </header>

        {/* COMPANY INFO */}

        <section className="company-profile-bar">

          <div className="profile-left">

            <div className="large-company-avatar">
              {company.name
                ? company.name.charAt(0).toUpperCase()
                : "C"}
            </div>

            <div>
              <h3>{company.name}</h3>

              <p>{company.email}</p>
            </div>

          </div>

          <div className="profile-right">

            <div className="profile-item">
              <span>Role</span>
              <strong>{company.role || "Company"}</strong>
            </div>

            <div className="profile-divider"></div>

            <Link
              to="/company-details"
              className="view-profile-btn"
            >
              View Company Details
            </Link>

          </div>

        </section>

        {/* STATISTICS */}

        <section className="dashboard-section">

          <div className="section-heading">
            <div>
              <h2>Overview</h2>
              <p>Your recruitment activity at a glance.</p>
            </div>
          </div>

          <div className="statistics-grid">

            <div className="stat-card">

              <div className="stat-top">
                <div className="stat-icon">J</div>

                <span className="stat-status">
                  Active
                </span>
              </div>

              <div className="stat-number">
                {activeJobs}
              </div>

              <h3>Active Jobs</h3>

              <p>
                Currently active job posts
              </p>

            </div>

            <div className="stat-card">

              <div className="stat-top">
                <div className="stat-icon">P</div>

                <span className="stat-status">
                  Review
                </span>
              </div>

              <div className="stat-number">
                {pendingApplications}
              </div>

              <h3>Pending Applications</h3>

              <p>
                Applications waiting for review
              </p>

            </div>

            <div className="stat-card">

              <div className="stat-top">
                <div className="stat-icon">✓</div>

                <span className="stat-status">
                  Selected
                </span>
              </div>

              <div className="stat-number">
                {acceptedApplications}
              </div>

              <h3>Accepted Applications</h3>

              <p>
                Successfully accepted applicants
              </p>

            </div>

            <div className="stat-card">

              <div className="stat-top">
                <div className="stat-icon">×</div>

                <span className="stat-status">
                  Closed
                </span>
              </div>

              <div className="stat-number">
                {rejectedApplications}
              </div>

              <h3>Rejected Applications</h3>

              <p>
                Rejected applications
              </p>

            </div>

          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <h2>Quick Actions</h2>

              <p>
                Manage your company activities quickly.
              </p>
            </div>

          </div>

          <div className="quick-actions-grid">

            <Link
              to="/post-job"
              className="quick-action-card"
            >

              <div className="quick-action-icon">
                +
              </div>

              <div className="quick-action-content">
                <h3>Post a Job</h3>

                <p>
                  Create a new job opportunity and find talented candidates.
                </p>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </Link>

            <Link
              to="/my-jobs"
              className="quick-action-card"
            >

              <div className="quick-action-icon">
                J
              </div>

              <div className="quick-action-content">
                <h3>My Jobs</h3>

                <p>
                  View, edit and manage all your posted jobs.
                </p>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </Link>

            <Link
              to="/applications"
              className="quick-action-card"
            >

              <div className="quick-action-icon">
                A
              </div>

              <div className="quick-action-content">
                <h3>Applications</h3>

                <p>
                  Review candidates and manage received applications.
                </p>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </Link>

            <Link
              to="/company-details"
              className="quick-action-card"
            >

              <div className="quick-action-icon">
                C
              </div>

              <div className="quick-action-content">
                <h3>Company Details</h3>

                <p>
                  Manage your company information and profile.
                </p>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </Link>

          </div>

        </section>

        {/* RECENT JOBS + APPLICATIONS */}

        <section className="dashboard-bottom-grid">

          {/* RECENT JOBS */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>
                <h2>Recent Jobs</h2>

                <p>
                  Your latest job postings
                </p>
              </div>

              <Link
                to="/my-jobs"
                className="panel-link"
              >
                View All
              </Link>

            </div>

            {jobs.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  J
                </div>

                <h3>No Jobs Posted</h3>

                <p>
                  Start by creating your first job opportunity.
                </p>

                <Link
                  to="/post-job"
                  className="empty-btn"
                >
                  Post Your First Job
                </Link>

              </div>

            ) : (

              <div className="recent-list">

                {jobs.slice(0, 5).map((job) => {

                  const status = String(
                    job.status || "Active"
                  )
                    .toLowerCase()
                    .trim();

                  const isClosed =
                    status === "closed";

                  return (
                    <div
                      className="recent-job"
                      key={job.id}
                    >

                      <div className="recent-job-icon">
                        J
                      </div>

                      <div className="recent-job-info">

                        <h3>
                          {job.title || "Untitled Job"}
                        </h3>

                        <p>
                          {job.location || "Location not specified"}
                        </p>

                      </div>

                      <span
                        className={
                          isClosed
                            ? "job-status closed"
                            : "job-status active"
                        }
                      >
                        {isClosed
                          ? "Closed"
                          : "Active"}
                      </span>

                    </div>
                  );
                })}

              </div>

            )}

          </div>

          {/* APPLICATIONS */}

          <div className="dashboard-panel">

            <div className="panel-header">

              <div>
                <h2>Applications</h2>

                <p>
                  Latest candidate applications
                </p>
              </div>

              <Link
                to="/applications"
                className="panel-link"
              >
                View All
              </Link>

            </div>

            {applications.length === 0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  A
                </div>

                <h3>No Applications</h3>

                <p>
                  Applications from candidates will appear here.
                </p>

              </div>

            ) : (

              <div className="recent-list">

                {applications
                  .slice(0, 5)
                  .map((application, index) => {

                    const status = String(
                      application.status || "Pending"
                    )
                      .toLowerCase()
                      .trim();

                    let statusClass = "pending";

                    if (
                      status === "accepted" ||
                      status === "accept"
                    ) {
                      statusClass = "accepted";
                    }

                    if (
                      status === "rejected" ||
                      status === "reject"
                    ) {
                      statusClass = "rejected";
                    }

                    return (
                      <div
                        className="recent-application"
                        key={
                          application.id ||
                          index
                        }
                      >

                        <div className="applicant-avatar">
                          {(
                            application.name ||
                            application.user_name ||
                            "A"
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="applicant-info">

                          <h3>
                            {application.name ||
                              application.user_name ||
                              "Applicant"}
                          </h3>

                          <p>
                            {application.job_title ||
                              application.title ||
                              "Job Application"}
                          </p>

                        </div>

                        <span
                          className={`application-status ${statusClass}`}
                        >
                          {application.status ||
                            "Pending"}
                        </span>

                      </div>
                    );
                  })}

              </div>

            )}

          </div>

        </section>

        {/* FOOTER */}

        <footer className="company-dashboard-footer">

          <p>
            © 2026 CareerGo. Find Jobs. Build Careers.
          </p>

          <Link to="/company-details">
            Company Profile
          </Link>

        </footer>

      </main>

    </div>
  );
}

export default CompanyDashboard;
