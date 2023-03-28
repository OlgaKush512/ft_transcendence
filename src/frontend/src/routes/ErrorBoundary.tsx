import '../index.css';
import {
  useRouteError,
  Navigate,
  isRouteErrorResponse,
} from 'react-router-dom';
import { isAxiosError, isError } from '../tools/apiHandler';
import UnexpectedError from './UnexpectedError';

export const ErrorBoundary = () => {
  const error = useRouteError();
  console.warn(
    'Error thrown during page loader',
    isRouteErrorResponse(error),
    isAxiosError(error)
  );
  console.warn(error);

  if (isAxiosError(error)) {
    if (
      error.response?.status === 403 &&
      (error.response?.data as any).message === 'Missing or Invalid Token'
    )
      return <Navigate to="/login" />;
    if (
      error.response?.status === 403 &&
      (error.response?.data as any).message === '2FA not verified'
    )
      return <Navigate to="/authenticate" />;
  }
  return <UnexpectedError/>;
};

export default ErrorBoundary;
