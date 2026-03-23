import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { subscribeToAuthState } from "@services";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);
  return { user, isLoading, isAuthenticated };
};
