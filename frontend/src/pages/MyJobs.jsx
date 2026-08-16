import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function MyJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedCompany = localStorage.getItem("company");

    if (!storedCompany) {
      navigate("/company-login");
      return;
    }

    const company = JSON.parse(storedCompany);

    fetch(`http://127.0.0.1:5000/api/company/jobs/${company.id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("MY JOBS RESPONSE:", data);

        if (data.jobs) {
          setJobs(data.jobs);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("GET COMPANY JOBS ERROR:", error);
        setLoading(false);
      });
  }, [navigate]);

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/jobs/${jobId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      console.log("DELETE RESPONSE:", data);

      if (response.ok) {
        setJobs((currentJobs) =>
          currentJobs.filter((job) => job.id !== jobId)
        );

        alert("Job deleted successfully!");
      } else {
        alert(data.message || "Failed to delete job");
      }
    } catch (error) {
      console.error("DELETE JOB ERROR:", error);
      alert("Unable to delete job");
    }
  };

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <div className="my-jobs-page">
      <div className="my-jobs-header">
        <div>
          <h1>My Jobs</h1>

          <p>
            Manage the jobs posted by your company.
          </p>
        </div>

        <Link
          to="/post-job"
          className="post-job-btn"
        >
          + Post a Job
        </Link>
      </div>

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <div className="no-jobs">
            <h2>No Jobs Found</h2>

            <p>
              You have not posted any jobs yet.
            </p>

            <Link
              to="/post-job"
              className="post-job-btn"
            >
              + Post a Job
            </Link>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              className="my-job-card"
              key={job.id}
            >
              <div className="job-card-content">
                <h2>{job.title}</h2>

                <p className="job-company">
                  {job.company_name}
                </p>

                <div className="job-info">
                  <span>
                    📍 {job.location}
                  </span>

                  <span>
                    💰 {job.salary}
                  </span>

                  <span>
                    💼 {job.type}
                  </span>
                </div>

                <p className="job-description">
                  {job.description}
                </p>

                <p className="job-skills">
                  <strong>Skills:</strong>{" "}
                  {job.skills}
                </p>
              </div>

              <div className="job-card-actions">
                <Link
                  to={`/edit-job/${job.id}`}
                  className="edit-job-btn"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  className="delete-job-btn"
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyJobs;