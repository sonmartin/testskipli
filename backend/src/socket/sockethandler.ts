import { Server, Socket } from "socket.io";
import { db } from "../firebaseAdmin";
import { MessagePayload } from "../types/socket";
import admin from "firebase-admin";

export const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {

    socket.on("joinRoom", (roomId: string) => {
      if (!roomId) return;
      socket.join(roomId);
    });

    socket.on("leaveRoom", (roomId: string) => {
      if (!roomId) return;
      socket.leave(roomId);
    });

    socket.on("sendMessage", async (msg: MessagePayload) => {
      try {
        if (!msg || !msg.roomId || !msg.text || !msg.senderId || !msg.senderRole) {
          return;
        }

        const payload: MessagePayload = {
          ...msg,
          createdAt: msg.createdAt || new Date().toISOString(),
        };

        io.to(msg.roomId).emit("receiveMessage", payload);

        await db
          .collection("chats")
          .doc(msg.roomId)
          .collection("messages")
          .add({
            ...payload,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });
      } catch (err) {
        console.error("Error on sendMessage:", err);
      }
    });

    socket.on("disconnect", () => {
    });
  });
};
