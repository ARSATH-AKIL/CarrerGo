import { useState } from "react";
import { Link } from "react-router-dom";

function CompanyRegister() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    industry: "",
    password: "",
    confirmPassword: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "https://servercarrergo.onrender.com/api/company/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            location: formData.location,
            industry: formData.industry,
            password: formData.password
          })
        }
      );

      const data = await response.json();

      console.log("Backend Response:", data);

      if (response.ok) {

        setMessage(
          data.message || "Company registered successfully"
        );

        setFormData({
          name: "",
          email: "",
          location: "",
          industry: "",
          password: "",
          confirmPassword: ""
        });

      } else {

        setMessage(
          data.message || "Company registration failed"
        );

      }

    } catch (error) {

      console.error("Company Register Error:", error);

      setMessage(
        "Unable to connect to CareerGo backend"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="company-register-page">

      <div className="company-register-card">

        <div className="company-register-header">

          <h2>Register Your Company</h2>

          <p>
            Create a company account on CareerGo
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Company Name */}

          <div className="register-form-group">

            <label>Company Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter company name"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          <div className="register-form-group">

            <label>Company Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter company email"
              value={formData.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* Location */}

          <div className="register-form-group">

            <label>Company Location</label>

            <input
              type="text"
              name="location"
              placeholder="Enter company location"
              value={formData.location}
              onChange={handleChange}
            />

          </div>

          {/* Industry */}

          <div className="register-form-group">

            <label>Industry</label>

            <input
              type="text"
              name="industry"
              placeholder="Example: IT, Finance, Healthcare"
              value={formData.industry}
              onChange={handleChange}
            />

          </div>

          {/* Password */}

          <div className="register-form-group">

            <label>Create Password</label>

            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
            />

          </div>

          {/* Confirm Password */}

          <div className="register-form-group">

            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

          </div>

          {/* Register Button */}

          <button
            type="submit"
            className="company-register-btn"
            disabled={loading}
          >

            {loading ? "Registering..." : "Register Company"}

          </button>

        </form>

        {/* Message */}

        {message && (
          <p className="register-message">
            {message}
          </p>
        )}

        {/* Company Login */}

        <p className="company-register-footer">

          Already have a company account?

          <Link to="/company-login">
            {" "}Company Login
          </Link>

        </p>

      </div>

    </div>

  );
}

export default CompanyRegister;