import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

function SavedJobs() {

  const [savedJobs, setSavedJobs] = useState(() => {
    return JSON.parse(localStorage.getItem("savedJobs")) || [];
  });

  const removeJob = (id) => {

    const confirmRemove = window.confirm(
      "Are you sure you want to remove this saved job?"
    );

    if (!confirmRemove) {
      return;
    }

    const updatedJobs = savedJobs.filter(
      (job) => job.id !== id
    );

    setSavedJobs(updatedJobs);

    localStorage.setItem(
      "savedJobs",
      JSON.stringify(updatedJobs)
    );
  };

  return (
    <div className="saved-jobs-page">

      {/* Header */}

      <div className="saved-jobs-header">

        <div>
          <h1>Saved Jobs</h1>

          <p>
            Jobs you saved for later.
          </p>
        </div>

        <span className="saved-jobs-count">
          {savedJobs.length} Saved
        </span>

      </div>


      {/* Empty State */}

      {savedJobs.length === 0 ? (

        <div className="no-saved-jobs">

          <div className="empty-save-icon">
            <FaHeart />
          </div>

          <h2>No Saved Jobs</h2>

          <p>
            You haven't saved any jobs yet.
          </p>

          <Link
            to="/jobs"
            className="browse-jobs-btn"
          >
            Browse Jobs
          </Link>

        </div>

      ) : (

        /* Saved Jobs */

        <div className="saved-jobs-list">

          {savedJobs.map((job) => (

            <div
              className="saved-job-card"
              key={job.id}
            >

              <div className="saved-job-info">

                <h2>{job.title}</h2>

                <h3>{job.company}</h3>

                <div className="saved-job-meta">

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

                <p>
                  <strong>Skills:</strong>{" "}
                  {job.skills}
                </p>

              </div>


              <div className="saved-job-actions">

                <Link
                  to={`/job-details/${job.id}`}
                  className="saved-view-btn"
                >
                  View Job
                </Link>

                <button
                  type="button"
                  className="remove-saved-btn"
                  onClick={() => removeJob(job.id)}
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default SavedJobs;