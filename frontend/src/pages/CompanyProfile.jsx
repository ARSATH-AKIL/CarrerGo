import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CompanyProfile() {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);

  useEffect(() => {
    const storedCompany =
      localStorage.getItem("company");

    if (!storedCompany) {
      navigate("/company-login");
      return;
    }

    try {
      const companyData =
        JSON.parse(storedCompany);

      setCompany(companyData);
    } catch (error) {
      console.error(
        "COMPANY PROFILE ERROR:",
        error
      );

      localStorage.removeItem("company");

      navigate("/company-login");
    }
  }, [navigate]);

  if (!company) {
    return (
      <div className="company-profile-loading">
        <p>Loading company details...</p>
      </div>
    );
  }

  return (
    <div className="company-profile-page">

      {/* HEADER */}

      <div className="company-profile-header">

        <div>

          <span className="profile-label">
            COMPANY PROFILE
          </span>

          <h1>
            Company Details
          </h1>

          <p>
            View your registered company
            information.
          </p>

        </div>

        <Link
          to="/company-dashboard"
          className="back-dashboard-button"
        >
          ← Dashboard
        </Link>

      </div>

      {/* PROFILE CARD */}

      <div className="company-profile-card">

        <div className="profile-card-top">

          <div className="large-company-avatar">
            {company.name
              ? company.name
                  .charAt(0)
                  .toUpperCase()
              : "C"}
          </div>

          <div className="profile-company-heading">

            <h2>
              {company.name ||
                "Company Name"}
            </h2>

            <p>
              {company.email ||
                "No email available"}
            </p>

          </div>

        </div>

        {/* DETAILS */}

        <div className="company-details-grid">

          <div className="company-detail-item">

            <span>
              Company Name
            </span>

            <strong>
              {company.name ||
                "Not available"}
            </strong>

          </div>

          <div className="company-detail-item">

            <span>
              Email Address
            </span>

            <strong>
              {company.email ||
                "Not available"}
            </strong>

          </div>

          <div className="company-detail-item">

            <span>
              Account Role
            </span>

            <strong>
              {company.role ||
                "Company"}
            </strong>

          </div>

          <div className="company-detail-item">

            <span>
              Company ID
            </span>

            <strong>
              {company.id ||
                "Not available"}
            </strong>

          </div>

        </div>

      </div>

      {/* ACCOUNT INFORMATION */}

      <div className="company-profile-section">

        <h2>
          Account Information
        </h2>

        <p>
          Your company account is connected
          to CareerGo. You can use the company
          dashboard to manage jobs and
          applications.
        </p>

      </div>

    </div>
  );
}

export default CompanyProfile;
