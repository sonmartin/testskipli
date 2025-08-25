import React, { useEffect } from "react";
import { Button } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "../../../../component/ui/inputField";
import { useEditProfile } from "../../../../hooks/dashboardQuery";
import type { EditProfilePayload } from "../../../../types/dashboard";
import { toast } from "react-toastify";

const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    phone: yup
        .string()
        .matches(/^(?:\+84|0)\d{9,10}$/, "Invalid phone number")
        .required("Phone number is required"),
});

const Profile: React.FC = () => {
    const phone = localStorage.getItem("phone") || "";
    const { control, handleSubmit, reset } = useForm<EditProfilePayload>({
        resolver: yupResolver(schema),
        defaultValues: {
            phone,
            name: "",
            email: "",
        },
    });

    const { mutateAsync: editProfile } = useEditProfile();

    const onSubmit = async (values: EditProfilePayload) => {
        try {
            await editProfile(values);
            toast.success("Profile updated successfully");
            reset(values);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        reset({ phone, name: "", email: "" });
    }, [phone, reset]);

    return (
        <div >
            <div >
                <h2>Edit Profile</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 400 }}>
                <InputField name="name" control={control} label="Name" placeholder="Enter your name" />
                <InputField name="email" control={control} label="Email" placeholder="Enter your email" />
                <InputField
                    name="phone"
                    control={control}
                    label="Phone"
                    placeholder="Enter your phone"
                />
                <Button type="primary" shape="round" htmlType="submit" style={{ marginTop: 16 }}>
                    Save Changes
                </Button>
            </form>
        </div>
    );
};

export default Profile;
