import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      alertNotification: boolean;
      oauthId: string;
      smsNotification: boolean;
      phoneNumber: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    userData?: {
      id: string;
      name: string;
      email: string;
      profileImage: string;
      alertNotification: boolean;
      createdAt: Date;
      role: "user" | "admin";
      oauthId: string;
    };
  }
}

export type UserData = {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  alertNotification: boolean;
  createdAt: Date;
  role: "user" | "admin";
  oauthId: string;
  smsNotification: boolean;
  phoneNumber: string;
};

export type BackendUserResponse = {
  message: string;
  statusCode: 200 | 201;
  data: UserData;
};

export type BackendErrorResponse = {
  message: string;
  error: string;
  statusCode: 400 | 401 | 500;
};
