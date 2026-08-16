import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CompanyLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // =====================================================
  // COMPANY LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://servercarrergo.onrender.com/api/company/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        }
      );

      const data = await response.json();

      console.log("Company Login Response:", data);

      // =================================================
      // LOGIN SUCCESS
      // =================================================

      if (response.ok) {
        console.log("Company login successful");

        // Save company information
        localStorage.setItem(
          "company",
          JSON.stringify(data.company)
        );

        // Tell Navbar that company has logged in
        window.dispatchEvent(
          new Event("companyLogin")
        );

        setMessage(
          data.message || "Company login successful"
        );

        // Clear form
        setFormData({
          email: "",
          password: ""
        });

        // Go to company dashboard
        navigate("/company-dashboard");

      } else {

        // =================================================
        // LOGIN FAILED
        // =================================================

        setMessage(
          data.message || "Company login failed"
        );
      }

    } catch (error) {

      console.error(
        "Company Login Error:",
        error
      );

      setMessage(
        "Unable to connect to CareerGo backend"
      );

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="company-login-page">

      <div className="company-login-card">

        {/* HEADER */}

        <div className="company-login-header">

          <h2>
            Company Login
          </h2>

          <p>
            Login to your CareerGo company account
          </p>

        </div>


        {/* LOGIN FORM */}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="company-login-form-group">

            <label>
              Company Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter company email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>


          {/* PASSWORD */}

          <div className="company-login-form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="company-login-btn"
            disabled={loading}
          >

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

        </form>


        {/* MESSAGE */}

        {message && (
          <p className="company-login-message">
            {message}
          </p>
        )}


        {/* REGISTER LINK */}

        <p className="company-login-footer">

          Don't have a company account?

          <Link to="/company-register">
            {" "}Register Your Company
          </Link>

        </p>

      </div>

    </div>
  );
}

export default CompanyLogin;