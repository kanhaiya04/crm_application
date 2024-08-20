import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserDocument extends Document {
  githubId: string;
  displayName: string;
  userName: string;
}

export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument>({
  githubId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
});

const User: UserModel = mongoose.model<UserDocument, UserModel>(
  "User",
  userSchema
);
export default User;
