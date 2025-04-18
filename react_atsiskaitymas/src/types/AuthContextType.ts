import { User } from "../types/User";

export type AuthContextType = {
  loggedInUser: User | null;
  login: (user: User) => void;
  logout: () => void;
};