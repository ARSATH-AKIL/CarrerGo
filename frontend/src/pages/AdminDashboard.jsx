import { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    companies: 0,
    jobs: 0,
    applications: 0,
    active_jobs: 0,
    pending_applications: 0,
    accepted_applications: 0,
    rejected_applications: 0
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [selectedCompany, setSelectedCompany] = useState(null);

  const API_URL = "https://servercarrergo.onrender.com";

  // ================================
  // LOAD DASHBOARD
  // ================================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/admin/dashboard`
      );

      if (!response.ok) {
        throw new Error("Unable to get dashboard data");
      }

      const data = await response.json();

      console.log("ADMIN DASHBOARD DATA:", data);

      const dashboardStats = data.stats || {};

      setStats({
        users: Number(dashboardStats.users) || 0,
        companies: Number(dashboardStats.companies) || 0,
        jobs: Number(dashboardStats.jobs) || 0,
        applications: Number(dashboardStats.applications) || 0,
        active_jobs: Number(dashboardStats.active_jobs) || 0,
        pending_applications:
          Number(dashboardStats.pending_applications) || 0,
        accepted_applications:
          Number(dashboardStats.accepted_applications) || 0,
        rejected_applications:
          Number(dashboardStats.rejected_applications) || 0
      });
    } catch (error) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // LOAD JOBS
  // ================================

  const loadJobs = async () => {
    try {
      setJobsLoading(true);

      const response = await fetch(
        `${API_URL}/api/jobs`
      );

      if (!response.ok) {
        throw new Error("Unable to get jobs");
      }

      const data = await response.json();

      console.log("ADMIN JOBS:", data);

      if (Array.isArray(data)) {
        setJobs(data);
      } else if (Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error(
        "ADMIN JOBS ERROR:",
        error
      );

      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadJobs();
  }, []);

  // ================================
  // DELETE JOB
  // ================================

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/jobs/${jobId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to delete job"
        );

        return;
      }

      setJobs((previousJobs) =>
        previousJobs.filter(
          (job) =>
            Number(job.id) !==
            Number(jobId)
        )
      );

      alert(
        "Job deleted successfully"
      );

      loadDashboard();
    } catch (error) {
      console.error(
        "DELETE JOB ERROR:",
        error
      );

      alert(
        "Unable to connect to CareerGo backend"
      );
    }
  };

  // ================================
  // EDIT JOB
  // ================================

  const handleEditJob = (job) => {
    alert(
      `Edit Job: ${job.title}`
    );
  };

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  // ================================
  // GET UNIQUE COMPANIES
  // ================================

  const companies = [];

  jobs.forEach((job) => {
    const companyName =
      job.company_name ||
      job.company ||
      "Company";

    const alreadyExists =
      companies.some(
        (company) =>
          company.name === companyName
      );

    if (!alreadyExists) {
      companies.push({
        name: companyName,
        email:
          job.company_email ||
          "Not available",
        location:
          job.location ||
          "Not available",
        jobs: 1
      });
    } else {
      const existingCompany =
        companies.find(
          (company) =>
            company.name ===
            companyName
        );

      existingCompany.jobs += 1;
    }
  });

  // ================================
  // SIDEBAR MENU
  // ================================

  const menuItems = [
    {
      id: "dashboard",
      icon: "⌂",
      label: "Dashboard"
    },
    {
      id: "users",
      icon: "👥",
      label: "Users"
    },
    {
      id: "companies",
      icon: "▣",
      label: "Companies"
    },
    {
      id: "jobs",
      icon: "▤",
      label: "Jobs"
    },
    {
      id: "applications",
      icon: "▧",
      label: "Applications"
    }
  ];

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">
            CG
          </div>

          <div className="admin-sidebar-title">
            CareerGo
          </div>

          <div className="admin-sidebar-loading">
            Loading...
          </div>
        </aside>

        <main className="admin-main-content">
          <div className="admin-loading">
            Loading Admin Dashboard...
          </div>
        </main>
      </div>
    );
  }

  // ================================
  // DASHBOARD
  // ================================

  const renderDashboard = () => {
    return (
      <>
        <div className="admin-main-header">
          <div>
            <span className="admin-small-title">
              ADMIN DASHBOARD
            </span>

            <h1>
              Welcome back, Admin
            </h1>

            <p>
              Manage your users, companies,
              jobs and applications.
            </p>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3>Total Users</h3>
            <h2>{stats.users}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>Total Companies</h3>
            <h2>{stats.companies}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>Total Jobs</h3>
            <h2>{stats.jobs}</h2>
          </div>

          <div className="admin-stat-card">
            <h3>Total Applications</h3>
            <h2>{stats.applications}</h2>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3>Active Jobs</h3>
            <h2>
              {stats.active_jobs}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>Pending Applications</h3>
            <h2>
              {stats.pending_applications}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>Accepted Applications</h3>
            <h2>
              {stats.accepted_applications}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>Rejected Applications</h3>
            <h2>
              {stats.rejected_applications}
            </h2>
          </div>
        </div>
      </>
    );
  };

  // ================================
  // USERS
  // ================================

  const renderUsers = () => {
    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <div>
            <h2>Users</h2>

            <p>
              Manage CareerGo users
            </p>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3>Total Users</h3>

            <h2>
              {stats.users}
            </h2>

            <p>
              Registered users
            </p>
          </div>
        </div>

        <div className="admin-company-details">
          <h2>
            User Management
          </h2>

          <div className="admin-detail-row">
            <span className="admin-detail-label">
              Total Registered Users
            </span>

            <span className="admin-detail-value">
              {stats.users}
            </span>
          </div>

          <div className="admin-detail-row">
            <span className="admin-detail-label">
              Platform
            </span>

            <span className="admin-detail-value">
              CareerGo
            </span>
          </div>

          <div className="admin-detail-row">
            <span className="admin-detail-label">
              Account Type
            </span>

            <span className="admin-detail-value">
              Job Seeker
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ================================
  // COMPANY DETAILS
  // ================================

  const renderCompanyDetails = () => {
    if (!selectedCompany) {
      return null;
    }

    const companyJobs =
      jobs.filter((job) => {
        const name =
          job.company_name ||
          job.company ||
          "Company";

        return (
          name ===
          selectedCompany.name
        );
      });

    return (
      <div className="admin-section">
        <button
          className="admin-back-btn"
          onClick={() =>
            setSelectedCompany(null)
          }
        >
          ← Back to Companies
        </button>

        <div
          className="admin-company-details"
          style={{
            marginTop: "20px"
          }}
        >
          <h2>
            {selectedCompany.name}
          </h2>

          <div className="admin-detail-row">
            <span className="admin-detail-label">
              Company Name
            </span>

            <span className="admin-detail-value">
              {selectedCompany.name}
            </span>
          </div>

          <div className="admin-detail-row">
            <span className="admin-detail-label">
              Email
            </span>

            <span className="admin-detail-value">
              {selectedCompany.email}
            </span>
          </div>

          <div className="admin-detail-row">
            <span className="admin-detail-label">
              Location
            </span>

            <span className="admin-detail-value">
              {selectedCompany.location}
            </span>
          </div>

          <div className="admin-detail-row">
            <span className="admin-detail-label">
              Posted Jobs
            </span>

            <span className="admin-detail-value">
              {companyJobs.length}
            </span>
          </div>
        </div>

        <div className="admin-job-management">
          <div className="admin-job-header">
            <div>
              <h2>
                Company Jobs
              </h2>

              <p>
                Jobs posted by{" "}
                {selectedCompany.name}
              </p>
            </div>
          </div>

          <div className="admin-job-list">
            {companyJobs.length === 0 ? (
              <div className="admin-no-jobs">
                No jobs available.
              </div>
            ) : (
              companyJobs.map((job) => (
                <div
                  className="admin-job-card"
                  key={job.id}
                >
                  <div className="admin-job-info">
                    <h3>
                      {job.title ||
                        "Untitled Job"}
                    </h3>

                    <p className="admin-job-company">
                      {selectedCompany.name}
                    </p>

                    <p className="admin-job-details">
                      Location:{" "}
                      {job.location ||
                        "Not specified"}
                    </p>

                    <p className="admin-job-details">
                      Salary:{" "}
                      {job.salary ||
                        "Not specified"}
                    </p>
                  </div>

                  <div className="admin-job-actions">
                    <button
                      className="admin-edit-btn"
                      onClick={() =>
                        handleEditJob(job)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="admin-delete-btn"
                      onClick={() =>
                        handleDeleteJob(
                          job.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // ================================
  // COMPANIES
  // ================================

  const renderCompanies = () => {
    if (selectedCompany) {
      return renderCompanyDetails();
    }

    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <div>
            <h2>
              Companies
            </h2>

            <p>
              Select a company to view
              company details
            </p>
          </div>
        </div>

        <div className="admin-company-list">
          {companies.length === 0 ? (
            <div className="admin-no-jobs">
              No companies available.
            </div>
          ) : (
            companies.map(
              (company, index) => (
                <div
                  className="admin-company-card"
                  key={index}
                  onClick={() => {
                    setSelectedCompany(
                      company
                    );
                  }}
                >
                  <h3>
                    {company.name}
                  </h3>

                  <p>
                    Email:{" "}
                    {company.email}
                  </p>

                  <p>
                    Location:{" "}
                    {company.location}
                  </p>

                  <p>
                    Jobs:{" "}
                    {company.jobs}
                  </p>

                  <span>
                    View Company Details →
                  </span>
                </div>
              )
            )
          )}
        </div>
      </div>
    );
  };

  // ================================
  // JOBS
  // ================================

  const renderJobs = () => {
    return (
      <div className="admin-job-management">
        <div className="admin-job-header">
          <div>
            <h2>
              Job Management
            </h2>

            <p>
              Manage all jobs posted
              on CareerGo
            </p>
          </div>

          <button
            className="admin-post-job-btn"
            onClick={() => {
              alert(
                "Post Job section will be added next."
              );
            }}
          >
            + Post New Job
          </button>
        </div>

        {jobsLoading ? (
          <div className="admin-no-jobs">
            <p>
              Loading jobs...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="admin-no-jobs">
            <p>
              No jobs available.
            </p>
          </div>
        ) : (
          <div className="admin-job-list">
            {jobs.map((job) => (
              <div
                className="admin-job-card"
                key={job.id}
              >
                <div className="admin-job-info">
                  <h3>
                    {job.title ||
                      "Untitled Job"}
                  </h3>

                  <p className="admin-job-company">
                    {job.company_name ||
                      job.company ||
                      "Company"}
                  </p>

                  <p className="admin-job-details">
                    Location:{" "}
                    {job.location ||
                      "Not specified"}
                  </p>

                  <p className="admin-job-details">
                    Salary:{" "}
                    {job.salary ||
                      "Not specified"}
                  </p>

                  <p className="admin-job-details">
                    Type:{" "}
                    {job.job_type ||
                      job.type ||
                      "Not specified"}
                  </p>

                  <p className="admin-job-details">
                    Skills:{" "}
                    {job.skills ||
                      "Not specified"}
                  </p>
                </div>

                <div className="admin-job-actions">
                  <button
                    className="admin-edit-btn"
                    onClick={() =>
                      handleEditJob(job)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="admin-delete-btn"
                    onClick={() =>
                      handleDeleteJob(
                        job.id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ================================
  // APPLICATIONS
  // ================================

  const renderApplications = () => {
    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <div>
            <h2>
              Applications
            </h2>

            <p>
              Manage application
              statistics
            </p>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3>
              Total Applications
            </h3>

            <h2>
              {stats.applications}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>
              Pending
            </h3>

            <h2>
              {stats.pending_applications}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>
              Accepted
            </h3>

            <h2>
              {stats.accepted_applications}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>
              Rejected
            </h3>

            <h2>
              {stats.rejected_applications}
            </h2>
          </div>
        </div>

        <div className="admin-company-details">
          <h2>
            Application Summary
          </h2>

          <div className="admin-detail-row">
            <span className="admin-detail-label">
              Total Applications
            </span>

            <span className="admin-detail-value">
              {stats.applications}
            </span>
          </div>

          <div className="admin-detail-row">
            <span className="admin-detail-label">
              Pending Applications
            </span>

            <span className="admin-detail-value">
              {stats.pending_applications}
            </span>
          </div>

          <div className="admin-detail-row">
            <span className="admin-detail-label">
              Accepted Applications
            </span>

            <span className="admin-detail-value">
              {stats.accepted_applications}
            </span>
          </div>

          <div className="admin-detail-row">
            <span className="admin-detail-label">
              Rejected Applications
            </span>

            <span className="admin-detail-value">
              {stats.rejected_applications}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // ================================
  // CONTENT SWITCH
  // ================================

  const renderContent = () => {
    switch (activeMenu) {
      case "users":
        return renderUsers();

      case "companies":
        return renderCompanies();

      case "jobs":
        return renderJobs();

      case "applications":
        return renderApplications();

      default:
        return renderDashboard();
    }
  };

  // ================================
  // MAIN UI
  // ================================

  return (
    <div className="admin-layout">

      {/* ============================
          SIDEBAR
      ============================ */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-brand">
          <div className="admin-logo">
            CG
          </div>

          <h2>
            CareerGo
          </h2>
        </div>

        <nav className="admin-sidebar-menu">

          {menuItems.map((item) => (
            <button
              key={item.id}
              className={
                activeMenu === item.id
                  ? "admin-menu-item active"
                  : "admin-menu-item"
              }
              onClick={() => {
                setActiveMenu(
                  item.id
                );

                setSelectedCompany(
                  null
                );
              }}
            >
              <span className="admin-menu-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>
            </button>
          ))}

        </nav>

        <div className="admin-sidebar-bottom">

          <div className="admin-user-box">

            <div className="admin-user-avatar">
              A
            </div>

            <div>
              <strong>
                Admin
              </strong>

              <small>
                CareerGo Admin
              </small>
            </div>

          </div>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* ============================
          MAIN CONTENT
      ============================ */}

      <main className="admin-main-content">

        {renderContent()}

      </main>

    </div>
  );
}

export default AdminDashboard;
