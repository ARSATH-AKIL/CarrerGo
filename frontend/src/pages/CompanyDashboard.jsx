import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function CompanyDashboard() {

  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // GET COMPANY DATA
  // =====================================================

  useEffect(() => {

    const storedCompany =
      localStorage.getItem("company");

    if (!storedCompany) {

      navigate("/company-login");

      return;
    }

    try {

      const companyData =
        JSON.parse(storedCompany);

      setCompany(companyData);

      // =================================================
      // GET COMPANY JOBS
      // =================================================

      fetch(
        'https://servercarrergo.onrender.com/api/company/jobs/${companyData.id}'
      )
        .then((response) => {

          if (!response.ok) {

            throw new Error(
              "Unable to get company jobs"
            );

          }

          return response.json();

        })
        .then((data) => {

          console.log(
            "COMPANY JOBS:",
            data
          );

          setJobs(
            data.jobs || []
          );

        })
        .catch((error) => {

          console.error(
            "COMPANY JOBS ERROR:",
            error
          );

        });


      // =================================================
      // GET COMPANY APPLICATIONS
      // =================================================

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

        })
        .finally(() => {

          setLoading(false);

        });

    } catch (error) {

      console.error(
        "COMPANY DATA ERROR:",
        error
      );

      localStorage.removeItem(
        "company"
      );

      navigate("/company-login");

    }

  }, [navigate]);


  // =====================================================
  // ACTIVE JOBS
  // =====================================================

  const activeJobs = jobs.filter(
    (job) => {

      const status =
        job.status?.toLowerCase();

      return status !== "closed";

    }
  ).length;


  // =====================================================
  // PENDING APPLICATIONS
  // =====================================================

  const pendingApplications =
    applications.filter(
      (application) => {

        const status =
          application.status?.toLowerCase();

        return (
          status === "applied" ||
          status === "pending"
        );

      }
    ).length;


  // =====================================================
  // ACCEPTED APPLICATIONS
  // =====================================================

  const acceptedApplications =
    applications.filter(
      (application) => {

        const status =
          application.status?.toLowerCase();

        return (
          status === "accepted" ||
          status === "accept"
        );

      }
    ).length;


  // =====================================================
  // REJECTED APPLICATIONS
  // =====================================================

  const rejectedApplications =
    applications.filter(
      (application) => {

        const status =
          application.status?.toLowerCase();

        return (
          status === "rejected" ||
          status === "reject"
        );

      }
    ).length;


  // =====================================================
  // VIEW APPLICANT RESUME
  // =====================================================

  const handleViewResume = (
    application
  ) => {

    if (
      !application.resume_available ||
      !application.resume_view_url
    ) {

      alert(
        "This applicant has not uploaded a resume."
      );

      return;
    }

    const resumeUrl =
      `https://servercarrergo.onrender.com${application.resume_view_url}`;

    console.log(
      "OPENING RESUME:",
      resumeUrl
    );

    window.open(
      resumeUrl,
      "_blank",
      "noopener,noreferrer"
    );

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "company"
    );

    navigate(
      "/company-login"
    );

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (!company || loading) {

    return (

      <div className="company-dashboard-loading">

        <p>
          Loading company dashboard...
        </p>

      </div>

    );

  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="company-dashboard">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="dashboard-header">

        <div>

          <h1>
            Welcome, {company.name}
          </h1>

          <p>
            Manage your jobs and applications
            from here.
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


      {/* =================================================
          COMPANY INFORMATION
      ================================================= */}

      <div className="company-info">

        <p>

          <strong>
            Email:
          </strong>{" "}

          {company.email}

        </p>


        <p>

          <strong>
            Role:
          </strong>{" "}

          {company.role}

        </p>

      </div>


      {/* =================================================
          DASHBOARD CARDS
      ================================================= */}

      <div className="dashboard-cards">


        {/* ACTIVE JOBS */}

        <div className="dashboard-card">

          <h3>
            Active Jobs
          </h3>

          <h2>
            {activeJobs}
          </h2>

          <p>
            Currently active job posts
          </p>

        </div>


        {/* PENDING */}

        <div className="dashboard-card">

          <h3>
            Pending Applications
          </h3>

          <h2>
            {pendingApplications}
          </h2>

          <p>
            Applications waiting for review
          </p>

        </div>


        {/* ACCEPTED */}

        <div className="dashboard-card">

          <h3>
            Accepted Applications
          </h3>

          <h2>
            {acceptedApplications}
          </h2>

          <p>
            Successfully accepted applicants
          </p>

        </div>


        {/* REJECTED */}

        <div className="dashboard-card">

          <h3>
            Rejected Applications
          </h3>

          <h2>
            {rejectedApplications}
          </h2>

          <p>
            Rejected applications
          </p>

        </div>

      </div>


      {/* =================================================
          DASHBOARD ACTIONS
      ================================================= */}

      <div className="dashboard-actions">


        {/* POST JOB */}

        <Link
          to="/post-job"
          className="dashboard-action"
        >

          <h3>
            Post a Job
          </h3>

          <p>
            Create a new job opportunity.
          </p>

        </Link>


        {/* MY JOBS */}

        <Link
          to="/my-jobs"
          className="dashboard-action"
        >

          <h3>
            My Jobs
          </h3>

          <p>
            View and manage your job posts.
          </p>

        </Link>


        {/* APPLICATIONS */}

        <Link
          to="/applications"
          className="dashboard-action"
        >

          <h3>
            Applications
          </h3>

          <p>
            View candidates who applied.
          </p>

        </Link>


        {/* COMPANY DETAILS */}

        <Link
          to="/company-details"
          className="dashboard-action"
        >

          <h3>
            Company Details
          </h3>

          <p>
            View and manage your company
            information.
          </p>

        </Link>

      </div>


      {/* =================================================
          APPLICANTS SECTION
      ================================================= */}

      <div className="company-applications-section">


        {/* SECTION HEADER */}

        <div className="applications-header">

          <h2>
            Applicants
          </h2>

          <p>
            Candidates who applied for
            your jobs.
          </p>

        </div>


        {/* =================================================
            NO APPLICATIONS
        ================================================= */}

        {applications.length === 0 ? (

          <div className="no-applications">

            <div className="no-applications-icon">
              📋
            </div>

            <h3>
              No Applications Yet
            </h3>

            <p>
              Applicants will appear here
              when they apply for your jobs.
            </p>

          </div>

        ) : (


          /* =================================================
             APPLICATION CARDS
          ================================================= */

          <div className="company-applications-list">

            {applications.map(
              (application) => (

                <div
                  className="company-application-card"
                  key={application.id}
                >


                  {/* =========================================
                      APPLICANT INFORMATION
                  ========================================= */}

                  <div className="applicant-info">


                    {/* PROFILE ICON */}

                    <div className="applicant-avatar">
                      👤
                    </div>


                    <div className="applicant-details">

                      <h3>
                        {
                          application.applicant_name
                        }
                      </h3>


                      <p>
                        📧{" "}
                        {
                          application.applicant_email
                        }
                      </p>


                      <p>
                        💼{" "}
                        {
                          application.job_title
                        }
                      </p>


                      <p>
                        📍{" "}
                        {
                          application.location ||
                          "Location not available"
                        }
                      </p>


                      <p>
                        📅 Applied:{" "}

                        {application.applied_at
                          ? new Date(
                              application.applied_at
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}

                      </p>

                    </div>

                  </div>


                  {/* =========================================
                      RIGHT SIDE ACTIONS
                  ========================================= */}

                  <div className="applicant-actions">


                    {/* STATUS */}

                    <span
                      className={`application-status ${
                        String(
                          application.status ||
                          "Applied"
                        )
                          .toLowerCase()
                          .replace(
                            /\s+/g,
                            "-"
                          )
                      }`}
                    >

                      {
                        application.status ||
                        "Applied"
                      }

                    </span>


                    {/* =====================================
                        RESUME BUTTON
                        INSIDE SAME CARD
                    ===================================== */}

                    {application.resume_available ? (

                      <button
                        type="button"
                        className="view-resume-btn"
                        onClick={() =>
                          handleViewResume(
                            application
                          )
                        }
                      >

                        📄 View Resume

                      </button>

                    ) : (

                      <span
                        className="no-resume"
                      >

                        Resume not uploaded

                      </span>

                    )}

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

export default CompanyDashboard;