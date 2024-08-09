import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserDocument extends Document {
  googleId: string;
  displayName: string;
  firstName: string;
  lastName: string;
  image: string;
}

export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument>({
  googleId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const User: UserModel = mongoose.model<UserDocument, UserModel>(
  "User",
  userSchema
);
export default User;
