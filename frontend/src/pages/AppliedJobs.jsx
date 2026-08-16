import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setMessage("Please login to view your applied jobs");
      setLoading(false);
      return;
    }
    let user;
    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error("USER DATA ERROR:", error);
      setMessage("Invalid user login data");
      setLoading(false);
      return;
    }
    if (!user || !user.id) {
      setMessage("User information not found");
      setLoading(false);
      return;
    }
    console.log("Logged in user:", user);
    fetch(
      `http://127.0.0.1:5000/api/user/applications/${user.id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to get applications");
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          "USER APPLICATIONS RESPONSE:",
          data
        );
        setApplications(data.applications || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "GET USER APPLICATIONS ERROR:",
          error
        );
        setMessage(
          "Unable to connect to CareerGo backend"
        );
        setLoading(false);
      });
  }, []);
  if (loading) {
    return (
      <div className="applied-jobs-page">
        <h1>Applied Jobs</h1>
        <p>Loading your applications...</p>
      </div>
    );
  }
  if (message) {
    return (
      <div className="applied-jobs-page">
        <h1>Applied Jobs</h1>
        <p>{message}</p>
        <Link to="/login">
          Login
        </Link>
      </div>
    );
  }
  if (applications.length === 0) {
    return (
      <div className="applied-jobs-page">
        <h1>Applied Jobs</h1>
        <p>You haven't applied for any jobs yet.</p>
        <Link to="/jobs">
          Browse Jobs
        </Link>
      </div>
    );
  }
  return (
    <div className="applied-jobs-page">
      <div className="applied-jobs-header">
        <h1>Applied Jobs</h1>
        <p> Track the jobs you have applied for.</p>
      </div>
      <div className="applied-jobs-list">
        {applications.map((application) => (
          <div className="applied-job-card" key={application.application_id}>
            <div className="applied-job-content">
              <h2>{application.title}</h2>
              <h3>{application.company_name || "Company"}</h3>
              <div className="applied-job-meta">
                <span>📍 {application.location}  </span>
                <span>  💰 {application.salary}</span>
                <span>💼 {application.type}</span>
                <span>
                  📅 Applied:{" "}
                  {new Date(
                    application.applied_at
                  ).toLocaleDateString("en-IN")}
                </span>
              </div>
            </div>
            <div className="applied-job-actions">
              <span
                className={`application-status ${String(application.status || "Applied")
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {application.status || "Applied"}
              </span>
              <Link
                to={`/job-details/${application.job_id}`}
                className="view-job-btn"
              >
                View Job
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default AppliedJobs;