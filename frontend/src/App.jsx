import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import CompanyLayout from "./components/CompanyLayout";

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

      <Routes>

        {/* NORMAL USER PAGES */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />

        <Route
          path="/jobs"
          element={
            <>
              <Navbar />
              <Jobs />
            </>
          }
        />

        <Route
          path="/companies"
          element={
            <>
              <Navbar />
              <Companies />
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
            </>
          }
        />

        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />

        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
            </>
          }
        />

        <Route
          path="/apply"
          element={
            <>
              <Navbar />
              <ApplyJob />
            </>
          }
        />

        <Route
          path="/job-details/:id"
          element={
            <>
              <Navbar />
              <JobDetails />
            </>
          }
        />

        {/* COMPANY LOGIN / REGISTER */}

        <Route
          path="/company-register"
          element={<CompanyRegister />}
        />

        <Route
          path="/company-login"
          element={<CompanyLogin />}
        />


        {/* COMPANY LAYOUT */}

        <Route element={<CompanyLayout />}>

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

        </Route>


        {/* USER PAGES */}

        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />

        <Route
          path="/applied-jobs"
          element={
            <>
              <Navbar />
              <AppliedJobs />
            </>
          }
        />

        <Route
          path="/saved-jobs"
          element={
            <>
              <Navbar />
              <SavedJobs />
            </>
          }
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

    </BrowserRouter>

  );

}

export default App;
