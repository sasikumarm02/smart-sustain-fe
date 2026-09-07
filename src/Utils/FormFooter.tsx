import React from 'react';
import { Row, Col, Button } from 'antd';
import { ButtonComponent } from '../DesignLibrary';

interface Props {
  next?: string;
  isValid: boolean;
  dirty: boolean;
  isSubmitting?: boolean;
  setInitialFormValues?: React.Dispatch<React.SetStateAction<any>>;
}

const FormFooter = ({
  next,
  isValid = false,
  dirty = false,
  isSubmitting = false,
  setInitialFormValues,
}: Props) => (
  <Row justify="end" gutter={[10, 10]} className="mt-4">
    <Col>
      <ButtonComponent
        hierarchy="secondary"
        htmlType="reset"
        onClick={() => {
          if (setInitialFormValues) {
            setInitialFormValues({ as: 'as' });
          }
        }}
        style={{
          borderRadius: '5px',
          borderColor: '#00338D',
          background: '#fff',
          color: '#00338D',
        }}
      >
        Remove File
      </ButtonComponent>
    </Col>
    <Col>
      <ButtonComponent
        hierarchy="primary"
        htmlType="submit"
        style={{
          borderRadius: '5px',
          background: '#00338D',
          color: '#fff',
        }}
        disabled={!isValid}
        loading={isSubmitting}
      >
        {next ? 'Next' : 'Submit'}
      </ButtonComponent>
    </Col>
  </Row>
);

export default FormFooter;
