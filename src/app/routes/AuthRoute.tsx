import { Navigate, Outlet } from 'react-router-dom';

export const AuthRoute = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/messages" replace />;
  }

  return <Outlet />;
};