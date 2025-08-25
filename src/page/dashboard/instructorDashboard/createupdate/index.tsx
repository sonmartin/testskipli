import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import styles from "./index.module.scss";

interface ICreateUpdatePopup {
    open?: boolean
     setOpen: (open: boolean) => void;
}
const { Option } = Select;

const CreateUpdate: React.FC<ICreateUpdatePopup> = ({open, setOpen}) => {
  const [form] = Form.useForm();
  return (
    <div className={styles.wrapper}>


      <Modal
        title="Add New Student"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        centered
        className={styles.modal}
      >
        <Form
          form={form}
          layout="vertical"
          className={styles.form}
          initialValues={{ role: "student" }}
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter student name" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="+84..." />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="example@gmail.com" />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Select>
              <Option value="student">Student</Option>
              <Option value="instructor">Instructor</Option>
            </Select>
          </Form.Item>

          <div className={styles.footer}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
             
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateUpdate;
