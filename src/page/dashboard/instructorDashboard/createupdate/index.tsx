import React, { useEffect } from "react";
import { Modal, Button } from "antd";
import styles from "./index.module.scss";
import InputField from "../../../../component/ui/inputField";
import { useForm } from "react-hook-form";
import SelectField from "../../../../component/selectField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddStudent, useEditStudent } from "../../../../hooks/dashboardQuery";
import type { StudentPayload } from "../../../../types/dashboard";
import { toast } from "react-toastify";

interface ICreateUpdatePopup {
    record?: StudentPayload | null;
    open?: boolean;
    setOpen: (open: boolean) => void;
}


const schema = yup.object().shape({
    name: yup.string().required("Full name is required"),
    phone: yup
        .string()
        .matches(/^(?:\+84|0)\d{9,10}$/, "Invalid phone number")
        .required("Phone number is required"),
    email: yup
        .string()
        .email("Invalid email format")
        .required("Email is required"),
    role: yup.string().required("Please select a role"),
});

const CreateUpdate: React.FC<ICreateUpdatePopup> = ({ open, setOpen, record }) => {
    const { control, handleSubmit, reset } = useForm<StudentPayload>({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            role: "student",
        },
    });
    const { mutateAsync: create } = useAddStudent();
    const { mutateAsync: edit } = useEditStudent();
    useEffect(() => {
        if (record) {
            reset(record);
        } else {
            reset({
                name: "",
                phone: "",
                email: "",
                role: "student",
            });
        }
    }, [record, reset]);
    const onSubmit = async (values: StudentPayload) => {
        try {
            if (record) {
                const { phone, ...rest } = values;
                await edit({
                    phone: record.phone,
                    data: {
                        ...rest,
                        ...(phone !== record.phone ? { newPhone: phone } : {}), 
                    },
                });
                toast.success("Student updated successfully");
            } else {
                await create(values);
                toast.success("Student added successfully");
            }

            reset();
            setOpen(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className={styles.wrapper}>
            <Modal
                title={record ? "Edit Student" : "Add New Student"}
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                centered
                className={styles.modal}
            >
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <InputField
                        name="name"
                        control={control}
                        placeholder="Enter student name"
                        label="Full Name"
                        rules={{ required: true }}

                    />

                    <InputField
                        name="phone"
                        control={control}
                        placeholder="+84..."
                        label="Phone Number"
                        rules={{ required: true }}

                    />

                    <InputField
                        name="email"
                        control={control}
                        placeholder="example@gmail.com"
                        label="Email"
                        rules={{ required: true }}
                    />

                    <SelectField
                        name="role"
                        control={control}
                        label="Role"
                        placeholder="Select role"
                        rules={{ required: true }}

                        options={[
                            { value: "student", label: "Student" },
                            { value: "instructor", label: "Instructor" },
                        ]}
                    />

                    <div className={styles.footer}>
                        <Button onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="primary" htmlType="submit">
                            {record ? "Update" : "Save"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CreateUpdate;
