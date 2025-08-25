import React, { useState } from "react";
import {
    Layout,
    Menu,
    Table,
    Button,
    Typography,
    Avatar,

    Tag,
} from "antd";
import {
    BookOutlined,
    MessageOutlined,
    LogoutOutlined,
    UserOutlined,
    CheckOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import { useMarkLessonDone, useMyLessons } from "../../../hooks/dashboardQuery";
import Profile from "./profile";
import ChatStudent from "./chat";
import { useNavigate } from "react-router-dom";
const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const StudentDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeKey, setActiveKey] = useState("lessons");
    const [chatOpen, setChatOpen] = useState(false);

    const phone = localStorage.getItem("phone") || "";

    const { data, isLoading } = useMyLessons(phone);
    const lessons = data?.data?.lessons || [];

    const { mutate: markLessonDone, isPending: isMarking } = useMarkLessonDone();

    const lessonColumns = [
        { title: "Lesson", dataIndex: "title", key: "title" },
        { title: "Description", dataIndex: "description", key: "description" },

        {
            title: "Status",
            dataIndex: "completed",
            key: "completed",
            render: (val: boolean) =>
                val ? <Tag color="green">Completed</Tag> : <Tag color="orange">Pending</Tag>,
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <Button
                    type="link"
                    icon={<CheckOutlined />}
                    disabled={record.completed}
                    onClick={() =>
                        markLessonDone({ phone, lessonId: record.id })
                    }
                >
                    Mark Done
                </Button>
            ),
        },
    ];
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("phone");
        navigate("/login", { replace: true });
    };
    return (
        <Layout className={styles.dashboardLayout}>
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
            <Layout>
                <Header className={styles.header}>
                    <Title level={3} className={styles.title}>
                        Student Dashboard
                    </Title>
                    <Button type="primary" danger icon={<LogoutOutlined />} shape="round"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Header>

                <Content className={styles.content}>
                    {activeKey === "lessons" && (
                        <div>
                            <Title level={4}>My Lessons</Title>
                            <Table
                                dataSource={lessons}
                                columns={lessonColumns}
                                rowKey="id"
                                bordered
                                loading={isLoading || isMarking}
                            />
                        </div>
                    )}
                    {activeKey === "profile" && <Profile />}
                </Content>
            </Layout>
            <ChatStudent
                open={chatOpen}
                onClose={() => setChatOpen(false)}
                phone={phone}
            />

        </Layout>
    );
};

export default StudentDashboard;
