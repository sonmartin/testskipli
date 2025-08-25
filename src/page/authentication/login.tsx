import React, { useState } from "react";
import { Button } from "antd";
import styles from "./index.module.scss";
import { ArrowRightOutlined, LoginOutlined } from "@ant-design/icons";
import InputField from "../../component/ui/inputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSendCode, useVerifyCode } from "../../hooks/authQuery";
import { toast } from "react-toastify";
import type { PhoneStepData, VerifyStepData } from "../../models/auth";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routers/routes";


type FormData = PhoneStepData | VerifyStepData;
const schema = yup.object().shape({
    phone: yup.string().required("Phone number is required"),
    code: yup.string().when("$step", {
        is: "verify",
        then: (schema) => schema.required("Verification code is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const LoginBox: React.FC = () => {
  const Navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"phone" | "verify">("phone");
    const  sendCodeMutation  = useSendCode();
    const  verifyCodeMutation  = useVerifyCode();
    const { control, handleSubmit, reset, getValues } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            phone: "",
            code: "",
        },
        context: { step },
    });

  const onSubmit = async (data: FormData) => {
  if (step === "phone") {
    const phoneData = data as PhoneStepData;
    try {
      const res = await sendCodeMutation.mutateAsync({ phone: phoneData.phone });
      toast.success(`Your code: ${res.data.code}`);
      localStorage.setItem("phone", phoneData.phone);
      setStep("verify");
    } catch (err: any) {
      toast.error("Failed to send code. Please try again.");
    }
  } else if (step === "verify") {
    const verifyData = data as VerifyStepData;
    try {
      const res =  await verifyCodeMutation.mutateAsync({
        phone: verifyData.phone,
        code: verifyData.code,
      });
      localStorage.setItem("token", res.data.token);
      if(res.data.role === "instructor"){
        Navigate(routes.dashboard.instructor)
      }else{
        Navigate(routes.dashboard.student)
      }
      toast.success("Code verified successfully");
    } catch (err: any) {
      toast.error("Failed to verify code. Please try again.");
    }
  }
};


    const handleBack = () => {
        if (step === "verify") {
            setStep("phone");
            reset({ ...getValues(), code: "" });
        } else {
            setOpen(false);
            reset();
        }
    };

    return (
        <div className={styles.container}>
            {!open && (
                <p
                    className={styles.clickText}
                    onClick={() => {
                        setOpen(true);
                        setStep("phone");
                    }}
                >
                    <LoginOutlined className={styles.loginIcon} />
                    Click here to Sign In
                </p>
            )}

            <div className={`${styles.formWrapper} ${open ? styles.show : ""}`}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {step === "phone" && (
                        <>
                            <h2 className={styles.title}>Sign In</h2>
                            <p className = {styles.titlesub}>Please enter your phone to sign in</p>
                            <div className={styles.wrapperForm}>
                                <InputField
                                    name="phone"
                                    control={control}
                                    placeholder="Enter your phone number"
                                    label="Your phone number"
                                    className={styles.inputNumber}
                                />
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<ArrowRightOutlined />}
                                    htmlType="submit"
                                    className={styles.nextBtn}
                                />
                            </div>
                        </>
                    )}

                    {step === "verify" && (
                        <>
                            <h2 className={styles.title}>Phone Verification</h2>
                            <p  className = {styles.titlesub}>Enter the code sent to {getValues("phone")}</p>
                            <div className={styles.wrapperForm}>
                                <InputField
                                    name="code"
                                    control={control}
                                    placeholder="Enter verification code"
                                    label="Code"
                                    className={styles.inputCode}
                                />
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<ArrowRightOutlined />}
                                    htmlType="submit"
                                    className={styles.nextBtn}
                                />
                            </div>
                        </>
                    )}

                    <Button
                        type="link"
                        block
                        onClick={handleBack}
                        className={styles.closeBtn}
                    >
                        {step === "verify" ? "Back" : "Close"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginBox;
