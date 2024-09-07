import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface MessageResponse {
  message: string;
}

export const useHelloWorld = (trigger: boolean) => {
  return useQuery({
    queryKey: ["getKey"],
    queryFn: async () => {
      const response = await axios.get(`api`);
      const data: MessageResponse = await response.data;
      return data;
    },
    enabled: trigger,
  });
};
