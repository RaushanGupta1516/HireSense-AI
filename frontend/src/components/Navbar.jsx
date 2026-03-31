import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userService } from "../services/userService";
import { logout } from "../store/authSlice";
import { apiCall } from "../services/apiBase";

// ── MODERN HIRESENSE LOGO ──
function HSLogo({ size = 32 }) {
	return (
		<div style={{ width: size, height: size }} className="shrink-0 relative">
			<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
				<svg
					width={size * 0.55}
					height={size * 0.55}
					viewBox="0 0 18 18"
					fill="none"
				>
					<path
						d="M4 9h10M9 4v10"
						stroke="white"
						strokeWidth="2"
						strokeLinecap="round"
					/>
					<circle cx="9" cy="9" r="3" fill="white" fillOpacity="0.3" />
					<circle cx="9" cy="9" r="1.5" fill="white" />
				</svg>
			</div>
		</div>
	);
}

function Navbar({ darkMode, toggleDarkMode }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { status, userData } = useSelector((store) => store.auth);

	const [menuOpen, setMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [notifOpen, setNotifOpen] = useState(false);
	const [notifications, setNotifications] = useState([]);

	const dropdownRef = useRef(null);
	const notifRef = useRef(null);

	const [profilePicture, setProfilePicture] = useState(
		"https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg",
	);

	const navLinks = [
		{ title: "Home", path: "/" },
		{ title: "Jobs", path: "/jobs" },
		{ title: "Companies", path: "/companies" },
	];

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 8);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		setMenuOpen(false);
		setDropdownOpen(false);
		setNotifOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target))
				setDropdownOpen(false);
			if (notifRef.current && !notifRef.current.contains(e.target))
				setNotifOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	useEffect(() => {
		const picture =
			userData?.userProfile?.profilePicture ||
			userData?.userProfile?.companyLogo;
		if (picture) setProfilePicture(picture);
	}, [userData]);

	useEffect(() => {
		if (!status) return;
		fetchNotifications();
		const interval = setInterval(fetchNotifications, 30000);
		return () => clearInterval(interval);
	}, [status]);

	const fetchNotifications = async () => {
		try {
			const data = await apiCall("get", "/users/notifications");
			setNotifications(data || []);
		} catch {}
	};

	const handleMarkAllRead = async () => {
		try {
			await apiCall("patch", "/users/notifications/read");
			setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
		} catch {}
	};

	const unreadCount = notifications.filter((n) => !n.read).length;

	const handleLogout = async () => {
		try {
			await userService.logout();
		} catch {
		} finally {
			dispatch(logout());
			navigate("/login");
		}
	};

	const handleProfileClick = () => {
		if (userData?.role === "employer") navigate("/dashboard/home");
		else setDropdownOpen((prev) => !prev);
	};

	const isEmployer = userData?.role === "employer";
	const displayName =
		userData?.userProfile?.name || userData?.userProfile?.companyName || "User";

	const getTimeAgo = (date) => {
		const diff = Date.now() - new Date(date);
		const mins = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);
		if (mins < 60) return `${mins}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	};

	return (
		<nav
			className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 ${
				scrolled
					? "bg-[#0D0F14]/95 backdrop-blur-xl border-b border-indigo-900/30 shadow-lg shadow-black/20"
					: "bg-[#0D0F14]/70 backdrop-blur-md border-b border-white/[0.04]"
			}`}
		>
			<div className="max-w-[1200px] mx-auto px-6">
				<div className="flex items-center justify-between h-14">
					{/* LOGO — always navigates home */}
					<Link to="/" className="flex items-center gap-2.5 shrink-0">
						<div className="relative w-7 h-7">
							<div className="absolute inset-0 rounded-lg bg-white flex items-center justify-center">
								<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
									<path d="M8 1L15 13H1L8 1Z" fill="#000000" />
								</svg>
							</div>
						</div>
						<span className="text-[15px] font-semibold text-white tracking-tight">
							HireSense
						</span>
						<span className="hidden sm:flex items-center h-5">
							<span className="w-px h-4 bg-white/20" />
						</span>
						<span className="hidden sm:block text-[11px] font-medium text-white/40 tracking-widest uppercase">
							AI
						</span>
					</Link>
					{/* CENTER NAV */}
					<ul className="hidden lg:flex items-center gap-1">
						{navLinks.map((link) => (
							<li key={link.path}>
								<NavLink
									to={link.path}
									className={({ isActive }) =>
										`px-4 py-1.5 text-sm transition-all duration-150 rounded-lg ${
											isActive
												? "text-white font-semibold bg-white/10"
												: "text-white/50 hover:text-white hover:bg-white/5 font-normal"
										}`
									}
								>
									{link.title}
								</NavLink>
							</li>
						))}
					</ul>

					{/* RIGHT CTA */}
					<div className="hidden lg:flex items-center gap-2">
						{!status ? (
							<>
								<Link
									to="/login"
									className="text-sm text-white/60 hover:text-white transition-colors font-normal px-3 py-1.5"
								>
									Log in
								</Link>
								<Link
									to="/signup"
									className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg transition-all shadow-lg shadow-indigo-900/40"
								>
									Get Started
									<svg
										className="w-3.5 h-3.5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2.5}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M13 7l5 5m0 0l-5 5m5-5H6"
										/>
									</svg>
								</Link>
							</>
						) : (
							<div className="flex items-center gap-2">
								{/* Notifications */}
								<div className="relative" ref={notifRef}>
									<button
										onClick={() => setNotifOpen((p) => !p)}
										className="relative p-2 text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/5"
									>
										<svg
											className="w-4 h-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={1.8}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
											/>
										</svg>
										{unreadCount > 0 && (
											<span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
												{unreadCount > 9 ? "9+" : unreadCount}
											</span>
										)}
									</button>

									{notifOpen && (
										<div className="absolute right-0 mt-2 w-80 bg-[#131720] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
											<div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
												<div className="flex items-center gap-2">
													<span className="text-xs font-semibold text-white">
														Notifications
													</span>
													{unreadCount > 0 && (
														<span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded-full">
															{unreadCount} new
														</span>
													)}
												</div>
												{unreadCount > 0 && (
													<button
														onClick={handleMarkAllRead}
														className="text-xs text-white/30 hover:text-white/60 transition-colors"
													>
														Mark all read
													</button>
												)}
											</div>
											<div className="max-h-72 overflow-y-auto">
												{notifications.length === 0 ? (
													<div className="flex flex-col items-center justify-center py-10 gap-2">
														<svg
															className="w-8 h-8 text-gray-700"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
															strokeWidth={1.5}
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
															/>
														</svg>
														<p className="text-xs text-white/20">
															You're all caught up!
														</p>
													</div>
												) : (
													notifications.map((n, i) => (
														<div
															key={i}
															className={`px-4 py-3 border-b border-white/[0.04] last:border-0 ${!n.read ? "bg-indigo-500/[0.04]" : ""}`}
														>
															<div className="flex items-start gap-3">
																{!n.read && (
																	<span className="mt-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0" />
																)}
																<div className={!n.read ? "" : "pl-4"}>
																	<p className="text-xs text-gray-300 leading-relaxed">
																		{n.message}
																	</p>
																	<p className="text-xs text-white/20 mt-1">
																		{getTimeAgo(n.createdAt)}
																	</p>
																</div>
															</div>
														</div>
													))
												)}
											</div>
										</div>
									)}
								</div>

								{/* Profile */}
								<div className="relative" ref={dropdownRef}>
									<button
										onClick={handleProfileClick}
										className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
									>
										<img
											src={profilePicture}
											alt="profile"
											className="w-6 h-6 rounded-lg object-cover ring-1 ring-white/20"
										/>
										<span className="hidden xl:block text-sm text-white/70 font-normal">
											{displayName.split(" ")[0]}
										</span>
										<svg
											className="w-3 h-3 text-white/30 hidden xl:block"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											strokeWidth={2}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</button>

									{dropdownOpen && !isEmployer && (
										<div className="absolute right-0 mt-2 w-48 bg-[#131720] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
											<div className="px-3 py-2.5 border-b border-white/5">
												<p className="text-xs font-medium text-white truncate">
													{displayName}
												</p>
												<p className="text-xs text-white/30 truncate mt-0.5">
													{userData?.email}
												</p>
											</div>
											<div className="p-1">
												{[
													{ to: "/profile", label: "Profile" },
													{ to: "/saved-jobs", label: "Saved Jobs" },
													{ to: "/jobs", label: "Browse Jobs" },
												].map((item) => (
													<Link
														key={item.to}
														to={item.to}
														className="block px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
													>
														{item.label}
													</Link>
												))}
											</div>
											<div className="border-t border-white/5 p-1">
												<button
													onClick={() => {
														handleLogout();
														setDropdownOpen(false);
													}}
													className="block w-full text-left px-3 py-1.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors"
												>
													Log out
												</button>
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{/* Mobile button */}
					<button
						className="lg:hidden p-1.5 text-white/50 hover:text-white transition-colors"
						onClick={() => setMenuOpen(!menuOpen)}
					>
						{menuOpen ? (
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.8}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						) : (
							<svg
								className="w-5 h-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								strokeWidth={1.8}
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M4 6h16M4 12h16M4 18h16"
								/>
							</svg>
						)}
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			<div
				className={`lg:hidden border-t border-white/5 bg-[#0D0F14]/95 backdrop-blur-xl transition-all duration-200 overflow-hidden ${menuOpen ? "max-h-screen" : "max-h-0"}`}
			>
				<div className="px-6 py-4 space-y-1">
					{navLinks.map((link) => (
						<NavLink
							key={link.path}
							to={link.path}
							className={({ isActive }) =>
								`block px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? "text-white bg-white/10" : "text-white/50 hover:text-white"}`
							}
						>
							{link.title}
						</NavLink>
					))}
					<div className="pt-3 border-t border-white/5 space-y-2">
						{!status ? (
							<>
								<Link
									to="/login"
									className="block px-3 py-2 text-sm text-white/50 hover:text-white"
								>
									Log in
								</Link>
								<Link
									to="/signup"
									className="block text-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg"
								>
									Get Started
								</Link>
							</>
						) : (
							<>
								<div className="flex items-center gap-3 px-3 py-2">
									<img
										src={profilePicture}
										alt="profile"
										className="w-8 h-8 rounded-xl object-cover"
									/>
									<div>
										<p className="text-sm text-white font-medium">
											{displayName}
										</p>
										<p className="text-xs text-white/30 capitalize">
											{userData?.role}
										</p>
									</div>
								</div>
								{!isEmployer && (
									<>
										<Link
											to="/profile"
											className="block px-3 py-2 text-sm text-white/50 hover:text-white"
										>
											Profile
										</Link>
										<Link
											to="/saved-jobs"
											className="block px-3 py-2 text-sm text-white/50 hover:text-white"
										>
											Saved Jobs
										</Link>
									</>
								)}
								{isEmployer && (
									<Link
										to="/dashboard/home"
										className="block px-3 py-2 text-sm text-white/50 hover:text-white"
									>
										Dashboard
									</Link>
								)}
								<button
									onClick={handleLogout}
									className="block w-full text-left px-3 py-2 text-sm text-red-400"
								>
									Log out
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
