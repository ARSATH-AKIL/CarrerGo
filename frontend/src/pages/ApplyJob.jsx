import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
function ApplyJob() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("jobId");
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (!jobId) {
      setMessage("Job ID not found");
      setLoading(false);
      return;
    }
    fetch(`http://127.0.0.1:5000/api/jobs/${jobId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Job not found");
        }
        return response.json();
      })
      .then((data) => {
        console.log("APPLY JOB RESPONSE:", data);
        if (data.job) {
          setJob(data.job);
        } else {
          setMessage(data.message || "Job not found");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("GET APPLY JOB ERROR:", error);
        setMessage(
          "Unable to connect to CareerGo backend"
        );
        setLoading(false);
      });
  }, [jobId]);
    useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      setCheckingApplication(false);
      return;
    }
    let user;
    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error("USER JSON ERROR:", error);
      setCheckingApplication(false);
      return;
    }
    if (!user || !user.id || !jobId) {
      setCheckingApplication(false)
      return;
    }
    fetch(
      `http://127.0.0.1:5000/api/applications/check/${jobId}/${user.id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Application check failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log(
          "CHECK APPLICATION:",
          data
        );
        setAlreadyApplied(
          data.applied === true
        );
        setCheckingApplication(false);
      })
      .catch((error) => {
        console.error(
          "CHECK APPLICATION ERROR:",
          error
        );
        setAlreadyApplied(false);
        setCheckingApplication(false);
      });
  }, [jobId]);
  const handleSubmit = async () => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/login");
      return;
    }
    let user;
    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error("USER JSON ERROR:", error)
      navigate("/login");
      return;
    }
    if (!user || !user.id) {
      navigate("/login");
      return;
    }
  
    if (alreadyApplied) {
      setMessage(
        "You have already applied for this job."
      );
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            job_id: Number(jobId),
            user_id: Number(user.id)
          })
        }
      );
      const data = await response.json();
      console.log(
        "APPLICATION RESPONSE:",
        data
      );
      if (response.status === 409) {
        setAlreadyApplied(true);
        setMessage(
          "You have already applied for this job."
        );
        return;
      }
      if (!response.ok) {
        setMessage(
          data.message ||
          "Application failed"
        );
        return;
      }
      setAlreadyApplied(true);
      setMessage(
        "Application submitted successfully!"
      );
    } catch (error) {
      console.error(
        "APPLICATION ERROR:",
        error
      );
      setMessage(
        "Unable to connect to CareerGo backend"
      );
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="apply-page">
        <div className="apply-card">
          <h2>
            Loading Job...
          </h2>
        </div>
      </div>
    );
  }
     if (!job) {
    return (
      <div className="apply-page">
        <div className="apply-card">
          <h2>
            Job Not Found
          </h2>
          <p>
            {message}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="apply-page">
      <div className="apply-card">
        <h1>
          Apply for Job
        </h1>
        <h2>
          {job.title}
        </h2>
        <p>
          {job.title} at {job.company_name}
        </p>
        <div className="apply-job-info">
          <p>
            <strong>Location:</strong>{" "}
            {job.location}
          </p>
          <p>
            <strong>Salary:</strong>{" "}
            {job.salary}
          </p>
          <p>
            <strong>Job Type:</strong>{" "}
            {job.type}
          </p>
          <p>
            <strong>Skills:</strong>{" "}
            {job.skills}
          </p>
        </div>

        {checkingApplication ? (
          <div className="application-checking">
            Checking application status...
          </div>
        ) : alreadyApplied ? (
          <div className="already-applied-message">
            ✓ You have already applied for this job
          </div>
        ) : null}

        {!checkingApplication && !alreadyApplied && (
          <button
            className="submit-application-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Application"}
          </button>
        )}
        {message && (
          <p className="application-message">
            {message}
          </p>
        )}
        <button
          className="back-jobs-btn"
          onClick={() => navigate("/jobs")}>
          Back to Jobs
        </button>
      </div>
    </div>
  );
}
export default ApplyJob;