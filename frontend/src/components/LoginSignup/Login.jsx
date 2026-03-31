import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../../store/authSlice";

function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [formData, setFormData] = useState({ email: "", password: "" });

	const resetErrorMessage = () => setTimeout(() => setErrorMessage(""), 5000);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFormSubmission = (e) => {
		e.preventDefault();
		makeLoginRequest(formData);
	};

	const makeLoginRequest = async (userData) => {
		setLoading(true);
		try {
			const res = await userService.login(userData);
			const user = res?.user;
			if (!user) throw new Error("Login failed — no user returned");
			dispatch(loginAction({ userData: user }));
			if (user.role === "jobSeeker") {
				navigate(user.userProfile?.doneOnboarding ? "/" : "/user-onboarding");
			} else if (user.role === "employer") {
				navigate(
					user.userProfile?.doneOnboarding
						? "/dashboard/home"
						: "/company-onboarding",
				);
			}
		} catch (error) {
			setErrorMessage(error.response?.data?.message || "Invalid credentials.");
			resetErrorMessage();
		} finally {
			setLoading(false);
		}
	};

	const handleGoogleLogin = () => {
		window.location.href = `${import.meta.env.VITE_API_URL}/users/auth/google`;
	};

	return (
		<div className="min-h-screen bg-[#0D0F12] flex">
			{/* LEFT PANEL */}
			<div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-full">
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
							AI-Powered Hiring Platform
						</span>
					</div>
					<h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
						Find the job
						<br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
							made for you.
						</span>
					</h1>
					<p className="text-gray-500 text-lg leading-relaxed max-w-md">
						Browse over 10K+ jobs at top companies matched to your skills by AI.
						Apply in minutes.
					</p>
					<div className="flex items-center gap-4 pt-2">
						<div className="flex -space-x-2">
							{["#6366F1", "#8B5CF6", "#10B981", "#F59E0B"].map((c, i) => (
								<div
									key={i}
									className="w-8 h-8 rounded-full border-2 border-[#0D0F12] flex items-center justify-center text-xs font-bold text-white"
									style={{ backgroundColor: c }}
								>
									{["R", "A", "S", "M"][i]}
								</div>
							))}
						</div>
						<div>
							<div className="flex items-center gap-0.5">
								{[...Array(5)].map((_, i) => (
									<svg
										key={i}
										className="w-3.5 h-3.5 text-amber-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
							</div>
							<p className="text-xs text-gray-500 mt-0.5">
								Trusted by 20,000+ job seekers
							</p>
						</div>
					</div>
				</div>

				<div className="relative grid grid-cols-3 gap-4">
					{[
						{ value: "10K+", label: "Jobs Posted" },
						{ value: "92%", label: "Placement Rate" },
						{ value: "200+", label: "Companies" },
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
			<div className="w-full lg:w-1/2 xl:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
				<div className="flex items-center gap-3 mb-10 lg:hidden">
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
					<span className="text-white font-bold text-lg">
						HireSense<span className="text-indigo-400">AI</span>
					</span>
				</div>

				<div className="w-full max-w-sm mx-auto">
					<div className="mb-8">
						<h2 className="text-2xl sm:text-3xl font-bold text-white">
							Welcome back
						</h2>
						<p className="text-gray-500 mt-2 text-sm">
							Sign in to your HireSenseAI account
						</p>
					</div>

					<form onSubmit={handleFormSubmission} className="space-y-4">
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
									className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-150"
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
									placeholder="••••••••"
									className="w-full pl-10 pr-11 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-150"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
								>
									{showPassword ? (
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
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
											/>
										</svg>
									) : (
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
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between min-h-[20px]">
							{errorMessage ? (
								<p className="text-xs text-red-400 flex items-center gap-1.5">
									<svg
										className="w-3.5 h-3.5 shrink-0"
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
									{errorMessage}
								</p>
							) : (
								<span />
							)}
							<a
								href="#"
								className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
							>
								Forgot password?
							</a>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/30 hover:-translate-y-0.5 active:translate-y-0 text-sm mt-2"
						>
							{loading ? (
								<>
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Signing in...
								</>
							) : (
								<>
									Sign In{" "}
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

					<div className="flex items-center gap-3 my-6">
						<div className="flex-1 h-px bg-white/5" />
						<span className="text-xs text-gray-600">or continue with</span>
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
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						Continue with Google
					</button>

					<p className="text-center text-sm text-gray-600 mt-6">
						Don&apos;t have an account?{" "}
						<Link
							to="/signup"
							className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
						>
							Create one free
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Login;
