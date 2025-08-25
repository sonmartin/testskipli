import React, { useState } from "react";
import { Button, Modal, Table, Tag } from "antd";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "../../../../component/ui/inputField";
import styles from "./index.module.scss";
import { useAssignLesson, useMyLessons } from "../../../../hooks/dashboardQuery";
import ButtonCommon from "../../../../component/ui/button";
import { formatFirestoreDate } from "../../../../utils/date";


interface AssignLessonForm {
    title: string;
    description: string;
}

const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
});

const ManageLessons: React.FC<{ studentPhone?: string }> = ({ studentPhone }) => {
    const [open, setOpen] = useState(false);
    const { control, handleSubmit, reset } = useForm<AssignLessonForm>({
        resolver: yupResolver(schema),
        defaultValues: { title: "", description: "" },
    });

    const { data, isLoading } = useMyLessons(studentPhone || "");
    const lessons = data?.data?.lessons || [];
    const assignLesson = useAssignLesson();

    const onSubmit = async (values: AssignLessonForm) => {
        if (!studentPhone) return;
        try {
            await assignLesson.mutateAsync({
                studentPhone,
                title: values.title,
                description: values.description,
            });
            toast.success("Lesson assigned successfully");
            reset();
            setOpen(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to assign lesson");
        }
    };

    const lessonColumns = [
  { title: "Title", dataIndex: "title", key: "title" },
  { title: "Description", dataIndex: "description", key: "description" },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (val: any) => formatFirestoreDate(val),
  },
  {
    title: "Status",
    key: "status",
    render: (_: any, record: any) =>
      record.completed ? (
        <Tag color="green">Completed</Tag>
      ) : (
        <Tag color="orange">Pending</Tag>
      ),
  },
];
    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2>Manage Lessons</h2>
                <ButtonCommon size="large" color="primary" onClick={() => setOpen(true)}>
                    Assign Lesson
                </ButtonCommon>
            </div>

            <Table
                rowKey="id"
                loading={isLoading}
                dataSource={lessons}
                columns={lessonColumns}
            />

            <Modal
                title="Assign Lesson"
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                centered
            >
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <InputField name="title" control={control} label="Lesson Title" placeholder="Enter lesson title" />
                    <InputField name="description" control={control} label="Lesson Description" placeholder="Enter lesson description" />

                    <div className={styles.footer}>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageLessons;
