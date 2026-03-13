import { z } from "zod";

export const mosqueSchema = z.object({
  name: z.string().trim().min(1),
  location: z.string().trim().min(1),
  image: z.string().url().optional().or(z.literal("")),
  zuhrJamaat: z.string().regex(/^\d{2}:\d{2}$/),
  fajrOnFive: z.number().int().min(0).max(60),
  fajrOffFive: z.number().int().min(0).max(60),
  asrGap: z.number().int().min(0).max(90),
  ishaGap: z.number().int().min(0).max(120),
  maghribGap: z.number().int().min(0).max(30)
});

export const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const roleUpdateSchema = z.object({
  role: z.enum(["ADMIN", "EDITOR"])
});
