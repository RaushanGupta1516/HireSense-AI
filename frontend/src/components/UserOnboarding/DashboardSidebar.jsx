import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userService } from "../../services/userService";
import { logout } from "../../store/authSlice";
import useUpdateUserData from "../../hooks/useUpdateUserData";
import { useEffect } from "react";

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/dashboard/home",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    name: "Applications",
    href: "/dashboard/applications",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
  {
    name: "Shortlisted",
    href: "/dashboard/shortedlisted",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  },
  {
    name: "AI Search",
    href: "/dashboard/candidate-search",
    badge: "AI",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  },
  {
    name: "Post a Job",
    href: "/dashboard/post-job",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>,
  },
];

function DashboardSidebar() {
  const updateUser = useUpdateUserData();
  const { userData } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { updateUser(); }, []);

  const handleLogout = async () => {
    try { await userService.logout(); } catch {}
    finally { dispatch(logout()); navigate("/"); }
  };

  const logo = userData?.userProfile?.companyLogo;
  const companyName = userData?.userProfile?.companyName;
  const initial = companyName?.charAt(0) || "?";

  return (
    <div className="sticky top-0 flex h-screen w-full flex-col justify-between bg-[#0D0D0D] border-r border-white/5 px-2 py-6 xl:py-8 xl:px-4">

      {/* Logo */}
      <div className="px-2 mb-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="hidden xl:block text-base font-bold text-white tracking-tight">HireSense</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-1">
        {sidebarLinks.map((item) => (
          <NavLink to={item.href} key={item.name}>
            {({ isActive }) => (
              <span className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}>
                <span className={`shrink-0 ${isActive ? "text-indigo-400" : ""}`}>{item.icon}</span>
                <span className="hidden xl:block text-sm font-semibold flex-1">{item.name}</span>
                {item.badge && (
                  <span className="hidden xl:block text-xs px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
                {isActive && !item.badge && <span className="hidden xl:block ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-4 px-1">
        <div className="h-px bg-white/5 mb-4" />
        <div className="hidden xl:flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center shrink-0">
            {logo
              ? <img src={logo} alt={companyName} className="w-full h-full object-contain p-0.5" />
              : <span className="text-sm font-bold text-gray-500">{initial}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{companyName}</p>
            <p className="text-xs text-gray-600 truncate">@{userData?.username}</p>
          </div>
          <button onClick={handleLogout}
            className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Logout">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
        <div className="flex xl:hidden justify-center">
          <button onClick={handleLogout}
            className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebar;