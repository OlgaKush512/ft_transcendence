import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../tools/auth';

const AuthProviderLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default AuthProviderLayout;
