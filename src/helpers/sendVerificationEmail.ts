import { resend } from "@/lib/resend";
import { NextApiRequest, NextApiResponse } from "next";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Mystry Message Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification mail send successfully" };
  } catch (error) {
    console.log("Error sending email", error);
    return { success: false, message: "Error sending email" };
  }
}
