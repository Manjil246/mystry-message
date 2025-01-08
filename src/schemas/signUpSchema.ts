import { z } from "zod";

export const userNameValidation = z
  .string()
  .min(2, "Username must be 8 characters")
  .max(20, "Username should have max 20 characters")
  .regex(/^[a-zA-Z0-9_]$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: userNameValidation,
  email: z.string().email({ message: "Invalid email Address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
