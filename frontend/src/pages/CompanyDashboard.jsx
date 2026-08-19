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
            throw new Error(
              "Unable to get company applications"
            );
          }

          return response.json();
        })
        .then((data) => {
          console.log(
            "COMPANY APPLICATIONS:",
            data
          );

          setApplications(
            data.applications || []
          );
        })
        .catch((error) => {
          console.error(
            "COMPANY APPLICATIONS ERROR:",
            error
          );

          setApplications([]);
        })
        .finally(() => {
          setLoading(false);
        });

    } catch (error) {
      console.error(
        "COMPANY DATA ERROR:",
        error
      );

      localStorage.removeItem("company");

      navigate("/company-login");
    }
  }, [navigate]);

  const activeJobs = jobs.filter((job) => {
    const status = String(
      job.status || ""
    )
      .toLowerCase()
      .trim();

    return status !== "closed";
  }).length;

  const pendingApplications =
    applications.filter((application) => {
      const status = String(
        application.status || ""
      )
        .toLowerCase()
        .trim();

      return (
        status === "applied" ||
        status === "pending"
      );
    }).length;

  const acceptedApplications =
    applications.filter((application) => {
      const status = String(
        application.status || ""
      )
        .toLowerCase()
        .trim();

      return (
        status === "accepted" ||
        status === "accept"
      );
    }).length;

  const rejectedApplications =
    applications.filter((application) => {
      const status = String(
        application.status || ""
      )
        .toLowerCase()
        .trim();

      return (
        status === "rejected" ||
        status === "reject"
      );
    }).length;

  if (!company || loading) {
    return (
      <div className="company-dashboard-loading">
        <p>Loading company dashboard...</p>
      </div>
    );
  }

  return (
    <div className="company-dashboard">

      {/* HEADER */}

      <section className="dashboard-header">

        <div className="dashboard-header-content">

          <span className="dashboard-label">
            COMPANY DASHBOARD
          </span>

          <h1>
            Welcome back, {company.name}
          </h1>

          <p>
            Manage your jobs, candidates and
            company profile.
          </p>

        </div>

      </section>

      {/* COMPANY SUMMARY */}

      <section className="company-summary">

        <div className="company-summary-left">

          <div className="company-summary-avatar">
            {company.name
              ? company.name
                  .charAt(0)
                  .toUpperCase()
              : "C"}
          </div>

          <div className="company-summary-info">

            <h2>
              {company.name}
            </h2>

            <p>
              {company.email}
            </p>

          </div>

        </div>

        <div className="company-summary-right">

          <div className="company-role">

            <span>Role</span>

            <strong>
              {company.role || "Company"}
            </strong>

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

      <section className="overview-section">

        <div className="section-heading">

          <h2>
            Overview
          </h2>

          <p>
            Your recruitment activity at a glance.
          </p>

        </div>

        <div className="dashboard-cards">

          <div className="dashboard-card">

            <div className="dashboard-card-top">

              <h3>
                Active Jobs
              </h3>

              <span>
                Active
              </span>

            </div>

            <h2>
              {activeJobs}
            </h2>

            <p>
              Currently active job posts
            </p>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-card-top">

              <h3>
                Pending Applications
              </h3>

              <span>
                Review
              </span>

            </div>

            <h2>
              {pendingApplications}
            </h2>

            <p>
              Applications waiting for review
            </p>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-card-top">

              <h3>
                Accepted Applications
              </h3>

              <span>
                Selected
              </span>

            </div>

            <h2>
              {acceptedApplications}
            </h2>

            <p>
              Successfully accepted applicants
            </p>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-card-top">

              <h3>
                Rejected Applications
              </h3>

              <span>
                Closed
              </span>

            </div>

            <h2>
              {rejectedApplications}
            </h2>

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
