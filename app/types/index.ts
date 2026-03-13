import { Role } from "@prisma/client";

export type MosqueInput = {
  name: string;
  location: string;
  image?: string;
  zuhrJamaat: string;
  fajrOnFive: number;
  fajrOffFive: number;
  asrGap: number;
  ishaGap: number;
  maghribGap: number;
};

export type MosqueRecord = MosqueInput & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};
