import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://servercarrergo.onrender.com/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (response.ok) {

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // Tell Navbar that user has logged in
        window.dispatchEvent(
          new Event("userLogin")
        );

        console.log("LOGGED USER:", data.user);

        setMessage("Login successful!");

        setTimeout(() => {
          navigate("/");
        }, 1000);

      } else {

        setMessage(
          data.message || "Login failed"
        );

      }

    } catch (error) {

      console.error("LOGIN ERROR:", error);

      setMessage(
        "Unable to connect to CareerGo backend"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h2>Welcome Back</h2>

        <p>
          Login to your CareerGo account
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="auth-footer">

          Don't have an account?
          <Link to="/register">
            {" "}Register
          </Link>
        </p>
        <div className="company-auth">
          <p>Are you a Company?</p>
          <div className="company-auth-buttons">
            <Link to="/company-login">
              Company Login
            </Link>
            <Link to="/company-register">
              Company Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;