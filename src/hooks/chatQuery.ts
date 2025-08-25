import { useQuery } from "@tanstack/react-query";
import { chatService } from "../services/chat";
import { querykey } from "../constants/api";

export const useChatHistory = (roomId: string, limit = 100) => {
  return useQuery({
    queryKey: [querykey.CHAT.MESSAGES],
    queryFn: () => chatService.getHistory(roomId, limit).then((res) => res.data),
    enabled: !!roomId, 
    staleTime: 1000 * 60, 
    refetchOnWindowFocus: false,
  });
};
