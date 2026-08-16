import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "",
    description: "",
    skills: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/jobs/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("EDIT JOB RESPONSE:", data);

        if (data.job) {
          setJobData({
            title: data.job.title || "",
            company: data.job.company_name || "",
            location: data.job.location || "",
            salary: data.job.salary || "",
            type: data.job.type || "",
            description: data.job.description || "",
            skills: data.job.skills || ""
          });
        } else {
          setMessage(data.message || "Job not found");
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("GET JOB ERROR:", error);
        setMessage("Unable to connect to CareerGo backend");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setSaving(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/jobs/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: jobData.title,
            location: jobData.location,
            salary: jobData.salary,
            type: jobData.type,
            description: jobData.description,
            skills: jobData.skills
          })
        }
      );

      const data = await response.json();

      console.log("UPDATE JOB RESPONSE:", data);

      if (response.ok) {
        alert("Job updated successfully!");
        navigate("/my-jobs");
      } else {
        setMessage(data.message || "Failed to update job");
      }
    } catch (error) {
      console.error("UPDATE JOB ERROR:", error);
      setMessage("Unable to connect to CareerGo backend");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading job...</p>;
  }

  return (
    <div className="edit-job-page">

      <div className="edit-job-card">

        <div className="edit-job-header">
          <h1>Edit Job</h1>
          <p>Update your job information.</p>
        </div>

        {message && (
          <p className="edit-job-message">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="edit-form-group">
            <label>Job Title</label>

            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="edit-form-group">
            <label>Company Name</label>

            <input
              type="text"
              name="company"
              value={jobData.company}
              readOnly
            />
          </div>

          <div className="edit-form-row">

            <div className="edit-form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="edit-form-group">
              <label>Salary</label>

              <input
                type="text"
                name="salary"
                value={jobData.salary}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="edit-form-group">
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

          <div className="edit-form-group">
            <label>Job Description</label>

            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              rows="6"
              required
            />
          </div>

          <div className="edit-form-group">
            <label>Required Skills</label>

            <input
              type="text"
              name="skills"
              value={jobData.skills}
              onChange={handleChange}
              required
            />
          </div>

          <div className="edit-job-buttons">

            <Link
              to="/my-jobs"
              className="edit-cancel-btn"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="edit-save-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditJob;