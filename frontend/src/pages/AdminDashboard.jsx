import { useEffect, useState } from "react";

const API_URL = "https://servercarrergo.onrender.com/api";

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
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/admin/dashboard`);

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
      console.error("ADMIN DASHBOARD ERROR:", error);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      setJobsLoading(true);

      const response = await fetch(`${API_URL}/jobs`);

      if (!response.ok) {
        throw new Error("Unable to get jobs");
      }

      const data = await response.json();

      console.log("ADMIN JOBS:", data);

      if (Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else if (Array.isArray(data)) {
        setJobs(data);
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

  useEffect(() => {
    loadDashboard();
    loadJobs();
  }, []);

  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to delete job");
        return;
      }

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== jobId)
      );

      alert("Job deleted successfully");

      await loadDashboard();
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);
      alert("Unable to connect to CareerGo backend.");
    }
  };

  const handleEditJob = (job) => {
    alert(`Edit Job: ${job.title}`);
  };

  const handlePostJob = () => {
    alert("Post Job section will be added next.");
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-loading">
          Loading Admin Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to CareerGo Admin Panel</p>
      </div>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

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

        <div className="admin-stat-card">
          <h3>Active Jobs</h3>
          <h2>{stats.active_jobs}</h2>
        </div>

        <div className="admin-stat-card">
          <h3>Pending Applications</h3>
          <h2>{stats.pending_applications}</h2>
        </div>

        <div className="admin-stat-card">
          <h3>Accepted Applications</h3>
          <h2>{stats.accepted_applications}</h2>
        </div>

        <div className="admin-stat-card">
          <h3>Rejected Applications</h3>
          <h2>{stats.rejected_applications}</h2>
        </div>
      </div>

      <div className="admin-job-management">
        <div className="admin-job-header">
          <div>
            <h2>Job Management</h2>
            <p>Manage all jobs posted on CareerGo</p>
          </div>

          <button
            className="admin-post-job-btn"
            onClick={handlePostJob}
          >
            + Post New Job
          </button>
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
                    {job.title || "Untitled Job"}
                  </h3>

                  <p className="admin-job-company">
                    {job.company_name ||
                      job.company ||
                      "Company"}
                  </p>

                  <p className="admin-job-details">
                    Location: {job.location || "Not specified"}
                  </p>

                  <p className="admin-job-details">
                    Salary: {job.salary || "Not specified"}
                  </p>

                  <p className="admin-job-details">
                    Type:{" "}
                    {job.job_type ||
                      job.type ||
                      "Not specified"}
                  </p>

                  <p className="admin-job-details">
                    Skills: {job.skills || "Not specified"}
                  </p>
                </div>

                <div className="admin-job-actions">
                  <button
                    className="admin-edit-btn"
                    onClick={() => handleEditJob(job)}
                  >
                    Edit
                  </button>

                  <button
                    className="admin-delete-btn"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
