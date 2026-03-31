import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { userService } from "../../services/userService";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../../store/authSlice";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

function Signup() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [userType, setUserType] = useState("jobSeeker");
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const resetErrorMessage = () => setTimeout(() => setErrorMessage(""), 6000);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFormSubmission = (e) => {
		e.preventDefault();
		if (!PASSWORD_REGEX.test(formData.password)) {
			setErrorMessage(
				"Password needs: uppercase, lowercase, digit, special character, 6+ chars.",
			);
			return resetErrorMessage();
		}
		if (formData.password !== formData.confirmPassword) {
			setErrorMessage("Passwords don't match. Please try again.");
			return resetErrorMessage();
		}
		postUserData(formData);
	};

	const postUserData = async (data) => {
		setLoading(true);
		const { name, email, password } = data;
		const userData = {
			email,
			password,
			role: userType === "employer" ? "employer" : "jobSeeker",
			userProfile: userType === "employer" ? { companyName: name } : { name },
		};
		try {
			const res = await userService.signup(userData);
			const user = res?.user;
			if (!user) throw new Error("Signup failed — no user returned");
			dispatch(loginAction({ userData: user }));
			navigate(
				user.role === "jobSeeker" ? "/user-onboarding" : "/company-onboarding",
			);
		} catch (error) {
			setErrorMessage(
				error?.response?.data?.message ||
					"Something went wrong. Please try again.",
			);
			resetErrorMessage();
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = `${import.meta.env.VITE_API_URL}/users/auth/google`;
	};

	const getPasswordStrength = () => {
		const p = formData.password;
		if (!p) return null;
		let score = 0;
		if (p.length >= 6) score++;
		if (/[A-Z]/.test(p)) score++;
		if (/[0-9]/.test(p)) score++;
		if (/[@$!%*?&]/.test(p)) score++;
		if (score <= 1)
			return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
		if (score === 2)
			return { label: "Fair", color: "bg-amber-500", width: "w-2/4" };
		if (score === 3)
			return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
		return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
	};

	const strength = getPasswordStrength();
	const isEmployer = userType === "employer";
	const leftHeadline = isEmployer
		? "Hire smarter with AI."
		: "Find the job made for you.";
	const leftSub = isEmployer
		? "AI-rank candidates, screen resumes, and build your dream team faster."
		: "Browse 10K+ jobs matched to your skills. Apply in minutes.";
	const leftFeatures = isEmployer
		? [
				"AI Candidate Ranking",
				"Resume Screening",
				"Interview Q Generator",
				"ATS Pipeline",
			]
		: [
				"AI Job Matching",
				"Resume Score",
				"Skill Gap Analysis",
				"Instant Apply",
			];

	return (
		<div className="min-h-screen bg-[#0D0F12] flex">
			{/* LEFT PANEL */}
			<div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
				<div className="absolute inset-0">
					<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
					<div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl" />
				</div>
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
						backgroundSize: "48px 48px",
					}}
				/>
				<div className="relative flex items-center gap-3">
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
				
				</div>
				<div className="relative space-y-6">
					<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
						<span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
						<span className="text-xs font-semibold text-indigo-400">
							{isEmployer ? "For Employers" : "For Job Seekers"}
						</span>
					</div>
					<h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
						{leftHeadline.split(" ").slice(0, -1).join(" ")}{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
							{leftHeadline.split(" ").slice(-1)[0]}
						</span>
					</h1>
					<p className="text-gray-500 text-lg leading-relaxed max-w-md">
						{leftSub}
					</p>
					<div className="flex flex-wrap gap-2 pt-2">
						{leftFeatures.map((f) => (
							<div
								key={f}
								className="flex items-center gap-2 px-3 py-2 bg-white/[0.04] border border-white/5 rounded-xl"
							>
								<svg
									className="w-3.5 h-3.5 text-indigo-400 shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2.5}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span className="text-xs font-medium text-gray-400">{f}</span>
							</div>
						))}
					</div>
				</div>
				<div className="relative grid grid-cols-3 gap-4">
					{[
						{
							value: "Free",
							label: isEmployer ? "14-day Trial" : "Forever Free",
						},
						{ value: "10K+", label: "Active Jobs" },
						{ value: "92%", label: "Placement Rate" },
					].map((s, i) => (
						<div
							key={i}
							className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center"
						>
							<p className="text-xl font-bold text-white">{s.value}</p>
							<p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
						</div>
					))}
				</div>
			</div>

			{/* RIGHT PANEL */}
			<div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 overflow-y-auto">
				<div className="flex items-center gap-3 mb-8 lg:hidden">
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
				</div>

				<div className="w-full max-w-sm mx-auto">
					<div className="flex items-center gap-1 p-1 bg-white/5 border border-white/5 rounded-xl mb-8">
						{[
							{ key: "jobSeeker", label: "Job Seeker", icon: "👤" },
							{ key: "employer", label: "Employer", icon: "🏢" },
						].map((tab) => (
							<button
								key={tab.key}
								onClick={() => setUserType(tab.key)}
								className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${userType === tab.key ? "bg-indigo-600 text-white shadow" : "text-gray-500 hover:text-gray-300"}`}
							>
								<span>{tab.icon}</span>
								{tab.label}
							</button>
						))}
					</div>

					<div className="mb-6">
						<h2 className="text-2xl sm:text-3xl font-bold text-white">
							Create account
						</h2>
						<p className="text-gray-500 mt-1.5 text-sm">
							{isEmployer
								? "Start hiring smarter today."
								: "Your next opportunity awaits."}
						</p>
					</div>

					<form onSubmit={handleFormSubmission} className="space-y-4">
						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
								{isEmployer ? "Company Name" : "Full Name"}
							</label>
							<div className="relative">
								<div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										{isEmployer ? (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
											/>
										) : (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										)}
									</svg>
								</div>
								<input
									type="text"
									name="name"
									required
									value={formData.name}
									onChange={handleInputChange}
									placeholder={isEmployer ? "Acme Corp" : "John Doe"}
									className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
								Email
							</label>
							<div className="relative">
								<div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<input
									type="email"
									name="email"
									required
									value={formData.email}
									onChange={handleInputChange}
									placeholder="you@example.com"
									className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
								Password
							</label>
							<div className="relative">
								<div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								</div>
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									required
									value={formData.password}
									onChange={handleInputChange}
									placeholder="Min 6 characters"
									className="w-full pl-10 pr-11 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										{showPassword ? (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
											/>
										) : (
											<>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</>
										)}
									</svg>
								</button>
							</div>
							{strength && (
								<div className="space-y-1 pt-1">
									<div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
										<div
											className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
										/>
									</div>
									<p
										className={`text-xs font-medium ${strength.label === "Strong" ? "text-emerald-400" : strength.label === "Good" ? "text-blue-400" : strength.label === "Fair" ? "text-amber-400" : "text-red-400"}`}
									>
										{strength.label} password
									</p>
								</div>
							)}
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
								Confirm Password
							</label>
							<div className="relative">
								<div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600">
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
										/>
									</svg>
								</div>
								<input
									type={showConfirm ? "text" : "password"}
									name="confirmPassword"
									required
									value={formData.confirmPassword}
									onChange={handleInputChange}
									placeholder="Repeat password"
									className={`w-full pl-10 pr-11 py-3 bg-white/[0.04] border rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:ring-2 transition-all ${
										formData.confirmPassword &&
										formData.password !== formData.confirmPassword
											? "border-red-500/40 focus:border-red-500/50 focus:ring-red-500/10"
											: formData.confirmPassword && formData.password === formData.confirmPassword
												? "border-emerald-500/40 focus:border-emerald-500/50 focus:ring-emerald-500/10"
												: "border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/10"
									}`}
								/>
								<button
									type="button"
									onClick={() => setShowConfirm(!showConfirm)}
									className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										{showConfirm ? (
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
											/>
										) : (
											<>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
												/>
											</>
										)}
									</svg>
								</button>
								{formData.confirmPassword && (
									<div className="absolute right-10 top-1/2 -translate-y-1/2">
										{formData.password === formData.confirmPassword ? (
											<svg
												className="w-4 h-4 text-emerald-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2.5}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M5 13l4 4L19 7"
												/>
											</svg>
										) : (
											<svg
												className="w-4 h-4 text-red-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2.5}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										)}
									</div>
								)}
							</div>
						</div>

						{errorMessage && (
							<div className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
								<svg
									className="w-4 h-4 text-red-400 shrink-0 mt-0.5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
								<p className="text-xs text-red-400">{errorMessage}</p>
							</div>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:-translate-y-0.5 active:translate-y-0 text-sm mt-2"
						>
							{loading ? (
								<>
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Creating account...
								</>
							) : (
								<>
									Create Account{" "}
									<svg
										className="w-4 h-4"
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
								</>
							)}
						</button>
					</form>

					<div className="flex items-center gap-3 my-5">
						<div className="flex-1 h-px bg-white/5" />
						<span className="text-xs text-gray-600">or</span>
						<div className="flex-1 h-px bg-white/5" />
					</div>

					<button
						type="button"
						onClick={handleGoogleLogin}
						className="w-full flex items-center justify-center gap-3 py-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 rounded-xl text-sm font-medium text-gray-300 transition-all duration-150"
					>
						<svg className="w-4 h-4" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continue with Google
					</button>

					<p className="text-center text-sm text-gray-600 mt-6">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
						>
							Sign in
						</Link>
					</p>
					<p className="text-center text-xs text-gray-300 mt-3">
						By creating an account, you agree to our{" "}
						<a href="#" className="text-gray-500 hover:text-gray-400 underline">
							Terms
						</a>{" "}
						and{" "}
						<a href="#" className="text-gray-500 hover:text-gray-400 underline">
							Privacy Policy
						</a>
						.
					</p>
				</div>
			</div>
		</div>
	);
}

export default Signup;
