export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  alertNotification: boolean;
  pushNotification: boolean;
  expoPushToken: string | null;
  role: "user" | "admin";
  oauthId: string;
  createdAt: Date;
}

export interface UsersResponse {
  message: string;
  statusCode: number;
  data: User[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
