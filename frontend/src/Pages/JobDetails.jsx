import { useState, useEffect } from "react";
import JobDetailsCard from "../components/JobDetails/JobDetailsCard";
import SimilerJobsSidebar from "../components/JobDetails/SimilerJobsSidebar";
import { contentService } from "../services/contentService";
import { useParams } from "react-router-dom";
import JobDescription from "../components/JobDetails/JobDescription";
import DisclaimerBanner from "../components/Common/DisclaimerBanner";
import CoverLetter from "../components/JobDetails/CoverLetter";
import { useSelector } from "react-redux";

function JobDetails() {
  const [jobData, setJobData] = useState(null);
  const { id } = useParams();
  const { userData } = useSelector((store) => store.auth);
  const isCandidate = userData?.role === "jobSeeker";

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await contentService.getSingleJob(id);
        setJobData(res);
      } catch (error) {
        console.log(error);
      }
    };
    getDetails();
  }, [id]);

  if (!jobData) return (
    <div className="mt-16 min-h-screen bg-[#0D0F12] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="mt-16 min-h-screen bg-[#0D0F12] px-4 sm:px-8 lg:px-12 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <DisclaimerBanner />
        </div>
        <div className="flex gap-8 lg:gap-10 flex-col md:flex-row">
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            <JobDetailsCard jobData={jobData} />
            <JobDescription jobData={jobData} />
            {isCandidate && <CoverLetter jobData={jobData} />}
          </div>
          <div className="w-full md:w-1/3">
            <div className="sticky top-24">
              <SimilerJobsSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;