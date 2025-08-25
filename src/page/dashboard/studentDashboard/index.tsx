import React, { useState } from "react";
import {
  Layout,
  Menu,
  Table,
  Button,
  Typography,
  Avatar,
  Drawer,
  List,
  Input,
  Space,
  Form,
} from "antd";
import {
  BookOutlined,
  MessageOutlined,
  LogoutOutlined,
  UserOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import styles from "./index.module.scss";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const StudentDashboard: React.FC = () => {
  const [activeKey, setActiveKey] = useState("lessons");
  const [chatOpen, setChatOpen] = useState(false);

  // Fake data lessons
  const [lessons, setLessons] = useState([
    { id: 1, title: "Math - Algebra", status: "Pending" },
    { id: 2, title: "Physics - Mechanics", status: "Pending" },
  ]);

  const [messages, setMessages] = useState([
    { sender: "Instructor", text: "Hello, welcome to the course 👋" },
    { sender: "Student", text: "Thank you teacher!" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { sender: "Student", text: inputValue }]);
    setInputValue("");
  };

  const handleMarkDone = (id: number) => {
    setLessons(
      lessons.map((l) =>
        l.id === id ? { ...l, status: "Done ✅" } : l
      )
    );
  };

  const lessonColumns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Lesson", dataIndex: "title", key: "title" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          type="link"
          icon={<CheckOutlined />}
          disabled={record.status === "Done ✅"}
          onClick={() => handleMarkDone(record.id)}
        >
          Mark Done
        </Button>
      ),
    },
  ];

  return (
    <Layout className={styles.dashboardLayout}>
      {/* Sidebar */}
      <Sider className={styles.sidebar} width={220}>
        <div className={styles.profileBox}>
          <Avatar size={48} className={styles.avatar}>
            ST
          </Avatar>
          <div>
            <b>Student</b>
            <br />
            <span className={styles.subText}>Dashboard</span>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={(e) => {
            if (e.key === "messages") setChatOpen(true);
            else setActiveKey(e.key);
          }}
          items={[
            { key: "lessons", icon: <BookOutlined />, label: "My Lessons" },
            { key: "profile", icon: <UserOutlined />, label: "Profile" },
            { key: "messages", icon: <MessageOutlined />, label: "Messages" },
          ]}
        />
      </Sider>

      {/* Main */}
      <Layout>
        <Header className={styles.header}>
          <Title level={3} className={styles.title}>
            Student Dashboard
          </Title>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            shape="round"
          >
            Logout
          </Button>
        </Header>

        <Content className={styles.content}>
          {activeKey === "lessons" && (
            <div>
              <Title level={4}>📘 My Lessons</Title>
              <Table
                dataSource={lessons}
                columns={lessonColumns}
                rowKey="id"
                bordered
              />
            </div>
          )}

          {activeKey === "profile" && (
            <div>
              <Title level={4}>👤 Edit Profile</Title>
              <Form layout="vertical" style={{ maxWidth: 400 }}>
                <Form.Item label="Name" name="name">
                  <Input placeholder="Enter your name" />
                </Form.Item>
                <Form.Item label="Email" name="email">
                  <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item label="Phone" name="phone">
                  <Input placeholder="Enter your phone" />
                </Form.Item>
                <Button type="primary" shape="round">
                  Save Changes
                </Button>
              </Form>
            </div>
          )}
        </Content>
      </Layout>

      {/* Drawer Chat */}
      <Drawer
        title="💬 Chat with Instructor"
        placement="right"
        width={400}
        onClose={() => setChatOpen(false)}
        open={chatOpen}
      >
        <div className={styles.chatBox}>
          <List
            dataSource={messages}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                className={
                  item.sender === "Student"
                    ? styles.messageStudent
                    : styles.messageInstructor
                }
              >
                <b>{item.sender}: </b> {item.text}
              </List.Item>
            )}
          />

          <div className={styles.inputBox}>
            <Input
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSend}
            />
            <Button type="primary" onClick={handleSend}>
              Send
            </Button>
          </div>
        </div>
      </Drawer>
    </Layout>
  );
};

export default StudentDashboard;
