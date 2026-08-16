import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [admin, setAdmin] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // =====================================================
  // LOAD LOGIN DATA
  // =====================================================

  useEffect(() => {
    const loadLoginData = () => {

      // ================= USER =================

      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("USER JSON ERROR:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }


      // ================= COMPANY =================

      const savedCompany =
        localStorage.getItem("company");

      if (savedCompany) {
        try {
          setCompany(JSON.parse(savedCompany));
        } catch (error) {
          console.error(
            "COMPANY JSON ERROR:",
            error
          );

          setCompany(null);
        }
      } else {
        setCompany(null);
      }


      // ================= ADMIN =================

      const savedAdmin =
        localStorage.getItem("admin");

      if (savedAdmin) {
        try {
          setAdmin(JSON.parse(savedAdmin));
        } catch (error) {
          console.error(
            "ADMIN JSON ERROR:",
            error
          );

          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
    };


    // Load when Navbar starts
    loadLoginData();


    // ================= EVENTS =================

    window.addEventListener(
      "userLogin",
      loadLoginData
    );

    window.addEventListener(
      "userLogout",
      loadLoginData
    );

    window.addEventListener(
      "companyLogin",
      loadLoginData
    );

    window.addEventListener(
      "companyLogout",
      loadLoginData
    );

    window.addEventListener(
      "adminLogin",
      loadLoginData
    );

    window.addEventListener(
      "adminLogout",
      loadLoginData
    );


    // ================= CLEANUP =================

    return () => {

      window.removeEventListener(
        "userLogin",
        loadLoginData
      );

      window.removeEventListener(
        "userLogout",
        loadLoginData
      );

      window.removeEventListener(
        "companyLogin",
        loadLoginData
      );

      window.removeEventListener(
        "companyLogout",
        loadLoginData
      );

      window.removeEventListener(
        "adminLogin",
        loadLoginData
      );

      window.removeEventListener(
        "adminLogout",
        loadLoginData
      );

    };

  }, []);


  // =====================================================
  // USER LOGOUT
  // =====================================================

  const handleUserLogout = () => {

    localStorage.removeItem("user");

    setUser(null);
    setDropdownOpen(false);

    window.dispatchEvent(
      new Event("userLogout")
    );

    navigate("/login");
  };


  // =====================================================
  // COMPANY LOGOUT
  // =====================================================

  const handleCompanyLogout = () => {

    localStorage.removeItem("company");

    setCompany(null);
    setDropdownOpen(false);

    window.dispatchEvent(
      new Event("companyLogout")
    );

    navigate("/company-login");
  };


  // =====================================================
  // ADMIN LOGOUT
  // =====================================================

  const handleAdminLogout = () => {

    localStorage.removeItem("admin");

    setAdmin(null);
    setDropdownOpen(false);

    window.dispatchEvent(
      new Event("adminLogout")
    );

    navigate("/login");
  };


  // =====================================================
  // NAVBAR
  // =====================================================

  return (

    <nav className="navbar">

      {/* =================================================
          LOGO
      ================================================= */}

      <div className="navbar-logo">

        <Link to="/">

          <img
            src={logo}
            alt="CareerGo"
          />

        </Link>

      </div>


      {/* =================================================
          NAVIGATION LINKS
      ================================================= */}

      <div className="navbar-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/jobs">
          Jobs
        </Link>

        <Link to="/companies">
          Companies
        </Link>

        <Link to="/about">
          About
        </Link>

      </div>



      <div className="navbar-auth">

        {admin ? (

          <div className="profile-container">

            <button
              className="profile-button"
              onClick={() =>
                setDropdownOpen(!dropdownOpen)
              }
            >

              <span className="profile-icon">
                🛡️
              </span>

              <span>
                {admin.name}
              </span>

              <span className="profile-arrow">
                {dropdownOpen ? "▲" : "▼"}
              </span>

            </button>


            {dropdownOpen && (

              <div className="profile-dropdown">

                {/* ADMIN DASHBOARD */}

                <Link
                  to="/admin-dashboard"
                  onClick={() =>
                    setDropdownOpen(false)
                  }
                >
                  🛡️ Admin Dashboard
                </Link>


                {/* ADMIN LOGOUT */}

                <button
                  className="dropdown-logout"
                  onClick={handleAdminLogout}
                >
                  🚪 Logout
                </button>

              </div>

            )}

          </div>


        ) : company ? (


          /* =================================================
             COMPANY
          ================================================= */

          <div className="profile-container">

            <button
              className="profile-button"
              onClick={() =>
                setDropdownOpen(!dropdownOpen)
              }
            >

              <span className="profile-icon">
                🏢
              </span>

              <span>
                {company.name}
              </span>

              <span className="profile-arrow">
                {dropdownOpen ? "▲" : "▼"}
              </span>

            </button>


            {dropdownOpen && (

              <div className="profile-dropdown">

                {/* COMPANY DASHBOARD */}

                <Link
                  to="/company-dashboard"
                  onClick={() =>
                    setDropdownOpen(false)
                  }
                >
                  🏢 Company Dashboard
                </Link>


                {/* COMPANY LOGOUT */}

                <button
                  className="dropdown-logout"
                  onClick={handleCompanyLogout}
                >
                  🚪 Logout
                </button>

              </div>

            )}

          </div>


        ) : user ? (


          /* =================================================
             JOB SEEKER
          ================================================= */

          <div className="profile-container">

            <button
              className="profile-button"
              onClick={() =>
                setDropdownOpen(!dropdownOpen)
              }
            >

              <span className="profile-icon">
                👤
              </span>

              <span>
                {user.name}
              </span>

              <span className="profile-arrow">
                {dropdownOpen ? "▲" : "▼"}
              </span>

            </button>


            {dropdownOpen && (

              <div className="profile-dropdown">

                {/* PROFILE */}

                <Link
                  to="/profile"
                  onClick={() =>
                    setDropdownOpen(false)
                  }
                >
                  👤 Profile
                </Link>


                {/* APPLIED JOBS */}

                <Link
                  to="/applied-jobs"
                  onClick={() =>
                    setDropdownOpen(false)
                  }
                >
                  📋 Applied Jobs
                </Link>


                {/* SAVED JOBS */}

                <Link
                  to="/saved-jobs"
                  onClick={() =>
                    setDropdownOpen(false)
                  }
                >
                  🔖 Saved Jobs
                </Link>


                {/* USER LOGOUT */}

                <button
                  className="dropdown-logout"
                  onClick={handleUserLogout}
                >
                  🚪 Logout
                </button>

              </div>

            )}

          </div>


        ) : (


          /* =================================================
             NOT LOGGED IN
          ================================================= */

          <>

            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>


            <Link
              to="/register"
              className="register-btn"
            >
              Register
            </Link>

          </>

        )}

      </div>

    </nav>

  );
}

export default Navbar;