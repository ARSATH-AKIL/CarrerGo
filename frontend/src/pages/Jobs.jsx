import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Jobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const [savedJobs, setSavedJobs] = useState(() => {
    return JSON.parse(localStorage.getItem("savedJobs")) || [];
  });

  const [loading, setLoading] = useState(true);

  // Get jobs from Flask + MySQL
  useEffect(() => {
    fetch("https://servercarrergo.onrender.com/api/jobs")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        return response.json();
      })
      .then((data) => {
        console.log("JOBS FROM BACKEND:", data);

        setAllJobs(data.jobs || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("GET JOBS ERROR:", error);

        setAllJobs([]);
        setLoading(false);
      });
  }, []);

  // Check whether job is saved
  const isSaved = (id) => {
    return savedJobs.some(
      (job) => job.id === id
    );
  };

  // Save / remove job
  const toggleSaveJob = (job) => {
    let updatedJobs;

    if (isSaved(job.id)) {
      updatedJobs = savedJobs.filter(
        (savedJob) => savedJob.id !== job.id
      );
    } else {
      updatedJobs = [
        ...savedJobs,
        job
      ];
    }

    setSavedJobs(updatedJobs);

    localStorage.setItem(
      "savedJobs",
      JSON.stringify(updatedJobs)
    );
  };

  // Filter jobs
  const filteredJobs = allJobs.filter((job) => {
    const jobSkills = Array.isArray(job.skills)
      ? job.skills.join(", ")
      : job.skills || "";

    const jobTitle = job.title || "";
    const jobCompany = job.company_name || "";
    const jobLocation = job.location || "";
    const jobTypeValue = job.type || "";

    const searchMatch =
      jobTitle
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      jobCompany
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      jobSkills
        .toLowerCase()
        .includes(search.toLowerCase());

    const locationMatch =
      location === "" ||
      jobLocation === location;

    const typeMatch =
      jobType === "" ||
      jobTypeValue === jobType;

    return (
      searchMatch &&
      locationMatch &&
      typeMatch
    );
  });

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
  };

  return (
    <div className="jobs-page">

      {/* Header */}

      <div className="jobs-header">

        <h1>
          Find Your Dream Job
        </h1>

        <p>
          Search and find the right opportunity for your career.
        </p>

      </div>


      {/* Filters */}

      <div className="jobs-filter-box">

        <input
          type="text"
          placeholder="Search job title, company or skills..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        <select
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        >

          <option value="">
            All Locations
          </option>

          <option value="Chennai">
            Chennai
          </option>

          <option value="Bangalore">
            Bangalore
          </option>

          <option value="Theni">
            Theni
          </option>

          <option value="Hyderabad">
            Hyderabad
          </option>

          <option value="Mumbai">
            Mumbai
          </option>

          <option value="Jaipur">
            Jaipur
          </option>

          <option value="New Delhi">
            New Delhi
          </option>

          <option value="Cochin">
            Cochin
          </option>

          <option value="Vadodara">
            Vadodara
          </option>

        </select>


        <select
          value={jobType}
          onChange={(e) =>
            setJobType(e.target.value)
          }
        >

          <option value="">
            All Job Types
          </option>

          <option value="Full Time">
            Full Time
          </option>

          <option value="Part Time">
            Part Time
          </option>

          <option value="Remote">
            Remote
          </option>

          <option value="Internship">
            Internship
          </option>

        </select>


        <button
          className="clear-filter-btn"
          onClick={clearFilters}
        >
          Clear
        </button>

      </div>


      {/* Result Count */}

      <div className="jobs-result-count">

        <p>
          <strong>
            {filteredJobs.length}
          </strong>{" "}
          jobs found
        </p>

      </div>


      {/* Jobs */}

      <div className="jobs-list">

        {loading ? (

          <div className="no-jobs">

            <h2>
              Loading Jobs...
            </h2>

            <p>
              Please wait while jobs are loading.
            </p>

          </div>

        ) : filteredJobs.length === 0 ? (

          <div className="no-jobs">

            <h2>
              No Jobs Found
            </h2>

            <p>
              Try changing your search or filters.
            </p>

          </div>

        ) : (

          filteredJobs.map((job) => {

            const jobSkills = Array.isArray(job.skills)
              ? job.skills.join(", ")
              : job.skills || "";

            return (

              <div
                className="job-card"
                key={job.id}
              >

                <div className="job-card-info">

                  <h2>
                    {job.title}
                  </h2>

                  <h3>
                    {job.company_name || "Company"}
                  </h3>


                  <div className="job-meta">

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

                    <strong>
                      Skills:
                    </strong>{" "}

                    {jobSkills}

                  </p>

                </div>


                {/* Actions */}

                <div className="job-card-actions">

                  <button
                    type="button"
                    className={`save-job-btn ${
                      isSaved(job.id)
                        ? "saved"
                        : ""
                    }`}
                    onClick={() =>
                      toggleSaveJob(job)
                    }
                    title={
                      isSaved(job.id)
                        ? "Remove from saved jobs"
                        : "Save job"
                    }
                  >

                    {isSaved(job.id) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}

                  </button>


                  <Link
                    to={`/job-details/${job.id}`}
                    className="view-job-btn"
                  >
                    View Job
                  </Link>

                </div>

              </div>

            );
          })

        )}

      </div>

    </div>
  );
}

export default Jobs;