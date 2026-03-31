
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * A wrapper for routes that require authentication.
 * 1. Shows a loading spinner while checking the user's session.
 * 2. If the user is not authenticated, redirects them to the /login page.
 * 3. If the user is authenticated, it renders the child components.
 */
function PrivateRoutes({ children }) {
  const { status, isLoading } = useSelector((state) => state.auth);

  // The `isLoading` state is true on initial app load while we check for a token.
  // We show a spinner to prevent a flicker of the login page for logged-in users.
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-gray-500">Checking session...</p>
        </div>
      </div>
    );
  }

  // If the auth check is complete and there's no user, redirect.
  if (!status) {
    // `replace` prevents the user from navigating back to the protected page.
    return <Navigate to="/login" replace />;
  }

  // Otherwise, they're good to go.
  return children;
}

export default PrivateRoutes;