import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import PageNotFoundImg from '../../assets/image/MicrosoftTeams-image (1).png';
import Styles from './Error.module.scss';
export const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={Styles.MainDiv}>
        <img src={PageNotFoundImg} alt="" style={{ width: '13vw' }} />
        <Typography.Title level={3} className={Styles.TitleSty}>
          Page not found
        </Typography.Title>
        <Typography.Text className={Styles.SubTitleSty}>
          Sorry we couldn’t find the page you are looking for
        </Typography.Text>
        <div className="pt-4">
          <Button
            type="primary"
            onClick={() => navigate('/', { replace: true })}
            className={Styles.buttonError}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </>
  );
};
