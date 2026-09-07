import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../../Components/index';
export const GlobalLayout = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <Outlet />
      </Layout>
    </ErrorBoundary>
  );
};
