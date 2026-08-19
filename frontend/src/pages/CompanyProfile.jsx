import { Link } from "react-router-dom";

function CompanyProfile() {

  const storedCompany = localStorage.getItem("company");

  let company = null;

  try {
    company = storedCompany
      ? JSON.parse(storedCompany)
      : null;
  } catch (error) {
    console.error("COMPANY PROFILE ERROR:", error);
  }

  if (!company) {

    return (
      <div className="company-profile-page">

        <div className="company-profile-error">

          <h2>Company information not found</h2>

          <Link to="/company-login">
            Go to Company Login
          </Link>

        </div>

      </div>
    );

  }

  const companyName = company.name || "Company";
  const companyEmail = company.email || "Not available";
  const companyRole = company.role || "company";
  const companyId = company.id || "Not available";

  const firstLetter =
    companyName.charAt(0).toUpperCase();

  return (

    <div className="company-profile-page">

      {/* HEADER */}

      <div className="company-profile-header">

        <div>

          <span className="company-page-label">
            COMPANY PROFILE
          </span>

          <h1>
            Company Details
          </h1>

          <p>
            View your registered company information.
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

        <div className="profile-avatar">
          {firstLetter}
        </div>


        <div className="profile-main">

          <h2>
            {companyName}
          </h2>

          <p className="profile-email">
            {companyEmail}
          </p>


          <div className="profile-information">

            <div className="profile-info-row">

              <span>
                Company Name
              </span>

              <strong>
                {companyName}
              </strong>

            </div>


            <div className="profile-info-row">

              <span>
                Email Address
              </span>

              <strong>
                {companyEmail}
              </strong>

            </div>


            <div className="profile-info-row">

              <span>
                Account Role
              </span>

              <strong>
                {companyRole}
              </strong>

            </div>


            <div className="profile-info-row">

              <span>
                Company ID
              </span>

              <strong>
                {companyId}
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* ACCOUNT INFORMATION */}

      <div className="account-information">

        <h2>
          Account Information
        </h2>

        <p>
          Your company account is connected to CareerGo.
          You can use the company dashboard to manage jobs
          and applications.
        </p>

      </div>

    </div>

  );

}

export default CompanyProfile;
