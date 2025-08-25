import React, { useState } from "react";
import {
    Layout,
    Menu,
    Table,
    Typography,
    Avatar,
    Button,
    Drawer,
    List,
    Input,
    Space,
    Modal,
} from "antd";
import {
    TeamOutlined,
    BookOutlined,
    MessageOutlined,
    EditOutlined,
    DeleteOutlined,
    LogoutOutlined,
    UserAddOutlined,
} from "@ant-design/icons";

import styles from "./index.module.scss";
import ButtonCommon from "../../../component/ui/button";
import CreateUpdate from "./createupdate";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const InstructorDashboard: React.FC = () => {
    const [activeKey, setActiveKey] = useState("students");
    const [chatOpen, setChatOpen] = useState(false);
const [open, setOpen] = useState(false)
    // Fake data student
    const [students, setStudents] = useState([
        { id: 1, name: "Nguyen Van A", email: "a@student.com" },
        { id: 2, name: "Tran Thi B", email: "b@student.com" },
    ]);

    const [messages, setMessages] = useState([
        { sender: "Student", text: "Hello teacher 👋" },
        { sender: "Instructor", text: "Hi, how can I help you?" },
    ]);
    const [inputValue, setInputValue] = useState("");

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, { sender: "Instructor", text: inputValue }]);
        setInputValue("");
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: "Confirm Delete",
            content: "Are you sure you want to delete this student?",
            okText: "Delete",
            okType: "danger",
            onOk: () => {
                setStudents(students.filter((s) => s.id !== id));
            },
        });
    };

    const studentColumns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <Space>
                    <ButtonCommon size="small" color="primary" icon={<EditOutlined />}>
                        Edit
                    </ButtonCommon>
                    <ButtonCommon
                       size="small"
                       color="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </ButtonCommon>
                </Space>
            ),
        },
    ];

    return (
        <Layout className={styles.dashboardLayout}>
            {/* Sidebar */}
            <Sider className={styles.sidebar} width={220}>
                <div className={styles.profileBox}>
                    <Avatar size={48} className={styles.avatar}>
                        IN
                    </Avatar>
                    <div>
                        <b>Instructor</b>
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
                        { key: "students", icon: <TeamOutlined />, label: "Manage Students" },
                        { key: "lessons", icon: <BookOutlined />, label: "Manage Lessons" },
                        { key: "messages", icon: <MessageOutlined />, label: "Messages" },
                    ]}
                />
            </Sider>

            {/* Main */}
            <Layout>
                <Header className={styles.header}>
                    <Title level={3} className={styles.title}>
                        Instructor Dashboard
                    </Title>
                    <ButtonCommon
                        size="medium"
                        icon={<LogoutOutlined />}
                        color="danger"
                    >
                        Logout
                    </ButtonCommon>
                </Header>

                <Content className={styles.content}>
                    {activeKey === "students" && (
                        <div>
                            <div style={{ marginBottom: 16 }}>
                                <ButtonCommon
                                    icon={<UserAddOutlined />}
                                    color="primary"
                                    size="large"
                                    onClick={() => setOpen(true)}
                                >
                                    Add New Student
                                </ButtonCommon>
                            </div>
                            <Table
                                dataSource={students}
                                columns={studentColumns}
                                rowKey="id"
                                bordered
                            />
                        </div>
                    )}

                    {activeKey === "lessons" && (
                        <div>
                            <Title level={4}>Manage Lessons</Title>
                            <p>📘 Here you can assign and manage lessons.</p>
                        </div>
                    )}
                </Content>
            </Layout>

            {/* Drawer Chat */}
            <Drawer
                title="💬 Real-Time Chat"
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
                                    item.sender === "Instructor"
                                        ? styles.messageInstructor
                                        : styles.messageStudent
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
            {open && (

            <CreateUpdate open={open} setOpen={setOpen}/>
            )}
        </Layout>
    );
};

export default InstructorDashboard;
