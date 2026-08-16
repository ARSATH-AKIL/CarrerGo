import { BrowserRouter, Routes, Route } from "react-router-dom";

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

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/companies" element={<Companies />} />

        <Route path="/about" element={<About />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/apply" element={<ApplyJob />} />

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

    </BrowserRouter>

  );
}

export default App;