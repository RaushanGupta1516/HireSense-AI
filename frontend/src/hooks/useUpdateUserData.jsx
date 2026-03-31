import { useDispatch } from "react-redux";
import { userService } from "../services/userService";
import { login, logout, setLoadingFalse } from "../store/authSlice";


const useUpdateUserData = () => {
  const dispatch = useDispatch();

  const updateUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      // If we get user data, the session is valid.
      dispatch(login({ userData }));
      return; // Early exit on success
    } catch (error) {
      // The most common error is a 401, let's handle it specifically.
      if (error?.response?.status !== 401) {
        // Some other network error, just log out.
        dispatch(logout());
        return;
      }
    }

    // --- If we reach here, it means the first attempt failed with a 401 ---
    // Let's try to refresh the token.
    try {
      await userService.refreshToken();

      // After a successful refresh, try fetching the profile again.
      const freshUserData = await userService.getCurrentUser();
      if (freshUserData) {
        dispatch(login({ userData: freshUserData }));
      } else {
        // This shouldn't happen, but just in case.
        dispatch(logout());
      }
    } catch (refreshError) {
      // The refresh token was also invalid or expired. The user must log in again.
      dispatch(logout());
    }
  };

  // We've wrapped the core logic in a more descriptive function name.
  const checkSession = async () => {
    try {
      await updateUser();
    } finally {
      // No matter what happens, we need to stop the initial loading spinner.
      dispatch(setLoadingFalse());
    }
  };

  return checkSession;
};

export default useUpdateUserData;