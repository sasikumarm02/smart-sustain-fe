import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Col, Modal, Row, Typography, Collapse } from 'antd';
import { ButtonComponent } from '../../DesignLibrary';
import { useAuth } from '../../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<
  Props & { navigate: (path: string) => void; user: any },
  State
> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true, error: null, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  private resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    const { navigate, user } = this.props; // Destructure navigate and user from props

    if (this.state.hasError) {
      return (
        <Modal open={true} closable={false} footer={null} centered width={800}>
          <Row justify="center" style={{ marginBottom: 16 }}>
            <Col style={{ textAlign: 'center' }}>
              <Title>Something went wrong!</Title>
              <Text>Don't worry it's not you - it's us. Sorry about that</Text>
            </Col>
          </Row>
          {['localhost', 'dev-app.saaspe.com'].includes(
            window.location.hostname
          ) && (
            <Row style={{ marginBottom: 16 }}>
              <Col span={24}>
                <Collapse>
                  <Panel header={this.state.error?.message} key="1">
                    <code>
                      <pre>
                        <Title level={4}>Error Stack</Title>
                        {this.state.error?.stack}
                        <br />
                        <br />
                        <br />
                        <Title level={4}>Error Info</Title>
                        {JSON.stringify(this.state.errorInfo, undefined, 2)}
                      </pre>
                    </code>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          )}
          <Row justify="center">
            <Col>
              <ButtonComponent
                hierarchy="primary"
                onClick={() => {
                  this.resetError();
                  const isAuthenticated = !!user;
                  if (isAuthenticated && user?.role === 'ADMIN') {
                    navigate('/admin-landing');
                  } else if (isAuthenticated && user?.role !== 'ADMIN') {
                    navigate('/landing-page');
                  } else {
                    navigate('/auth/login');
                  }
                }}
              >
                Go Home
              </ButtonComponent>
            </Col>
          </Row>
        </Modal>
      );
    }

    return this.props.children;
  }
}

// Functional wrapper to provide navigate
const ErrorBoundaryWrapper: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <ErrorBoundary
      {...props}
      navigate={navigate} // Pass the navigate function as a prop
      user={user} // Pass the user as a prop
    />
  );
};

export default ErrorBoundaryWrapper;
