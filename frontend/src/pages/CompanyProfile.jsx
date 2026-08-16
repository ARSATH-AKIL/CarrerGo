import { useState } from "react";

function CompanyProfile() {

  const [company, setCompany] = useState({
    name: "HCL Tech Park",
    email: "hr@hcl.com",
    location: "Chennai",
    industry: "Information Technology",
    website: "https://www.hcltech.com",
    description:
      "HCL Tech Park is a technology company providing software and IT services."
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setEditing(false);
    alert("Company profile updated successfully!");
  };
  return (
    <div className="company-profile-page">

      <div className="company-profile-card">

        <div className="company-profile-header">

          <div>
            <h1>{company.name}</h1>
            <p>Company Profile</p>
          </div>

          {!editing && (
            <button
              className="profile-edit-btn"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}

        </div>


        <div className="company-profile-form">

          <div className="profile-form-group">
            <label>Company Name</label>

            <input
              type="text"
              name="name"
              value={company.name}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>


          <div className="profile-form-group">
            <label>Company Email</label>

            <input
              type="email"
              name="email"
              value={company.email}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>


          <div className="profile-form-row">

            <div className="profile-form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={company.location}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>


            <div className="profile-form-group">
              <label>Industry</label>

              <input
                type="text"
                name="industry"
                value={company.industry}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

          </div>


          <div className="profile-form-group">
            <label>Website</label>

            <input
              type="url"
              name="website"
              value={company.website}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>


          <div className="profile-form-group">
            <label>About Company</label>

            <textarea
              name="description"
              value={company.description}
              onChange={handleChange}
              rows="6"
              disabled={!editing}
            />
          </div>


          {editing && (
            <div className="profile-buttons">

              <button
                className="profile-cancel-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>

              <button
                className="profile-save-btn"
                onClick={handleSave}
              >
                Save Changes
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default CompanyProfile;