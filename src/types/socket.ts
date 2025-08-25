export type Role = "Instructor" | "Student";

export interface MessagePayload {
  roomId: string;
  senderId: string;
  senderRole: Role;
  text: string;
  createdAt?: string;
}
