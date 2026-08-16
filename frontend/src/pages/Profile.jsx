import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("USER JSON ERROR:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedExtensions = ["pdf", "doc", "docx"];
    const extension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setMessage("Please select a PDF, DOC or DOCX file.");
      setResume(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Resume size must be less than 5 MB.");
      setResume(null);
      return;
    }

    setResume(file);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!resume) {
      setMessage("Please select your resume first.");
      return;
    }

    if (!user?.id) {
      setMessage("User information not found.");
      return;
    }

    setUploading(true);
    setMessage("Uploading resume...");

    try {
      const formData = new FormData();

      formData.append("user_id", String(user.id));
      formData.append("resume", resume);

      const response = await fetch(
        "http://127.0.0.1:5000/api/user/upload-resume",
        {
          method: "POST",
          body: formData
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "BACKEND NON-JSON RESPONSE:",
          text
        );

        throw new Error(
          `Backend returned ${response.status} instead of JSON`
        );
      }

      console.log(
        "RESUME UPLOAD RESPONSE:",
        data
      );

      if (!response.ok) {
        setMessage(
          data.message || "Resume upload failed"
        );
        return;
      }

      const updatedUser = {
        ...user,
        resume:
          data.resume ||
          data.resume_path ||
          true
      };

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setResume(null);

      const fileInput =
        document.getElementById("resume-upload");

      if (fileInput) {
        fileInput.value = "";
      }

      setMessage(
        "Resume uploaded successfully!"
      );

    } catch (error) {
      console.error(
        "RESUME UPLOAD ERROR:",
        error
      );

      setMessage(
        "Unable to connect to CareerGo backend"
      );

    } finally {
      setUploading(false);
    }
  };

  const handleViewResume = () => {
    if (!user?.id || !user?.resume) {
      setMessage("No resume uploaded yet.");
      return;
    }

    window.open(
      `http://127.0.0.1:5000/api/user/resume/${user.id}`,
      "_blank"
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-avatar">
          👤
        </div>

        <h2>{user.name}</h2>

        <p className="profile-role">
          Job Seeker
        </p>

        <div className="profile-section">

          <h3>Personal Information</h3>

          <div className="profile-detail">
            <span>Name:</span>
            <strong>{user.name}</strong>
          </div>

          <div className="profile-detail">
            <span>Email:</span>
            <strong>{user.email}</strong>
          </div>

          <div className="profile-detail">
            <span>Account Type:</span>
            <strong>{user.role}</strong>
          </div>

        </div>

        <div className="resume-section">

          <h3>My Resume</h3>

          <p>
            Upload your resume to apply for jobs.
          </p>

          <label
            htmlFor="resume-upload"
            className="resume-upload-label"
          >
            Choose Resume
          </label>

          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            hidden
          />

          {resume && (
            <div className="selected-resume">

              <span>
                📄 {resume.name}
              </span>

              <span>
                {(resume.size / 1024 / 1024).toFixed(2)} MB
              </span>

            </div>
          )}

          <button
            className="resume-upload-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading
              ? "Uploading..."
              : "Upload Resume"}
          </button>

          {user.resume && !resume && (
            <div className="existing-resume">

              <p>
                📄 Resume uploaded
              </p>

              <button
                className="view-resume-btn"
                onClick={handleViewResume}
              >
                View Resume
              </button>

            </div>
          )}

          {message && (
            <p className="resume-message">
              {message}
            </p>
          )}

        </div>

        <div className="profile-actions">

          <button
            onClick={() =>
              navigate("/applied-jobs")
            }
          >
            Applied Jobs
          </button>

          <button
            onClick={() =>
              navigate("/saved-jobs")
            }
          >
            Saved Jobs
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;