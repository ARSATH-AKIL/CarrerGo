import { useEffect, useState } from "react";
function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const getApplications = async () => {
    try {
      const savedCompany = localStorage.getItem("company");
      if (!savedCompany) {
        setMessage("Company login required");
        setLoading(false);
        return;
      }
      let company;
      try {
        company = JSON.parse(savedCompany);
      } catch (error) {
        console.error("COMPANY JSON ERROR:", error);
        setMessage("Invalid company login data");
        setLoading(false);
        return;
      }
      if (!company || !company.id) {
        setMessage("Company ID not found");
        setLoading(false);
        return;
      }
      console.log(
        "LOGGED IN COMPANY ID:",
        company.id
      );
      const response = await fetch(
        `http://127.0.0.1:5000/api/company/applications/${company.id}`
      );
      const data = await response.json();
      console.log(
        "COMPANY APPLICATIONS:",
        data
      );
      if (!response.ok) {
        setMessage(
          data.message || "Unable to get applications"
        );
        setApplications([]);
        return;
      }
      setApplications(
        data.applications || []
      );
    } catch (error) {
      console.error(
        "GET COMPANY APPLICATIONS ERROR:",
        error
      );
      setMessage(
        "Unable to connect to CareerGo backend"
      );
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getApplications();
  }, []);
  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/applications/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: status
          })
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(
          data.message ||
          "Unable to update application"
        );
        return;
      }
      setApplications((currentApplications) =>
        currentApplications.map(
          (application) =>
            application.id === applicationId
              ? {
                  ...application,
                  status: status
                }
              : application
        )
      );

    } catch (error) {
      console.error(
        "UPDATE APPLICATION ERROR:",
        error
      );
      alert(
        "Unable to connect to CareerGo backend"
      );
    }
  };
  const viewProfile = (application) => {
    alert(
      `Applicant: ${application.applicant_name}\n` +
      `Email: ${application.applicant_email}\n` +
      `Job: ${application.job_title}`
    );
  };
  if (loading) {
    return (
      <div className="applications-page">
        <div className="applications-header">
          <h1>
            Applications
          </h1>
          <p>
            Loading applications...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="applications-page">
      <div className="applications-header">
        <h1>
          Applications
        </h1>
        <p>
          Manage applications received for your jobs.
        </p>
      </div>
      {message && applications.length === 0 && (
        <p>
          {message}
        </p>
      )}
      {!message && applications.length === 0 && (
        <div className="application-card">
          <div className="application-info">
            <h2>
              No applications yet
            </h2>
            <p>
              No job seekers have applied for your jobs yet.
            </p>
          </div>
        </div>
      )}
      {/* APPLICATION LIST */}
      {applications.length > 0 && (
        <div className="applications-list">
          {applications.map((application) => (
            <div
              className="application-card"
              key={application.id}
            >
              <div className="application-info">
                <h2>
                  {application.applicant_name}
                </h2>
                <p className="application-email">
                  {application.applicant_email}
                </p>
                <p>
                  <strong>
                    Applied For:
                  </strong>{" "}
                  {application.job_title}
                </p>
                <p>
                  <strong>
                    Location:
                  </strong>{" "}
                  {application.location}
                </p>
                <p>
                  <strong>
                    Salary:
                  </strong>{" "}
                  {application.salary}
                </p>
                <span
                  className={`application-status ${
                    application.status
                      ? application.status.toLowerCase()
                      : ""
                  }`}
                >
                  {application.status}
                </span>
              </div>
              <div className="application-actions">
                <button
                  className="view-profile-btn"
                  onClick={() =>
                    viewProfile(application)
                  }
                >
                  View Profile
                </button>
                <button
                  className="accept-btn"
                  onClick={() =>
                    updateStatus(
                      application.id,
                      "Accepted"
                    )
                  }
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() =>
                    updateStatus(
                      application.id,
                      "Rejected"
                    )
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Applications;