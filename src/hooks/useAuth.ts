import { useAuthViewModel } from '../viewmodels/authViewModel';

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, logout } = useAuthViewModel();

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
  };
};
