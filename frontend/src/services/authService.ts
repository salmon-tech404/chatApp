import api from "@/lib/axios";
import { sign } from "node:crypto";

export const authService = {
  signUp: async (
    username: string,
    password: string,
    email: string,
    firstname: string,
    lastname: string,
  ) => {
    const res = await api.post(
      "auth/signup",
      { username, password, email, fistname, lastname },
      {
        withCredentials: true,
      },
    );
    return res.data;
  },
};
