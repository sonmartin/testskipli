import React, { useState } from "react";
import {
    Layout,
    Menu,
    Table,
    Typography,
    Avatar,
    Button,
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
import { useDeleteStudent, useStudents } from "../../../hooks/dashboardQuery";
import { toast } from "react-toastify";
import type { StudentPayload } from "../../../types/dashboard";
import ManageLessons from "./managelessons";
import ChatInstructor from "./chat";
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const InstructorDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useStudents();
    const students = data?.data?.users || [];
    const deleteMutation = useDeleteStudent();
    const [activeKey, setActiveKey] = useState<string>("students");
    const [chatOpen, setChatOpen] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false)
    const [selectedStudent, setSelectedStudent] = useState<StudentPayload | null>(null);
    const [modal, contextHolder] = Modal.useModal();
    const handleOpenCU = (record?: StudentPayload) => {
        if (record) {
            setSelectedStudent(record);
        } else {
            setSelectedStudent(null);
        }
        setOpen(true);
    };


    const handleDelete = (phone: string) => {
        modal.confirm({
            title: "Confirm Delete",
            content: `Are you sure you want to delete student with phone: ${phone}?`,
            okText: "Delete",
            okType: "danger",
            onOk: async () => {
                try {
                    await deleteMutation.mutateAsync(phone);
                    toast.success("Deleted student successfully");
                } catch (error: any) {
                    toast.error(error?.response?.data?.message || "Delete failed");
                }
            },
        });
    };

    const studentColumns = [
        { title: "Phone", dataIndex: "phone", key: "phone" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Role", dataIndex: "role", key: "role" },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: StudentPayload) => (
                <Space>
                    <ButtonCommon
                        size="small"
                        color="primary"
                        onClick={() => {
                            setSelectedStudent(record);
                            setActiveKey("lessons");
                        }}
                    >
                        Manage Lessons
                    </ButtonCommon>
                    <ButtonCommon size="small" color="primary" icon={<EditOutlined />}
                        onClick={() => handleOpenCU(record)}
                    >
                        Edit
                    </ButtonCommon>
                    <ButtonCommon
                        size="small"
                        color="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.phone)}
                    >
                        Delete
                    </ButtonCommon>
                </Space>
            ),
        },
    ];

    const studentChatColumns = (
        setSelectedStudent: (student: StudentPayload) => void,
        setChatOpen: (open: boolean) => void
    ) => [
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Phone",
                dataIndex: "phone",
                key: "phone",
            },
            {
                title: "Chat",
                key: "action",
                render: (_: any, record: StudentPayload) => (
                    <Button
                        type="link"
                        onClick={() => {
                            setSelectedStudent(record);
                            setChatOpen(true);
                        }}
                    >
                         Chat
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
                        setActiveKey(e.key);
                    }}
                    items={[
                        { key: "students", icon: <TeamOutlined />, label: "Manage Students" },
                        { key: "lessons", icon: <BookOutlined />, label: "Manage Lessons" },
                        { key: "messages", icon: <MessageOutlined />, label: "Messages" },
                    ]}
                />
            </Sider>

            <Layout>
                <Header className={styles.header}>
                    <Title level={3} className={styles.title}>
                        Instructor Dashboard
                    </Title>
                    <ButtonCommon
                        size="medium"
                        icon={<LogoutOutlined />}
                        color="danger"
                        onClick={handleLogout}
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
                                    onClick={() => handleOpenCU()}
                                >
                                    Add New Student
                                </ButtonCommon>
                            </div>
                            <Table
                                loading={isLoading}
                                dataSource={students}
                                columns={studentColumns}
                                rowKey="id"
                                bordered
                            />
                        </div>
                    )}

                    {activeKey === "lessons" && (
                        <div>
                            {selectedStudent ? (
                                <ManageLessons studentPhone={selectedStudent.phone} />
                            ) : (
                                <p style={{ padding: 20 }}>Please select a student to manage lessons.</p>
                            )}
                        </div>
                    )}

                    {activeKey === "messages" && (
                        <Table
                            loading={isLoading}
                            dataSource={students}
                            columns={studentChatColumns(setSelectedStudent, setChatOpen)}
                        />
                    )}

                </Content>
            </Layout>

            <ChatInstructor
                open={chatOpen}
                onClose={() => setChatOpen(false)}
                student={selectedStudent}
            />

            {open && (

                <CreateUpdate open={open} setOpen={setOpen} record={selectedStudent} />
            )}
            {contextHolder}
        </Layout>
    );
};

export default InstructorDashboard;
