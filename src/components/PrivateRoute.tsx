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
  const lastAttemptedTokenRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const validateAndRefreshToken = async () => {
      const token = auth?.idToken;
      
      if (!isTokenValid(token)) {
        // Only attempt refresh if not already refreshing AND token has changed
        // This prevents infinite loops when refresh succeeds but token remains invalid
        const tokenChanged = lastAttemptedTokenRef.current !== token;
        if (!isRefreshingRef.current && tokenChanged) {
          isRefreshingRef.current = true;
          lastAttemptedTokenRef.current = token;
          setIsValidating(true);
          try {
            await refreshToken();
            // After refresh, saveAuth updates the store synchronously
            // Check the store directly to get the latest token value
            const updatedAuth = useAuthStore.getState().auth;
            const newToken = updatedAuth?.idToken;
            if (isTokenValid(newToken)) {
              setIsValidating(false);
              lastAttemptedTokenRef.current = undefined; // Reset on success
            } else {
              // Edge case: refresh succeeded but token is still invalid
              // Update ref to the new invalid token to prevent retrying the same value
              lastAttemptedTokenRef.current = newToken;
              setIsValidating(false);
            }
            // The effect will also re-run because auth?.idToken changed
            isRefreshingRef.current = false;
          } catch (error) {
            // refreshToken already handles redirect to /login on error
            console.error("Failed to refresh token:", error);
            isRefreshingRef.current = false;
            setIsValidating(false);
            // Reset on error to allow retry if token changes
            lastAttemptedTokenRef.current = undefined;
          }
        } else if (!tokenChanged) {
          // Token is invalid but hasn't changed since last attempt - stop validating
          setIsValidating(false);
        }
      } else {
        // Token is valid
        isRefreshingRef.current = false;
        setIsValidating(false);
        lastAttemptedTokenRef.current = undefined; // Reset on valid token
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

