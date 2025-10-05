import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  createdAt: Date;
  isActivated: boolean;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);