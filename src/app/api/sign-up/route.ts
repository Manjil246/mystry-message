import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcryptjs from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

const generateVerificationCode = (): string => {
  return Math.floor(Math.random() * 900000 + 100000).toString();
};

export const POST = async (request: Request) => {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username already exists" },
        { status: 400 }
      );
    }
    const verifyCode = generateVerificationCode();
    const date = new Date();
    const expiryDate = new Date(date.setHours(date.getHours() + 1));

    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User with this email already exists" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;
        await existingUserByEmail.save();
      }
    } else {
      const securePassword = await bcryptjs.hash(password, 10);
      const user = new UserModel({
        username,
        password: securePassword,
        email,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await user.save();
    }
    // Send Verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered Successfully. Please verify your email!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering User", error);
    return Response.json(
      { success: false, message: "Error Registering User" },
      { status: 500 }
    );
  }
};
