
import { Routes, Route } from "react-router-dom";

// Page Imports
import Home from "../Pages/Home";
import JobListing from "../Pages/JobListing";
import JobDetails from "../Pages/JobDetails";
import CompaniesPage from "../Pages/CompaniesPage";
import SavedJobs from "../Pages/SavedJobs";
import UserPublicProfile from "../Pages/UserPublicProfile";
import MockInterview from "../Pages/MockInterview";
import NotFound from "../components/NotFound";

// Auth & Onboarding
import Login from "../components/LoginSignup/Login";
import Signup from "../components/LoginSignup/Signup";
import UserOnboarding from "../components/LoginSignup/UserOnboaring";
import CompanyOnboarding from "../components/LoginSignup/CompanyOnboarding";

// Private/Protected Pages
import UserProfile from "../Pages/UserProfile";
import JobPosting from "../Pages/JobPosting";
import CompanyDashboard from "../Pages/CompanyDashboard";
import ApplicantInformation from "../Pages/ApplicantInformation";
import PrivateRoutes from "./PrivateRoutes";


function AllRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<JobListing />} />
      <Route path="/job/:id" element={<JobDetails />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/user/:id" element={<UserPublicProfile />} />
      
      {/* Auth & Onboarding Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/user-onboarding" element={<UserOnboarding />} />
      <Route path="/company-onboarding" element={<CompanyOnboarding />} />
      
      {/* --- Protected Routes --- */}
      {/* These will redirect to /login if the user is not authenticated. */}
      <Route path="/profile" element={<PrivateRoutes><UserProfile /></PrivateRoutes>} />
      <Route path="/saved-jobs" element={<PrivateRoutes><SavedJobs /></PrivateRoutes>} />
      <Route path="/mock-interview/:jobId" element={<PrivateRoutes><MockInterview /></PrivateRoutes>} />

      {/* Employer-specific routes */}
      <Route path="/post-new-job" element={<PrivateRoutes><JobPosting /></PrivateRoutes>} />
      <Route path="/dashboard/*" element={<PrivateRoutes><CompanyDashboard /></PrivateRoutes>} />
      <Route path="/applicant" element={<PrivateRoutes><ApplicantInformation /></PrivateRoutes>} />

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AllRoutes;