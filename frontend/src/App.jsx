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

  const isActive = (path) => {
    return location.pathname === path
      ? "company-sidebar-link active"
      : "company-sidebar-link";
  };

  const handleLogout = () => {
    localStorage.removeItem("company");
    navigate("/company-login");
  };

  return (
    <aside className="company-sidebar">

      {/* LOGO */}

      <div className="company-sidebar-logo">
        <Link to="/company-dashboard">
          <img
            src="/logo.png"
            alt="CareerGo"
          />
        </Link>
      </div>

      <div className="company-sidebar-line"></div>

      {/* MENU */}

      <nav className="company-sidebar-menu">

        <Link
          to="/company-dashboard"
          className={isActive("/company-dashboard")}
        >
          <span className="company-menu-icon">
            ⌂
          </span>

          <span>
            Dashboard
          </span>
        </Link>

        <Link
          to="/post-job"
          className={isActive("/post-job")}
        >
          <span className="company-menu-icon">
            +
          </span>

          <span>
            Post a Job
          </span>
        </Link>

        <Link
          to="/my-jobs"
          className={
            location.pathname === "/my-jobs" ||
            location.pathname.startsWith("/edit-job/")
              ? "company-sidebar-link active"
              : "company-sidebar-link"
          }
        >
          <span className="company-menu-icon">
            ▣
          </span>

          <span>
            My Jobs
          </span>
        </Link>

        <Link
          to="/applications"
          className={isActive("/applications")}
        >
          <span className="company-menu-icon">
            ◉
          </span>

          <span>
            Applications
          </span>
        </Link>

        <Link
          to="/company-profile"
          className={isActive("/company-profile")}
        >
          <span className="company-menu-icon">
            ●
          </span>

          <span>
            Company Details
          </span>
        </Link>

      </nav>

      {/* BOTTOM COMPANY INFO */}

      <div className="company-sidebar-bottom">

        <div className="company-sidebar-line"></div>

        <div className="company-sidebar-company">

          <div className="company-sidebar-avatar">
            {company?.name
              ? company.name.charAt(0).toUpperCase()
              : "C"}
          </div>

          <div className="company-sidebar-company-info">

            <strong>
              {company?.name || "Company"}
            </strong>

            <span>
              {company?.email || "company@email.com"}
            </span>

          </div>

        </div>

        <button
          type="button"
          className="company-sidebar-logout"
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

  /*
    Company pages where sidebar should remain visible
  */

  const companyPages = [
    "/company-dashboard",
    "/post-job",
    "/my-jobs",
    "/applications",
    "/company-profile"
  ];

  const isCompanyPage =
    companyPages.some((page) =>
      location.pathname === page ||
      location.pathname.startsWith(page + "/")
    ) ||
    location.pathname.startsWith("/edit-job/");

  return (
    <>

      {/* NORMAL NAVBAR */}

      {!isCompanyPage && <Navbar />}

      {/* COMPANY SIDEBAR */}

      {isCompanyPage && <CompanySidebar />}

      {/* PAGE CONTENT */}

      <main
        className={
          isCompanyPage
            ? "company-page-content"
            : "normal-page-content"
        }
      >

        <Routes>

          {/* NORMAL WEBSITE */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/jobs"
            element={<Jobs />}
          />

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

          {/* COMPANY AUTH */}

          <Route
            path="/company-register"
            element={<CompanyRegister />}
          />

          <Route
            path="/company-login"
            element={<CompanyLogin />}
          />

          {/* COMPANY PAGES */}

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

          {/* USER */}

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

          {/* ADMIN */}

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
