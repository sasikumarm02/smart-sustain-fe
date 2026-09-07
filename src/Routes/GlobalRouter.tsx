import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import {
  GlobalLayout,
  ProtectedLayout,
  PageNotFound,
} from '../Components/index';
import { protectRoutes, globalRoutes } from './Routes';
import { ReactNode, useEffect } from 'react';
import Login from '../Modules/UserScreen/Logins/Login';
import { useAuth } from '../Hooks/useAuth';
import { useHasAccess } from '../Hooks/useHasAccess';

export function GlobalRouter() {
  const { user, logout } = useAuth();
  const { hasPermissions } = useHasAccess();
  const currentPath = window.location.pathname;

  const getElementwithAccess = (element: ReactNode, roles: string[]) => {
    if (!user) {
      return <Navigate to="/auth/login" />;
    } else {
      return hasPermissions(roles) ? (
        <>{element}</>
      ) : (
        <Navigate to="/unauthorized-entry" />
      );
    }
  };

  useEffect(() => {
    if (user) {
      if (currentPath === '/' || currentPath === '/auth/login') {
        logout();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="*" element={<PageNotFound />} />
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedLayout />}>
        {protectRoutes.map(({ path, element, roles }) => (
          <Route
            path={path}
            element={getElementwithAccess(element, roles)}
            key={path}
          />
        ))}
      </Route>
      <Route element={<GlobalLayout />}>
        {globalRoutes.map(({ path, element, ...res }) => (
          <Route path={path} {...res} element={element} key={path} />
        ))}
      </Route>
    </Routes>
  );
}
