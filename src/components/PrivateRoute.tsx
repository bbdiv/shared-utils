import { useEffect, useState, useRef, type ReactNode } from "react";
import { useAuth, useAuthStore } from "../store/auth";
import { refreshToken } from "../utils/auth";

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * PrivateRoute component that validates the idToken from the auth store.
 * If the token is invalid (null or empty), it triggers the refreshToken function.
 * Only renders children when the token is valid.
 */

const isTokenValid = (token: string | undefined): boolean => {
    return token != null && token.trim() !== "";
  };

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { auth } = useAuth();
  const [isValidating, setIsValidating] = useState(true);
  const isRefreshingRef = useRef(false);

  

  useEffect(() => {
    const validateAndRefreshToken = async () => {
      const token = auth?.idToken;
      
      if (!isTokenValid(token)) {
        // Only attempt refresh if not already refreshing
        if (!isRefreshingRef.current) {
          isRefreshingRef.current = true;
          setIsValidating(true);
          try {
            await refreshToken();
            // After refresh, saveAuth updates the store synchronously
            // Check the store directly to get the latest token value
            const updatedAuth = useAuthStore.getState().auth;
            if (isTokenValid(updatedAuth?.idToken)) {
              setIsValidating(false);
            } else {
              // Edge case: refresh succeeded but token is still invalid
              // Stop validating to prevent infinite loading
              setIsValidating(false);
            }
            // The effect will also re-run because auth?.idToken changed
            isRefreshingRef.current = false;
          } catch (error) {
            // refreshToken already handles redirect to /login on error
            console.error("Failed to refresh token:", error);
            isRefreshingRef.current = false;
            setIsValidating(false);
          }
        }
      } else {
        // Token is valid
        isRefreshingRef.current = false;
        setIsValidating(false);
      }
    };

    validateAndRefreshToken();
  }, [auth?.idToken]);

  // Show nothing while validating/refreshing
  if (isValidating || !isTokenValid(auth?.idToken)) {
    return <div>Loading...</div>;
  }

  // Render children when token is valid
  return <>{children}</>;
};

