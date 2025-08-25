// components/ChatStudent.tsx
import { Drawer, List, Input, Button } from "antd";
import { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import { useChat } from "../../../../hooks/useChat";
import type { MessagePayload } from "../../../../types/socket";


type ChatStudentProps = {
  open: boolean;
  onClose: () => void;
  phone: string; 
};

const ChatStudent = ({ open, onClose, phone }: ChatStudentProps) => {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const roomId = `chat:${phone}`;
  const { messages, sendMessage } = useChat("Student", phone, roomId);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Drawer
      title="Chat with Instructor"
      placement="right"
      width={400}
      onClose={onClose}
      open={open}
    >
      <div className={styles.chatBox}>
        <div className={styles.messages}>
          <List
            dataSource={messages}
            renderItem={(item: MessagePayload, index) => {
              const mine = item.senderId === phone;
              return (
                <List.Item
                  key={index}
                  className={mine ? styles.messageStudent : styles.messageInstructor}
                  style={{
                    justifyContent: mine ? "flex-end" : "flex-start",
                    padding: "8px 0",
                  }}
                >
                  <div className={styles.bubble}>
                    <div className={styles.sender}>
                      {mine ? "You" : item.senderRole}
                    </div>
                    <div className={styles.text}>{item.text}</div>
                    <div className={styles.time}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
                        : ""}
                    </div>
                  </div>
                </List.Item>
              );
            }}
          />
          <div ref={messagesEndRef} />
        </div>

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
  );
};

export default ChatStudent;
