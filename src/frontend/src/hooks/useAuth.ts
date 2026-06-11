import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
    loginStatus,
  } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogin = () => {
    if (!isInitializing && !isLoggingIn) {
      login();
    }
  };

  const handleLogout = () => {
    clear();
    queryClient.clear();
  };

  const currentPrincipal = identity?.getPrincipal();

  return {
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
    loginStatus,
    currentPrincipal,
    isSelf: (p: { toString(): string }) => {
      if (!identity) return false;
      return p.toString() === identity.getPrincipal().toString();
    },
  };
}
