import { useEffect, useState } from "react";

function AdminDashboard() {
  const API_URL = "https://servercarrergo.onrender.com";

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
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [editingJob, setEditingJob] = useState(null);
  const [savingJob, setSavingJob] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "",
    skills: ""
  });

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
      console.error("ADMIN DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

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

      if (Array.isArray(data)) {
        setJobs(data);
      } else if (Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("ADMIN JOBS ERROR:", error);
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);

      const response = await fetch(
        `${API_URL}/api/admin/users`
      );

      if (!response.ok) {
        throw new Error("Unable to get users");
      }

      const data = await response.json();

      if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("ADMIN USERS ERROR:", error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
    loadJobs();
    loadUsers();
  }, []);

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
          data.message || "Unable to delete job"
        );
        return;
      }

      setJobs((previousJobs) =>
        previousJobs.filter(
          (job) =>
            Number(job.id) !== Number(jobId)
        )
      );

      if (editingJob?.id === jobId) {
        setEditingJob(null);
      }

      alert("Job deleted successfully");

      loadDashboard();
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);

      alert(
        "Unable to connect to CareerGo backend"
      );
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);

    setEditForm({
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      salary: job.salary || "",
      type: job.type || job.job_type || "",
      skills: job.skills || ""
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleUpdateJob = async (event) => {
    event.preventDefault();

    if (!editingJob) {
      return;
    }

    try {
      setSavingJob(true);

      const response = await fetch(
        `${API_URL}/api/jobs/${editingJob.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(editForm)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Unable to update job"
        );
        return;
      }

      setJobs((previousJobs) =>
        previousJobs.map((job) =>
          Number(job.id) ===
          Number(editingJob.id)
            ? {
                ...job,
                ...editForm
              }
            : job
        )
      );

      setEditingJob(null);

      alert("Job updated successfully");

      loadDashboard();
    } catch (error) {
      console.error("UPDATE JOB ERROR:", error);

      alert(
        "Unable to connect to CareerGo backend"
      );
    } finally {
      setSavingJob(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.href = "/login";
  };

  const companies = [];

  jobs.forEach((job) => {
    const companyName =
      job.company_name ||
      job.company ||
      "Company";

    const existingCompany = companies.find(
      (company) =>
        company.name === companyName
    );

    if (!existingCompany) {
      companies.push({
        id: job.company,
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
      existingCompany.jobs += 1;
    }
  });

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
            <h2>{stats.active_jobs}</h2>
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

  const renderUsers = () => {
    if (selectedUser) {
      return (
        <div className="admin-section">
          <button
            className="admin-back-btn"
            onClick={() =>
              setSelectedUser(null)
            }
          >
            ← Back to Users
          </button>

          <div
            className="admin-company-details"
            style={{ marginTop: "20px" }}
          >
            <h2>User Details</h2>

            <div className="admin-detail-row">
              <span className="admin-detail-label">
                User ID
              </span>

              <span className="admin-detail-value">
                {selectedUser.id}
              </span>
            </div>

            <div className="admin-detail-row">
              <span className="admin-detail-label">
                Name
              </span>

              <span className="admin-detail-value">
                {selectedUser.name ||
                  "Not available"}
              </span>
            </div>

            <div className="admin-detail-row">
              <span className="admin-detail-label">
                Email
              </span>

              <span className="admin-detail-value">
                {selectedUser.email ||
                  "Not available"}
              </span>
            </div>

            <div className="admin-detail-row">
              <span className="admin-detail-label">
                Role
              </span>

              <span className="admin-detail-value">
                {selectedUser.role ||
                  "user"}
              </span>
            </div>

            <div className="admin-detail-row">
              <span className="admin-detail-label">
                Resume
              </span>

              <span className="admin-detail-value">
                {selectedUser.resume_url ? (
                  <a
                    href={`${API_URL}${selectedUser.resume_url}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Resume
                  </a>
                ) : (
                  "No resume uploaded"
                )}
              </span>
            </div>
          </div>
        </div>
      );
    }

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

        {usersLoading ? (
          <div className="admin-no-jobs">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="admin-no-jobs">
            No users available.
          </div>
        ) : (
          <div className="admin-company-list">
            {users.map((user) => (
              <div
                className="admin-company-card"
                key={user.id}
                onClick={() =>
                  setSelectedUser(user)
                }
              >
                <h3>
                  {user.name ||
                    "Unnamed User"}
                </h3>

                <p>
                  Email:{" "}
                  {user.email ||
                    "Not available"}
                </p>

                <p>
                  Role: User
                </p>

                <p>
                  Resume:{" "}
                  {user.resume_url
                    ? "Available"
                    : "Not uploaded"}
                </p>

                <span>
                  View User Details →
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCompanyDetails = () => {
    if (!selectedCompany) {
      return null;
    }

    const companyJobs = jobs.filter(
      (job) => {
        const name =
          job.company_name ||
          job.company ||
          "Company";

        return (
          name === selectedCompany.name
        );
      }
    );

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
          style={{ marginTop: "20px" }}
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
              <h2>Company Jobs</h2>

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

  const renderCompanies = () => {
    if (selectedCompany) {
      return renderCompanyDetails();
    }

    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <div>
            <h2>Companies</h2>

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
                  onClick={() =>
                    setSelectedCompany(
                      company
                    )
                  }
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

  const renderJobs = () => {
    return (
      <div className="admin-job-management">
        <div className="admin-job-header">
          <div>
            <h2>Job Management</h2>

            <p>
              Manage all jobs posted
              on CareerGo
            </p>
          </div>
        </div>

        {jobsLoading ? (
          <div className="admin-no-jobs">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="admin-no-jobs">
            No jobs available.
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
                    {job.type ||
                      job.job_type ||
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

        {editingJob && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px"
            }}
          >
            <div
              style={{
                background: "#fff",
                width: "100%",
                maxWidth: "650px",
                maxHeight: "90vh",
                overflowY: "auto",
                borderRadius: "12px",
                padding: "25px"
              }}
            >
              <h2>Edit Job</h2>

              <form
                onSubmit={handleUpdateJob}
              >
                <div
                  style={{
                    marginBottom: "15px"
                  }}
                >
                  <label>
                    Job Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px"
                    }}
                  />
                </div>

                <div
                  style={{
                    marginBottom: "15px"
                  }}
                >
                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      editForm.description
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    rows="5"
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px"
                    }}
                  />
                </div>

                <div
                  style={{
                    marginBottom: "15px"
                  }}
                >
                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={
                      editForm.location
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px"
                    }}
                  />
                </div>

                <div
                  style={{
                    marginBottom: "15px"
                  }}
                >
                  <label>
                    Salary
                  </label>

                  <input
                    type="text"
                    name="salary"
                    value={editForm.salary}
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px"
                    }}
                  />
                </div>

                <div
                  style={{
                    marginBottom: "15px"
                  }}
                >
                  <label>
                    Job Type
                  </label>

                  <input
                    type="text"
                    name="type"
                    value={editForm.type}
                    onChange={
                      handleEditChange
                    }
                    required
                    placeholder="Full Time / Part Time / Internship"
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px"
                    }}
                  />
                </div>

                <div
                  style={{
                    marginBottom: "20px"
                  }}
                >
                  <label>
                    Skills
                  </label>

                  <input
                    type="text"
                    name="skills"
                    value={editForm.skills}
                    onChange={
                      handleEditChange
                    }
                    required
                    placeholder="Python, React, MySQL"
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "5px"
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px"
                  }}
                >
                  <button
                    type="submit"
                    className="admin-edit-btn"
                    disabled={savingJob}
                  >
                    {savingJob
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    className="admin-delete-btn"
                    onClick={() =>
                      setEditingJob(null)
                    }
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderApplications = () => {
    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <div>
            <h2>Applications</h2>

            <p>
              Manage application
              statistics
            </p>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3>Total Applications</h3>
            <h2>
              {stats.applications}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>Pending</h3>
            <h2>
              {stats.pending_applications}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>Accepted</h3>
            <h2>
              {stats.accepted_applications}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>Rejected</h3>
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

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <div className="admin-logo">
            CG
          </div>

          <h2>CareerGo</h2>
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
                setActiveMenu(item.id);
                setSelectedCompany(null);
                setSelectedUser(null);
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
              <strong>Admin</strong>

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

      <main className="admin-main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default AdminDashboard;
