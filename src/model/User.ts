import mongoose, { Schema, Document } from "mongoose";

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
    }
  },
  { timestamps: true }
);




export interface User extends Document {
  username: String;
  email: String;
  password: String;
  verifyCode: String;
  verifyCodeExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
  isAccepting: 
}

const UserSchema: Schema<User> = new Schema(
  {
    content: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);
