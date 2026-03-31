
import DashboardSidebar from "../components/UserOnboarding/DashboardSidebar";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../components/CompanyDashboard/Dashboard";
import Applications from "../components/CompanyDashboard/Applications";
import Shortlisted from "../components/CompanyDashboard/Shortlisted";
import JobPosting from "./JobPosting";
import CandidateSearch from "../components/CompanyDashboard/CandidateSearch";
import { useSelector } from "react-redux";

function CompanyDashboard() {
  const { userData } = useSelector((store) => store.auth);
  if (userData?.role !== "employer") return <Navigate to="/" />;

  return (
    <div className="flex min-h-screen bg-[#0D0F12]">
      <aside className="w-[64px] xl:w-[280px] shrink-0 sticky top-0 h-screen">
        <DashboardSidebar />
      </aside>
      <div className="flex-1 overflow-auto min-w-0">
        <Routes>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/shortedlisted" element={<Shortlisted />} />
          <Route path="/post-job" element={<JobPosting />} />
          <Route path="/candidate-search" element={<CandidateSearch />} />
        </Routes>
      </div>
    </div>
  );
}

export default CompanyDashboard;