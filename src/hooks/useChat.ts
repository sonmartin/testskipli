import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { MessagePayload } from "../types/socket";
import { chatService } from "../services/chat";

type ServerEvents = {
    receiveMessage: (msg: MessagePayload) => void;
};

type ClientEvents = {
    joinRoom: (roomId: string) => void;
    leaveRoom: (roomId: string) => void;
    sendMessage: (msg: MessagePayload) => void;
};

export const useChat = (role: "Instructor" | "Student", senderId: string, roomId: string) => {
    const [messages, setMessages] = useState<MessagePayload[]>([]);
    const socketRef = useRef<Socket<ServerEvents, ClientEvents> | null>(null);
    const currentRoomRef = useRef<string | null>(null);

    useEffect(() => {
        const socket = io(
            import.meta.env.VITE_API_URL || "http://localhost:5001",
            {
                withCredentials: true,
                transports: ["websocket"],
            }
        );

        socketRef.current = socket;

        socket.on("connect", () => {
        });

        socket.on("receiveMessage", (msg: MessagePayload) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    useEffect(() => {
        const s = socketRef.current;
        if (!s) return;

        if (currentRoomRef.current && currentRoomRef.current !== roomId) {
            s.emit("leaveRoom", currentRoomRef.current);
        }

        if (roomId) {
            s.emit("joinRoom", roomId);
            currentRoomRef.current = roomId;

            chatService
                .getHistory(roomId, 200)
                .then((res) => {
                    const ms = res?.data?.messages || [];
                    setMessages(ms);
                })
                .catch(() => {
                    setMessages([]);
                });
        }
    }, [roomId]);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;
        const s = socketRef.current;
        if (!s || !roomId) return;

        const msg: MessagePayload = {
            roomId,
            senderId,
            senderRole: role,
            text,
        };

        s.emit("sendMessage", msg);
    };

    return { messages, sendMessage };
};