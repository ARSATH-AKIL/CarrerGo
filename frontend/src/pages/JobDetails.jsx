import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);

  useEffect(() => {
    fetch(`https://servercarrergo.onrender.com/api/jobs/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Job not found");
        }
        return response.json();
      })
      .then((data) => {
        console.log("JOB DETAILS RESPONSE:", data);

        if (data.job) {
          setJob(data.job);
        } else {
          setMessage(data.message || "Job not found");
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("GET JOB DETAILS ERROR:", error);
        setMessage("Unable to connect to CareerGo backend");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setAlreadyApplied(false);
      setCheckingApplication(false);
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error("USER DATA ERROR:", error);
      setAlreadyApplied(false);
      setCheckingApplication(false);
      return;
    }

    if (!user || !user.id) {
      setAlreadyApplied(false);
      setCheckingApplication(false);
      return;
    }

    console.log("Checking application:", {
      jobId: id,
      userId: user.id
    });

    fetch(
      `https://servercarrergo.onrender.com/api/applications/check/${id}/${user.id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to check application");
        }
        return response.json();
      })
      .then((data) => {
        console.log("APPLICATION CHECK RESPONSE:", data);
        setAlreadyApplied(data.applied === true);
        setCheckingApplication(false);
      })
      .catch((error) => {
        console.error("APPLICATION CHECK ERROR:", error);
        setAlreadyApplied(false);
        setCheckingApplication(false);
      });
  }, [id]);

  const handleApply = () => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    let user;

    try {
      user = JSON.parse(savedUser);
    } catch (error) {
      console.error("USER DATA ERROR:", error);
      navigate("/login");
      return;
    }

    if (!user || !user.id) {
      navigate("/login");
      return;
    }

    if (alreadyApplied) {
      return;
    }

    navigate(`/apply?jobId=${job.id}`);
  };

  if (loading) {
    return (
      <div className="job-not-found">
        <h2>Loading Job...</h2>
        <p>Please wait while job details are loading.</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-not-found">
        <h2>Job Not Found</h2>
        <p>{message}</p>
        <Link to="/jobs">Back to Jobs</Link>
      </div>
    );
  }

  const skills = Array.isArray(job.skills)
    ? job.skills
    : (job.skills || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

  return (
    <div className="job-details-page">
      <div className="job-details-card">
        <div className="job-details-header">
          <div>
            <h1>{job.title}</h1>
            <h2>{job.company_name || "Company"}</h2>
          </div>

          <span className="job-type-badge">
            {job.type}
          </span>
        </div>

        <div className="job-details-meta">
          <span>📍 {job.location}</span>
          <span>💰 {job.salary}</span>
          <span>💼 {job.type}</span>
        </div>

        <hr />

        <div className="job-details-section">
          <h2>Job Description</h2>
          <p>{job.description}</p>
        </div>

        <div className="job-details-section">
          <h2>Required Skills</h2>

          <div className="skills-list">
            {skills.map((skill, index) => (
              <span key={index}>{skill}</span>
            ))}
          </div>
        </div>

        <div className="job-details-actions">
          {checkingApplication ? (
            <button
              className="apply-now-btn"
              disabled
            >
              Checking...
            </button>
          ) : alreadyApplied ? (
            <button
              className="apply-now-btn already-applied-btn"
              disabled
            >
              ✓ Already Applied
            </button>
          ) : (
            <button
              className="apply-now-btn"
              onClick={handleApply}
            >
              Apply Now
            </button>
          )}

          <Link
            to="/jobs"
            className="back-jobs-btn"
          >
            Back to Jobs
          </Link>
        </div>

        {alreadyApplied && (
          <div className="already-applied-message">
            ✓ You have already applied for this job.
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetails;