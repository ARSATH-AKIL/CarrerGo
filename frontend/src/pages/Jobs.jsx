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

  const isSaved = (id) => {
    return savedJobs.some((job) => job.id === id);
  };

  const toggleSaveJob = (job) => {
    let updatedJobs;

    if (isSaved(job.id)) {
      updatedJobs = savedJobs.filter(
        (savedJob) => savedJob.id !== job.id
      );
    } else {
      updatedJobs = [...savedJobs, job];
    }

    setSavedJobs(updatedJobs);

    localStorage.setItem(
      "savedJobs",
      JSON.stringify(updatedJobs)
    );
  };

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
      location === "" || jobLocation === location;

    const typeMatch =
      jobType === "" || jobTypeValue === jobType;

    return searchMatch && locationMatch && typeMatch;
  });

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
  };

  return (
    <div className="jobs-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="jobs-header">
        <h1>Find Your Dream Job</h1>

        <p>
          Search and find the right opportunity for your career.
        </p>
      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="jobs-filter-box">

        <input
          type="text"
          placeholder="Search job title, company or skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          <option value="Chennai">Chennai</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Theni">Theni</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Jaipur">Jaipur</option>
          <option value="New Delhi">New Delhi</option>
          <option value="Cochin">Cochin</option>
          <option value="Vadodara">Vadodara</option>
        </select>

        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">All Job Types</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Remote">Remote</option>
          <option value="Internship">Internship</option>
        </select>

        <button
          type="button"
          className="clear-filter-btn"
          onClick={clearFilters}
        >
          Clear
        </button>

      </div>

      {/* =====================================================
          RESULT COUNT
      ===================================================== */}

      <div className="jobs-result-count">
        <p>
          <strong>{filteredJobs.length}</strong> jobs found
        </p>
      </div>

      {/* =====================================================
          JOB LIST
      ===================================================== */}

      <div className="jobs-list">

        {/* LOADING */}

        {loading ? (
          <div className="no-jobs">
            <h2>Loading Jobs...</h2>

            <p>
              Please wait while jobs are loading.
            </p>
          </div>
        ) : filteredJobs.length === 0 ? (

          /* NO JOBS */

          <div className="no-jobs">
            <h2>No Jobs Found</h2>

            <p>
              Try changing your search or filters.
            </p>
          </div>
        ) : (

          /* JOBS */

          filteredJobs.map((job) => {

            const jobSkills = Array.isArray(job.skills)
              ? job.skills.join(", ")
              : job.skills || "";

            return (
              <div
                className="job-card"
                key={job.id}
              >

                {/* =================================================
                    JOB INFORMATION
                ================================================= */}

                <div className="job-card-info">

                  <h2>
                    {job.title || "Job Title"}
                  </h2>

                  <h3>
                    {job.company_name || "Company"}
                  </h3>

                  {/* LOCATION / SALARY / TYPE */}

                  <div className="job-meta">

                    <span>
                      📍 {job.location || "Location not specified"}
                    </span>

                    <span>
                      💰 {job.salary || "Salary not specified"}
                    </span>

                    <span>
                      💼 {job.type || "Job type not specified"}
                    </span>

                  </div>

                  {/* SKILLS */}

                  <p className="job-skills">
                    <strong>Skills:</strong>{" "}
                    {jobSkills || "Not specified"}
                  </p>

                </div>

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <div className="job-card-actions">

                  {/* SAVE JOB */}

                  <button
                    type="button"
                    className={`save-job-btn ${
                      isSaved(job.id) ? "saved" : ""
                    }`}
                    onClick={() => toggleSaveJob(job)}
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

                  {/* VIEW JOB */}

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
