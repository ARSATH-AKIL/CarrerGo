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

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);

  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

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
        throw new Error(
          "Unable to get dashboard data"
        );
      }

      const data = await response.json();

      const dashboardStats = data.stats || {};

      setStats({
        users:
          Number(dashboardStats.users) || 0,
        companies:
          Number(dashboardStats.companies) || 0,
        jobs:
          Number(dashboardStats.jobs) || 0,
        applications:
          Number(dashboardStats.applications) || 0,
        active_jobs:
          Number(dashboardStats.active_jobs) || 0,
        pending_applications:
          Number(
            dashboardStats.pending_applications
          ) || 0,
        accepted_applications:
          Number(
            dashboardStats.accepted_applications
          ) || 0,
        rejected_applications:
          Number(
            dashboardStats.rejected_applications
          ) || 0
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

  const loadUsers = async () => {
    try {
      setUsersLoading(true);

      const response = await fetch(
        `${API_URL}/api/admin/users`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to get users"
        );
      }

      const data = await response.json();

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : []
      );
    } catch (error) {
      console.error(
        "ADMIN USERS ERROR:",
        error
      );

      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadCompanies = async () => {
    try {
      setCompaniesLoading(true);

      const response = await fetch(
        `${API_URL}/api/admin/companies`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to get companies"
        );
      }

      const data = await response.json();

      setCompanies(
        Array.isArray(data.companies)
          ? data.companies
          : []
      );
    } catch (error) {
      console.error(
        "ADMIN COMPANIES ERROR:",
        error
      );

      setCompanies([]);
    } finally {
      setCompaniesLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      setJobsLoading(true);

      const response = await fetch(
        `${API_URL}/api/jobs`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to get jobs"
        );
      }

      const data = await response.json();

      setJobs(
        Array.isArray(data.jobs)
          ? data.jobs
          : Array.isArray(data)
          ? data
          : []
      );
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
    loadUsers();
    loadCompanies();
    loadJobs();
  }, []);

  const handleUserClick = async (user) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${user.id}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to get user details"
        );
      }

      const data = await response.json();

      setSelectedUser(data.user || user);
    } catch (error) {
      console.error(
        "USER DETAILS ERROR:",
        error
      );

      setSelectedUser(user);
    }
  };

  const handleCompanyClick = async (
    company
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/companies/${company.id}`
      );

      if (!response.ok) {
        throw new Error(
          "Unable to get company details"
        );
      }

      const data = await response.json();

      setSelectedCompany(
        data.company || company
      );
    } catch (error) {
      console.error(
        "COMPANY DETAILS ERROR:",
        error
      );

      setSelectedCompany(company);
    }
  };

  const getCompanyJobs = (companyId) => {
    return jobs.filter(
      (job) =>
        Number(job.company) ===
        Number(companyId)
    );
  };

  const handleEditJob = (job) => {
    setEditingJob(job);

    setEditForm({
      title: job.title || "",
      description:
        job.description || "",
      location:
        job.location || "",
      salary:
        job.salary || "",
      type:
        job.type ||
        job.job_type ||
        "",
      skills:
        job.skills || ""
    });
  };

  const handleEditChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setEditForm(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );
  };

  const handleUpdateJob = async (
    event
  ) => {
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
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            title:
              editForm.title,
            description:
              editForm.description,
            location:
              editForm.location,
            salary:
              editForm.salary,
            type:
              editForm.type,
            skills:
              editForm.skills
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to update job"
        );
        return;
      }

      alert(
        "Job updated successfully"
      );

      setEditingJob(null);

      await loadJobs();
      await loadDashboard();
    } catch (error) {
      console.error(
        "UPDATE JOB ERROR:",
        error
      );

      alert(
        "Unable to connect to CareerGo backend"
      );
    } finally {
      setSavingJob(false);
    }
  };

  const handleDeleteJob = async (
    jobId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this job?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/jobs/${jobId}`,
        {
          method: "DELETE"
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to delete job"
        );
        return;
      }

      setJobs(
        (previousJobs) =>
          previousJobs.filter(
            (job) =>
              Number(job.id) !==
              Number(jobId)
          )
      );

      alert(
        "Job deleted successfully"
      );

      await loadDashboard();
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

  const handleLogout = () => {
    localStorage.removeItem(
      "admin"
    );

    localStorage.removeItem(
      "adminUser"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "token"
    );

    window.location.href =
      "/";
  };

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
              Manage your users,
              companies, jobs and
              applications.
            </p>
          </div>
        </div>

        <div className="admin-stats">
          <div className="admin-stat-card">
            <h3>Total Users</h3>
            <h2>
              {stats.users}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>Total Companies</h3>
            <h2>
              {stats.companies}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>Total Jobs</h3>
            <h2>
              {stats.jobs}
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>Total Applications</h3>
            <h2>
              {stats.applications}
            </h2>
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
            <h3>
              Pending Applications
            </h3>

            <h2>
              {
                stats.pending_applications
              }
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>
              Accepted Applications
            </h3>

            <h2>
              {
                stats.accepted_applications
              }
            </h2>
          </div>

          <div className="admin-stat-card">
            <h3>
              Rejected Applications
            </h3>

            <h2>
              {
                stats.rejected_applications
              }
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
              setSelectedUser(
                null
              )
            }
          >
            ← Back to Users
          </button>

          <div
            className="admin-company-details"
            style={{
              marginTop: "20px"
            }}
          >
            <h2>
              User Details
            </h2>

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
            <h2>
              Users
            </h2>

            <p>
              Manage registered
              CareerGo users
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
                  handleUserClick(
                    user
                  )
                }
              >
                <h3>
                  {user.name ||
                    "Unnamed User"}
                </h3>

                <p>
                  ID: {user.id}
                </p>

                <p>
                  Email:{" "}
                  {user.email ||
                    "Not available"}
                </p>

                <p>
                  Resume:{" "}
                  {user.resume
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

  const renderCompanies = () => {
    if (selectedCompany) {
      const companyJobs =
        getCompanyJobs(
          selectedCompany.id
        );

      return (
        <div className="admin-section">
          <button
            className="admin-back-btn"
            onClick={() =>
              setSelectedCompany(
                null
              )
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
                Company ID
              </span>

              <span className="admin-detail-value">
                {selectedCompany.id}
              </span>
            </div>

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
                {selectedCompany.email ||
                  "Not available"}
              </span>
            </div>

            <div className="admin-detail-row">
              <span className="admin-detail-label">
                Role
              </span>

              <span className="admin-detail-value">
                {selectedCompany.role ||
                  "company"}
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
                  {
                    selectedCompany.name
                  }
                </p>
              </div>
            </div>

            {companyJobs.length ===
            0 ? (
              <div className="admin-no-jobs">
                No jobs posted by
                this company.
              </div>
            ) : (
              <div className="admin-job-list">
                {companyJobs.map(
                  (job) => (
                    <div
                      className="admin-job-card"
                      key={job.id}
                    >
                      <div className="admin-job-info">
                        <h3>
                          {job.title ||
                            "Untitled Job"}
                        </h3>

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
                            handleEditJob(
                              job
                            )
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
                  )
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="admin-section">
        <div className="admin-section-header">
          <div>
            <h2>
              Companies
            </h2>

            <p>
              Manage registered
              companies
            </p>
          </div>
        </div>

        {companiesLoading ? (
          <div className="admin-no-jobs">
            Loading companies...
          </div>
        ) : companies.length ===
          0 ? (
          <div className="admin-no-jobs">
            No companies available.
          </div>
        ) : (
          <div className="admin-company-list">
            {companies.map(
              (company) => (
                <div
                  className="admin-company-card"
                  key={company.id}
                  onClick={() =>
                    handleCompanyClick(
                      company
                    )
                  }
                >
                  <h3>
                    {company.name ||
                      "Unnamed Company"}
                  </h3>

                  <p>
                    ID: {company.id}
                  </p>

                  <p>
                    Email:{" "}
                    {company.email ||
                      "Not available"}
                  </p>

                  <span>
                    View Company Details →
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  const renderJobs = () => {
    return (
      <div className="admin-section">
        <div className="admin-job-management">
          <div className="admin-job-header">
            <div>
              <h2>
                Job Management
              </h2>

              <p>
                Manage all jobs
                posted on CareerGo
              </p>
            </div>
          </div>

          {jobsLoading ? (
            <div className="admin-no-jobs">
              Loading jobs...
            </div>
          ) : jobs.length ===
            0 ? (
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
                        "Not specified"}
                    </p>

                    <p className="admin-job-details">
                      Skills:{" "}
                      {job.skills ||
                        "Not specified"}
                    </p>

                    <p className="admin-job-details">
                      Description:{" "}
                      {job.description ||
                        "Not available"}
                    </p>
                  </div>

                  <div className="admin-job-actions">
                    <button
                      className="admin-edit-btn"
                      onClick={() =>
                        handleEditJob(
                          job
                        )
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
                position:
                  "fixed",
                inset: 0,
                background:
                  "rgba(0,0,0,0.6)",
                display:
                  "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                zIndex: 2000,
                padding: "20px"
              }}
            >
              <div
                style={{
                  width:
                    "100%",
                  maxWidth:
                    "700px",
                  maxHeight:
                    "90vh",
                  overflowY:
                    "auto",
                  background:
                    "#ffffff",
                  borderRadius:
                    "12px",
                  padding:
                    "30px"
                }}
              >
                <h2>
                  Edit Job
                </h2>

                <form
                  onSubmit={
                    handleUpdateJob
                  }
                >
                  <div className="form-group">
                    <label>
                      Job Title
                    </label>

                    <input
                      type="text"
                      name="title"
                      value={
                        editForm.title
                      }
                      onChange={
                        handleEditChange
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
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
                      rows="6"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
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
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Salary
                      </label>

                      <input
                        type="text"
                        name="salary"
                        value={
                          editForm.salary
                        }
                        onChange={
                          handleEditChange
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Job Type
                      </label>

                      <input
                        type="text"
                        name="type"
                        value={
                          editForm.type
                        }
                        onChange={
                          handleEditChange
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Skills
                      </label>

                      <input
                        type="text"
                        name="skills"
                        value={
                          editForm.skills
                        }
                        onChange={
                          handleEditChange
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="post-job-buttons">
                    <button
                      type="button"
                      className="cancel-job-btn"
                      onClick={() =>
                        setEditingJob(
                          null
                        )
                      }
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="submit-job-btn"
                      disabled={
                        savingJob
                      }
                    >
                      {savingJob
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderApplications =
    () => {
      return (
        <div className="admin-section">
          <div className="admin-section-header">
            <div>
              <h2>
                Applications
              </h2>

              <p>
                Application
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
                {
                  stats.pending_applications
                }
              </h2>
            </div>

            <div className="admin-stat-card">
              <h3>
                Accepted
              </h3>

              <h2>
                {
                  stats.accepted_applications
                }
              </h2>
            </div>

            <div className="admin-stat-card">
              <h3>
                Rejected
              </h3>

              <h2>
                {
                  stats.rejected_applications
                }
              </h2>
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

  if (loading) {
    return (
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <div className="admin-logo">
              CG
            </div>

            <h2>
              CareerGo
            </h2>
          </div>

          <div className="admin-sidebar-loading">
            Loading...
          </div>
        </aside>

        <main className="admin-main-content">
          <div className="admin-loading">
            Loading Admin
            Dashboard...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
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
          {menuItems.map(
            (item) => (
              <button
                key={item.id}
                className={
                  activeMenu ===
                  item.id
                    ? "admin-menu-item active"
                    : "admin-menu-item"
                }
                onClick={() => {
                  setActiveMenu(
                    item.id
                  );
                  setSelectedUser(
                    null
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
            )
          )}
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
            onClick={
              handleLogout
            }
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
