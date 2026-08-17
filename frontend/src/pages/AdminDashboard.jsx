import { useEffect, useState } from "react";

function AdminDashboard() {
  // Admin dashboard stats
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

  // Jobs
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);

  // Get admin dashboard data
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://servercarrergo.onrender.com/api/admin/dashboard"
      );

      if (!response.ok) {
        throw new Error("Unable to get dashboard data");
      }

      const data = await response.json();

      console.log("ADMIN DASHBOARD DATA:", data);

      setStats({
        users: Number(data.stats?.users) || 0,
        companies: Number(data.stats?.companies) || 0,
        jobs: Number(data.stats?.jobs) || 0,
        applications: Number(data.stats?.applications) || 0,
        active_jobs: Number(data.stats?.active_jobs) || 0,
        pending_applications:
          Number(data.stats?.pending_applications) || 0,
        accepted_applications:
          Number(data.stats?.accepted_applications) || 0,
        rejected_applications:
          Number(data.stats?.rejected_applications) || 0
      });
    } catch (error) {
      console.error("ADMIN DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get all jobs
  const loadJobs = async () => {
    try {
      setJobsLoading(true);

      const response = await fetch(
        "https://servercarrergo.onrender.com/api/jobs"
      );

      if (!response.ok) {
        throw new Error("Unable to get jobs");
      }

      const data = await response.json();

      console.log("ADMIN JOBS:", data);

      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (error) {
      console.error("ADMIN JOBS ERROR:", error);
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  // Load dashboard and jobs
  useEffect(() => {
    loadDashboard();
    loadJobs();
  }, []);

  // Delete job
  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `https://servercarrergo.onrender.com/api/jobs/${jobId}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to delete job");
        return;
      }

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== jobId)
      );

      setStats((previousStats) => ({
        ...previousStats,
        jobs: Math.max(Number(previousStats.jobs) - 1, 0),
        active_jobs: Math.max(
          Number(previousStats.active_jobs) - 1,
          0
        )
      }));

      alert("Job deleted successfully");

      loadDashboard();
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);

      alert("Unable to connect to CareerGo backend");
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome to CareerGo Admin Panel</p>
      </div>

      {/* Stat Cards */}
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

      {/* Job Management */}
      <div className="admin-job-management">
        <div className="admin-job-header">
          <h2>Job Management</h2>

          <button
            className="admin-post-job-btn"
            onClick={() => {
              alert("Post Job section will be added next.");
            }}
          >
            + Post New Job
          </button>
        </div>

        {/* Job Loading */}
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
                {/* Job Information */}
                <div className="admin-job-info">
                  <h3>{job.title}</h3>

                  <p className="admin-job-company">
                    {job.company_name || "Company"}
                  </p>

                  <p className="admin-job-details">
                    Location: {job.location}
                  </p>

                  <p className="admin-job-details">
                    Salary: {job.salary}
                  </p>

                  <p className="admin-job-details">
                    Type: {job.type}
                  </p>

                  <p className="admin-job-details">
                    Skills: {job.skills}
                  </p>
                </div>

                {/* Job Actions */}
                <div className="admin-job-actions">
                  <button
                    className="admin-edit-btn"
                    onClick={() => {
                      alert(`Edit Job: ${job.title}`);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="admin-delete-btn"
                    onClick={() => {
                      handleDeleteJob(job.id);
                    }}
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