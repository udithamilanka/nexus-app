export type DashboardUser = {
  name: string;
  email: string;
  createdAt: string | Date;
  role: string;
  isActivated: boolean;
}

export type JWTPayload = {
  userId: string;
  role: string;
  exp: number;
};