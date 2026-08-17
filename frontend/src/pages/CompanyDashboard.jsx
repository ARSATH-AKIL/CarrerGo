import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CompanyDashboard() {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get company data
  useEffect(() => {
    const storedCompany = localStorage.getItem("company");

    if (!storedCompany) {
      navigate("/company-login");
      return;
    }

    try {
      const companyData = JSON.parse(storedCompany);
      setCompany(companyData);

      // Get company jobs
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

      // Get company applications
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

  // Active jobs
  const activeJobs = jobs.filter((job) => {
    const status = String(job.status || "")
      .toLowerCase()
      .trim();

    return status !== "closed";
  }).length;

  // Pending applications
  const pendingApplications = applications.filter((application) => {
    const status = String(application.status || "")
      .toLowerCase()
      .trim();

    return status === "applied" || status === "pending";
  }).length;

  // Accepted applications
  const acceptedApplications = applications.filter((application) => {
    const status = String(application.status || "")
      .toLowerCase()
      .trim();

    return status === "accepted" || status === "accept";
  }).length;

  // Rejected applications
  const rejectedApplications = applications.filter((application) => {
    const status = String(application.status || "")
      .toLowerCase()
      .trim();

    return status === "rejected" || status === "reject";
  }).length;

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("company");
    navigate("/company-login");
  };

  // Loading
  if (!company || loading) {
    return (
      <div className="company-dashboard-loading">
        <p>Loading company dashboard...</p>
      </div>
    );
  }

  // UI
  return (
    <div className="company-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {company.name}</h1>

          <p>
            Manage your jobs and applications from here.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <Link
            to="/post-job"
            className="post-job-btn"
          >
            + Post a Job
          </Link>

          <button
            type="button"
            className="company-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Company Information */}
      <div className="company-info">
        <p>
          <strong>Email:</strong> {company.email}
        </p>

        <p>
          <strong>Role:</strong> {company.role}
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Active Jobs</h3>
          <h2>{activeJobs}</h2>
          <p>Currently active job posts</p>
        </div>

        <div className="dashboard-card">
          <h3>Pending Applications</h3>
          <h2>{pendingApplications}</h2>
          <p>Applications waiting for review</p>
        </div>

        <div className="dashboard-card">
          <h3>Accepted Applications</h3>
          <h2>{acceptedApplications}</h2>
          <p>Successfully accepted applicants</p>
        </div>

        <div className="dashboard-card">
          <h3>Rejected Applications</h3>
          <h2>{rejectedApplications}</h2>
          <p>Rejected applications</p>
        </div>
      </div>

      {/* Dashboard Actions */}
      <div className="dashboard-actions">
        <Link
          to="/post-job"
          className="dashboard-action"
        >
          <h3>Post a Job</h3>
          <p>Create a new job opportunity.</p>
        </Link>

        <Link
          to="/my-jobs"
          className="dashboard-action"
        >
          <h3>My Jobs</h3>
          <p>View and manage your job posts.</p>
        </Link>

        <Link
          to="/applications"
          className="dashboard-action"
        >
          <h3>Applications</h3>
          <p>View candidates who applied.</p>
        </Link>

        <Link
          to="/company-details"
          className="dashboard-action"
        >
          <h3>Company Details</h3>
          <p>View and manage your company information.</p>
        </Link>
      </div>
    </div>
  );
}

export default CompanyDashboard;