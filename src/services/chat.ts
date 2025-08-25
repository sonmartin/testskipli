import { api } from "../constants/api";
import AppAPIInstance from "./configApi";

export const chatService = {
  getHistory: (roomId: string, limit = 100) => AppAPIInstance.get(`${api.CHAT.MESSAGES(roomId)}?limit=${limit}`),
};
