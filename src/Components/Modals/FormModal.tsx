import { Modal, Form, Input, Button, InputNumber, Select } from 'antd';
import { useFormik } from 'formik';

const FormModal = ({
  visible,
  formFields,
  initialValues,
  onSubmit,
  onCancel,
  title,
  onOk,
}: any) => {
  const formik = useFormik({
    initialValues,
    onSubmit: (values, { resetForm, setValues }) => {
      // onSubmit(values);
      setValues(initialValues);
      resetForm();
    },
  });

  const { Option } = Select;

  const getFieldComponent = ({ field, formik }: any) => {
    const { type, placeholder, options, label, ...rest } = field;

    switch (type) {
      case 'input':
        return (
          <Input
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            {...rest}
          />
        );
      case 'password':
        return (
          <Input.Password
            value={formik.values[field.name]}
            onChange={formik.handleChange}
            {...rest}
          />
        );
      case 'number':
        return (
          <InputNumber
            value={formik.values[field.name]}
            onChange={(value) => formik.setFieldValue(field.name, value)}
            {...rest}
          />
        );
      case 'select':
        return (
          <Select
            placeholder={placeholder}
            value={formik.values[field.name]}
            onChange={(value) => formik.setFieldValue(field.name, value)}
            {...rest}
          >
            {options.map((option: any, index: any) => (
              <Option key={index} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} title={title} onCancel={onCancel} footer={false}>
      <Form layout="vertical" onFinish={formik.handleSubmit}>
        {formFields.map((field: any, index: any) => (
          <Form.Item key={index} label={field.label} name={field.name}>
            {getFieldComponent({ field, formik })}
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormModal;
