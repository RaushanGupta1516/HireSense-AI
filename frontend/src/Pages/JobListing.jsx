
import MainJobSection from "../components/JobListing/MainJobSection";
import DisclaimerBanner from "../components/Common/DisclaimerBanner";
import TopBanner from "../components/JobListing/TopBanner";

function JobListing() {
  return (
    <div className="mt-16 bg-[#0D0F12] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
        <DisclaimerBanner />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
        <TopBanner />
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10 pb-10">
        <MainJobSection />
      </div>
    </div>
  );
}

export default JobListing;