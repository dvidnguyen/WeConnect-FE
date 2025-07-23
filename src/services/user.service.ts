import type { User } from "@/lib/mockData";
import { mockUsers } from "@/lib/mockData";

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    // For now using mock data
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockUsers[0];
    // When API is ready:
    // return await api.get('/api/users/me');
  },
};
