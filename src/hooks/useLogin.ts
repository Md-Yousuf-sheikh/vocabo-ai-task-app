import { useCallback, useState } from "react";
import { loginWithEmail, loginWithGoogle, toUserFriendlyAuthError } from "@services";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      setError(toUserFriendlyAuthError(err, "Login failed. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogleProvider = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(
        toUserFriendlyAuthError(err, "Google login failed. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, loginWithGoogle: loginWithGoogleProvider, isLoading, error };
};
