import { useCallback, useState } from "react";
import { registerWithEmail, toUserFriendlyAuthError } from "@services";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerWithEmail(email, password);
    } catch (err) {
      setError(
        toUserFriendlyAuthError(err, "Registration failed. Please try again."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { register, isLoading, error };
};
