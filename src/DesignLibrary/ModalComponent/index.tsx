import React from 'react';
import { Modal, ModalProps } from 'antd';
import ButtonComponent from '../ButtonComponent';
import { isEmpty } from '../../Utils/isEmpty';
import Styles from './modal.module.scss';
import { CloseOutlined } from '@ant-design/icons';

interface ModalComponentProps extends Omit<ModalProps, 'visible' | 'onOk'> {
  isOpen: boolean;
  onClose?: () => void;
  onProceed?: () => void;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  cancelBtnText?: string;
  submitBtnText?: string;
  loader?: boolean;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  onProceed,
  content,
  cancelBtnText,
  submitBtnText,
  loader,
  ...modalProps
}) => {
  return (
    <Modal
      visible={isOpen}
      centered
      title={
        <div className={Styles.modalHeader}>
          <span>Sustainability Measurement And Reporting Tool</span>
        </div>
      }
      onCancel={onClose}
      style={{ padding: '5px' }}
      footer={
        <>
          <div className={Styles.modalFooter}>
            {onClose && (
              <ButtonComponent hierarchy="tertiary" onClick={onClose}>
                {!isEmpty(cancelBtnText) ? cancelBtnText : 'No'}
              </ButtonComponent>
            )}
            {onProceed && (
              <ButtonComponent
                loading={loader}
                hierarchy="primary"
                onClick={onProceed}
              >
                {!isEmpty(submitBtnText) ? submitBtnText : 'Yes'}
              </ButtonComponent>
            )}
          </div>
        </>
      }
      {...modalProps}
    >
      <div className={Styles.modalContent}>{content}</div>
    </Modal>
  );
};

export default ModalComponent;
