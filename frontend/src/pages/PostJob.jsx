import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function PostJob() {
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    location: "",
    salary: "",
    type: "",
    description: "",
    skills: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get logged-in company
  const storedCompany = localStorage.getItem("company");

  let company = null;

  try {
    company = storedCompany ? JSON.parse(storedCompany) : null;
  } catch (error) {
    console.error("Company data error:", error);
    company = null;
  }

  // Handle input changes
  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  // Submit job
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // Check company login
    if (!company) {
      setMessage("Please login as a company first");
      navigate("/company-login");
      return;
    }

    // Check company ID
    if (!company.id) {
      setMessage("Company ID not found. Please login again.");
      localStorage.removeItem("company");
      navigate("/company-login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://servercarrergo.onrender.com/api/jobs",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            company_id: company.id,
            title: jobData.title,
            description: jobData.description,
            location: jobData.location,
            salary: jobData.salary,
            job_type: jobData.type,
            skills: jobData.skills
          })
        }
      );

      const data = await response.json();

      console.log("Post Job Response:", data);

      if (response.ok) {
        setMessage(
          data.message || "Job posted successfully!"
        );

        // Clear form
        setJobData({
          title: "",
          location: "",
          salary: "",
          type: "",
          description: "",
          skills: ""
        });

        // Redirect after success
        setTimeout(() => {
          navigate("/company-dashboard");
        }, 1000);

      } else {
        setMessage(
          data.message || "Failed to post job"
        );
      }

    } catch (error) {
      console.error("Post Job Error:", error);

      setMessage(
        "Unable to connect to CareerGo backend"
      );

    } finally {
      setLoading(false);
    }
  };

  // If company is not logged in
  if (!company) {
    return (
      <div className="post-job-page">

        <div className="post-job-card">

          <h2>Company Login Required</h2>

          <p>
            Please login to your company account
            before posting a job.
          </p>

          <Link
            to="/company-login"
            className="submit-job-btn"
          >
            Company Login
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="post-job-page">

      <div className="post-job-card">

        {/* Header */}

        <div className="post-job-header">

          <h1>Post a New Job</h1>

          <p>
            Create a new job opportunity and find
            the right candidate.
          </p>

        </div>


        {/* Company Information */}

        <div className="form-group">

          <label>Company Name</label>

          <input
            type="text"
            value={company.name || ""}
            readOnly
          />

        </div>


        <div className="form-group">

          <label>Company Email</label>

          <input
            type="email"
            value={company.email || ""}
            readOnly
          />

        </div>


        {/* Job Form */}

        <form onSubmit={handleSubmit}>

          {/* Job Title */}

          <div className="form-group">

            <label>Job Title</label>

            <input
              type="text"
              name="title"
              placeholder="e.g. Python Developer"
              value={jobData.title}
              onChange={handleChange}
              required
            />

          </div>


          {/* Location and Salary */}

          <div className="form-row">

            <div className="form-group">

              <label>Location</label>

              <input
                type="text"
                name="location"
                placeholder="e.g. Chennai"
                value={jobData.location}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>Salary</label>

              <input
                type="text"
                name="salary"
                placeholder="e.g. 4 - 6 LPA"
                value={jobData.salary}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* Job Type */}

          <div className="form-group">

            <label>Job Type</label>

            <select
              name="type"
              value={jobData.type}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Job Type
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

          </div>


          {/* Job Description */}

          <div className="form-group">

            <label>Job Description</label>

            <textarea
              name="description"
              placeholder="Describe the job responsibilities..."
              value={jobData.description}
              onChange={handleChange}
              rows="6"
              required
            />

          </div>


          {/* Skills */}

          <div className="form-group">

            <label>Required Skills</label>

            <input
              type="text"
              name="skills"
              placeholder="e.g. Python, Flask, MySQL"
              value={jobData.skills}
              onChange={handleChange}
              required
            />

          </div>


          {/* Message */}

          {message && (
            <p className="post-job-message">
              {message}
            </p>
          )}


          {/* Buttons */}

          <div className="post-job-buttons">

            <Link
              to="/company-dashboard"
              className="cancel-job-btn"
            >
              Cancel
            </Link>


            <button
              type="submit"
              className="submit-job-btn"
              disabled={loading}
            >

              {loading
                ? "Posting..."
                : "Post Job"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default PostJob;