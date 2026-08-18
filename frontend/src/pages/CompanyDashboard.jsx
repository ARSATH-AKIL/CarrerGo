import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CompanyDashboard() {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

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
    const status = String(job.status || "").toLowerCase().trim();
    return status !== "closed";
  }).length;

  const pendingApplications = applications.filter((application) => {
    const status = String(application.status || "").toLowerCase().trim();
    return status === "applied" || status === "pending";
  }).length;

  const acceptedApplications = applications.filter((application) => {
    const status = String(application.status || "").toLowerCase().trim();
    return status === "accepted" || status === "accept";
  }).length;

  const rejectedApplications = applications.filter((application) => {
    const status = String(application.status || "").toLowerCase().trim();
    return status === "rejected" || status === "reject";
  }).length;

  const handleLogout = () => {
    localStorage.removeItem("company");
    navigate("/company-login");
  };

  const handleCompanyDetails = () => {
    setShowCompanyDetails((previous) => !previous);
  };

  if (!company || loading) {
    return (
      <div className="company-dashboard-loading">
        <p>Loading company dashboard...</p>
      </div>
    );
  }

  return (
    <div className="company-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {company.name}</h1>
          <p>Manage your jobs and applications from here.</p>
        </div>

        <div className="dashboard-header-actions">
          <Link to="/post-job" className="post-job-btn">
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

      <div className="company-info">
        <p>
          <strong>Email:</strong> {company.email}
        </p>

        <p>
          <strong>Role:</strong> {company.role}
        </p>
      </div>

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

        <button
          type="button"
          className={`dashboard-action company-details-action ${
            showCompanyDetails ? "company-details-active" : ""
          }`}
          onClick={handleCompanyDetails}
        >
          <h3>
            Company Details
            <span className="company-details-arrow">
              {showCompanyDetails ? "▲" : "▼"}
            </span>
          </h3>

          <p>
            {showCompanyDetails
              ? "Hide your company information."
              : "View your company information."}
          </p>
        </button>
      </div>

      {showCompanyDetails && (
        <div className="company-details-panel">
          <div className="company-details-header">
            <h2>Company Details</h2>

            <button
              type="button"
              className="company-details-close"
              onClick={handleCompanyDetails}
            >
              Close
            </button>
          </div>

          <div className="company-details-grid">
            <div className="company-detail-item">
              <span>Company Name</span>
              <strong>{company.name || "Not available"}</strong>
            </div>

            <div className="company-detail-item">
              <span>Email</span>
              <strong>{company.email || "Not available"}</strong>
            </div>

            <div className="company-detail-item">
              <span>Location</span>
              <strong>{company.location || "Not available"}</strong>
            </div>

            <div className="company-detail-item">
              <span>Industry</span>
              <strong>{company.industry || "Not available"}</strong>
            </div>

            <div className="company-detail-item">
              <span>Role</span>
              <strong>{company.role || "Company"}</strong>
            </div>

            <div className="company-detail-item">
              <span>Company ID</span>
              <strong>{company.id || "Not available"}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyDashboard;
