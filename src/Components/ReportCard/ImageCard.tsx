import { Card } from 'antd';
import styles from './Image.module.scss';

export const ImageCard = ({ data }: any) => {
  return (
    <>
      <Card>
        <img
          style={{ borderRadius: '10px', width: '100%' }}
          className={styles.image}
          src={data.image}
          alt="esg"
        ></img>
        <h5 className={styles.text}>{data.description}</h5>
      </Card>
    </>
  );
};
