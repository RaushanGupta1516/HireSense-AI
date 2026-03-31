import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AllRoutes from "./Routes/AllRoutes";
import useUpdateUserData from "./hooks/useUpdateUserData";

function App() {
  const location = useLocation();
  const updateUser = useUpdateUserData();

  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage for theme, default to dark.
    const saved = localStorage.getItem("hiresense-theme");
    return saved ? saved === "dark" : true;
  });

  // Fetch user data on initial load.
  useEffect(() => {
    updateUser();
  }, []);

  // Scroll to top on route change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Apply dark mode class to <html> and save preference.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("hiresense-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Some pages shouldn't have the main navbar (e.g., login, dashboard).
  const hideNavbar =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/company-onboarding") ||
    location.pathname.startsWith("/user-onboarding") ||
    ["/login", "/signup"].includes(location.pathname);

  return (
    // The bg color is mainly handled by Tailwind's dark mode,
    // but we set a base here for the root.
    <div className="min-h-screen bg-white text-gray-800 dark:bg-[#0D0F14] dark:text-gray-100 transition-colors duration-300">
      {!hideNavbar && (
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      )}
      <main className="w-full">
        <AllRoutes />
      </main>
    </div>
  );
}

export default App;