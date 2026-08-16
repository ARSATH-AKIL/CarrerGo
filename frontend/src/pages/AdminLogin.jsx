import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {

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
        "https://servercarrergo.onrender.com/api/admin/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );

      const data = await response.json();

      console.log("ADMIN LOGIN RESPONSE:", data);

      if (response.ok) {

        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin)
        );

        setMessage("Admin login successful!");

        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 500);

      } else {

        setMessage(
          data.message || "Admin login failed"
        );

      }

    } catch (error) {

      console.error("ADMIN LOGIN ERROR:", error);

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
        <h2>Admin Login</h2>
        <p>
          Login to CareerGo Admin Panel
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
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
              : "Admin Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;