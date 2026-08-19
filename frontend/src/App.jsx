import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Companies from "./pages/Companies";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ApplyJob from "./pages/ApplyJob";
import JobDetails from "./pages/JobDetails";
import CompanyRegister from "./pages/CompanyRegister";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyDashboard from "./pages/CompanyDashboard";
import PostJob from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import EditJob from "./pages/EditJob";
import Applications from "./pages/Applications";
import CompanyProfile from "./pages/CompanyProfile";
import Profile from "./pages/Profile";
import AppliedJobs from "./pages/AppliedJobs";
import SavedJobs from "./pages/SavedJobs";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";

function CompanySidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const storedCompany = localStorage.getItem("company");

  let company = null;

  try {
    company = storedCompany
      ? JSON.parse(storedCompany)
      : null;
  } catch (error) {
    company = null;
  }

  const getActiveClass = (path) => {
    if (location.pathname === path) {
      return "company-sidebar-link active";
    }

    return "company-sidebar-link";
  };

  const handleLogout = () => {
    localStorage.removeItem("company");
    navigate("/company-login");
  };

  return (
    <aside className="company-sidebar">

      <div className="company-logo-box">
        <Link to="/company-dashboard">
          <div className="careergo-logo">
            <span>C</span>
            <span>G</span>
          </div>
        </Link>
      </div>

      <div className="sidebar-divider"></div>

      <nav className="company-sidebar-menu">

        <Link
          to="/company-dashboard"
          className={getActiveClass("/company-dashboard")}
        >
          <span className="sidebar-icon">⌂</span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/post-job"
          className={getActiveClass("/post-job")}
        >
          <span className="sidebar-icon">+</span>
          <span>Post a Job</span>
        </Link>

        <Link
          to="/my-jobs"
          className={getActiveClass("/my-jobs")}
        >
          <span className="sidebar-icon">▣</span>
          <span>My Jobs</span>
        </Link>

        <Link
          to="/applications"
          className={getActiveClass("/applications")}
        >
          <span className="sidebar-icon">◉</span>
          <span>Applications</span>
        </Link>

        <Link
          to="/company-profile"
          className={getActiveClass("/company-profile")}
        >
          <span className="sidebar-icon">●</span>
          <span>Company Details</span>
        </Link>

      </nav>

      <div className="company-sidebar-bottom">

        <div className="sidebar-divider"></div>

        <div className="sidebar-company-info">

          <div className="sidebar-company-avatar">
            {company?.name
              ? company.name.charAt(0).toUpperCase()
              : "C"}
          </div>

          <div className="sidebar-company-text">

            <strong>
              {company?.name || "Company"}
            </strong>

            <small>
              {company?.email || "company@email.com"}
            </small>

          </div>

        </div>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </aside>
  );
}

function AppContent() {
  const location = useLocation();

  const companyRoutes = [
    "/company-dashboard",
    "/post-job",
    "/my-jobs",
    "/applications",
    "/company-profile"
  ];

  const isCompanyPage =
    companyRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/edit-job/");

  return (
    <>

      {!isCompanyPage && <Navbar />}

      {isCompanyPage && <CompanySidebar />}

      <main
        className={
          isCompanyPage
            ? "company-main-content"
            : "normal-main-content"
        }
      >

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/jobs" element={<Jobs />} />

          <Route
            path="/companies"
            element={<Companies />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/apply"
            element={<ApplyJob />}
          />

          <Route
            path="/job-details/:id"
            element={<JobDetails />}
          />

          <Route
            path="/company-register"
            element={<CompanyRegister />}
          />

          <Route
            path="/company-login"
            element={<CompanyLogin />}
          />

          <Route
            path="/company-dashboard"
            element={<CompanyDashboard />}
          />

          <Route
            path="/post-job"
            element={<PostJob />}
          />

          <Route
            path="/my-jobs"
            element={<MyJobs />}
          />

          <Route
            path="/edit-job/:id"
            element={<EditJob />}
          />

          <Route
            path="/applications"
            element={<Applications />}
          />

          <Route
            path="/company-profile"
            element={<CompanyProfile />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/applied-jobs"
            element={<AppliedJobs />}
          />

          <Route
            path="/saved-jobs"
            element={<SavedJobs />}
          />

          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin-dashboard"
            element={<AdminDashboard />}
          />

        </Routes>

      </main>

    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
