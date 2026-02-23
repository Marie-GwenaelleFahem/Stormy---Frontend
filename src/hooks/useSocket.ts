import { useEffect } from "react";
import socketService from "../services/socket";

export const useSocket = (token: string | null) => {
  useEffect(() => {
    if (token) {
      socketService.connect(token);

      return () => {
        socketService.disconnect();
      };
    }
  }, [token]);

  return socketService;
};
