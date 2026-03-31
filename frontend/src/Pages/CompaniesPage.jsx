import { useEffect, useState } from "react";
import CompanyCard from "../components/CompaniesPage/CompanyCard";
import { contentService } from "../services/contentService";
import DisclaimerBanner from "../components/Common/DisclaimerBanner";

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await contentService.getCompanies();
      setCompanies(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter((c) =>
    c.userProfile?.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0D0F12] pt-20 pb-16 px-4 sm:px-8 lg:px-12">

      {/* Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <DisclaimerBanner />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Top Companies Hiring</h1>
            <p className="text-sm text-gray-500 mt-1">Discover companies actively looking for talent</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search companies..."
                className="pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all w-52"
              />
            </div>

            {/* Count badge */}
            {!loading && (
              <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-gray-400">
                {filtered.length} {filtered.length === 1 ? "company" : "companies"}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#131720] border border-white/5 rounded-2xl p-5 animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/5" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-9 bg-white/5 rounded-xl" />
                  <div className="h-9 bg-white/5 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((company) => (
              <CompanyCard key={company._id} company={company.userProfile} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-gray-400 font-semibold">No companies found</p>
            <p className="text-gray-600 text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompaniesPage;