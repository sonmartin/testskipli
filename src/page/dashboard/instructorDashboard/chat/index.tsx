import { Drawer, List, Input, Button } from "antd";
import { useState } from "react";
import styles from "./index.module.scss";
import { useChat } from "../../../../hooks/useChat";
import type { StudentPayload } from "../../../../types/dashboard";

type ChatDrawerProps = {
    open: boolean;
    onClose: () => void;
    student: StudentPayload | null;
};

const ChatInstructor = ({ open, onClose, student }: ChatDrawerProps) => {
    const [inputValue, setInputValue] = useState("");

    const roomId = student ? `chat:${student.phone}` : "";
    const { messages, sendMessage } = useChat("Instructor", "instructor-1", roomId);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue("");
    };

    return (
        <Drawer
            title={`Chat with ${student?.name || "..."}`}
            placement="right"
            width={400}
            onClose={onClose}
            open={open}
        >
            <div className={styles.chatBox}>
                <div className={styles.messages}>
                    <List
                        dataSource={messages}
                        renderItem={(item, index) => {
                            const mine = item.senderRole === "Instructor"; 
                            return (
                                <List.Item
                                    key={index}
                                    className={mine ? styles.messageMine : styles.messageInstructor}
                                    style={{ justifyContent: mine ? "flex-end" : "flex-start", padding: "8px 0" }}

                                >
                                    <div className={styles.bubble}>
                                        <div className={styles.sender}>{mine ? "You" : item.senderRole}</div>
                                        <div className={styles.text}>{item.text}</div>
                                        <div className={styles.time}>
                                            {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                                        </div>
                                    </div>
                                </List.Item>
                            );
                        }}
                    />
                </div>
                <div className={styles.inputBox}>
                    <Input
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

    );
}

export default ChatInstructor
