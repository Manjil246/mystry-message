import mongoose, { Schema, Document, model } from "mongoose";

export interface Message extends Document {
  content: String;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<Message> = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export interface User extends Document {
  username: String;
  email: String;
  password: String;
  verifyCode: String;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username Required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email Required"],
      trim: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please use a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password Required"],
    },
    verifyCode: {
      type: String,
      required: [true, "Verify Code Required"],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, "Verify Code Expiry Required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessage: {
      type: Boolean,
      default: true,
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  model<User>("User", UserSchema);

export default UserModel;
