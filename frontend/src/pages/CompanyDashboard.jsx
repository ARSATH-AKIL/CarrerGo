import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function CompanyDashboard() {

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedCompany = localStorage.getItem("company");

    if (!storedCompany) {
      window.location.href = "/company-login";
      return;
    }

    try {

      const companyData = JSON.parse(storedCompany);

      setCompany(companyData);

      /* GET COMPANY JOBS */

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

      /* GET COMPANY APPLICATIONS */

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

      window.location.href = "/company-login";

    }

  }, []);

  /* ACTIVE JOBS */

  const activeJobs = jobs.filter((job) => {

    const status = String(job.status || "")
      .toLowerCase()
      .trim();

    return status !== "closed";

  }).length;

  /* PENDING */

  const pendingApplications = applications.filter((application) => {

    const status = String(application.status || "")
      .toLowerCase()
      .trim();

    return (
      status === "applied" ||
      status === "pending"
    );

  }).length;

  /* ACCEPTED */

  const acceptedApplications = applications.filter((application) => {

    const status = String(application.status || "")
      .toLowerCase()
      .trim();

    return (
      status === "accepted" ||
      status === "accept"
    );

  }).length;

  /* REJECTED */

  const rejectedApplications = applications.filter((application) => {

    const status = String(application.status || "")
      .toLowerCase()
      .trim();

    return (
      status === "rejected" ||
      status === "reject"
    );

  }).length;

  if (loading || !company) {

    return (
      <div className="company-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading company dashboard...</p>
      </div>
    );

  }

  const companyName = company.name || "Company";
  const companyEmail = company.email || "";
  const companyRole = company.role || "company";
  const firstLetter = companyName.charAt(0).toUpperCase();

  return (

    <div className="company-dashboard-page">

      {/* TOP HEADER */}

      <div className="company-dashboard-header">

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

      </div>


      {/* COMPANY INFORMATION CARD */}

      <section className="company-summary-card">

        <div className="company-summary-left">

          <div className="company-large-avatar">
            {firstLetter}
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

            <span>Role</span>

            <strong>
              {companyRole}
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

          <div>
            <h2>Overview</h2>

            <p>
              Your recruitment activity at a glance.
            </p>
          </div>

        </div>


        <div className="overview-grid">

          {/* ACTIVE JOBS */}

          <div className="overview-card">

            <div className="overview-card-top">

              <div className="overview-icon">
                J
              </div>

              <span className="overview-status active-status">
                Active
              </span>

            </div>

            <div className="overview-number">
              {activeJobs}
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

              <span className="overview-status pending-status">
                Review
              </span>

            </div>

            <div className="overview-number">
              {pendingApplications}
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

              <span className="overview-status accepted-status">
                Selected
              </span>

            </div>

            <div className="overview-number">
              {acceptedApplications}
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

              <span className="overview-status rejected-status">
                Closed
              </span>

            </div>

            <div className="overview-number">
              {rejectedApplications}
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

  );

}

export default CompanyDashboard;
