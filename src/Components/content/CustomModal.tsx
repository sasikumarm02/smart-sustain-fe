import React, { ReactNode } from 'react';
import { Modal, ModalProps } from 'antd';

interface CustomModalProps extends ModalProps {
  children: ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onCancel,
  onOk,
  title,
  children,
  ...restProps
}) => {
  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      title={title}
      //footer={null}
      {...restProps}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
