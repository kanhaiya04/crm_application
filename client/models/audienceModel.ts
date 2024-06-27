import mongoose, { Document, Model, Schema } from "mongoose";

export interface AudienceDocument extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  size: number;
  audience: Schema.Types.ObjectId[];
  created: Date;
}

export interface AudienceModel extends Model<AudienceDocument> {}

const audienceSchema = new Schema<AudienceDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  audience: {
    type: [Schema.Types.ObjectId],
    ref: "Customer",
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Audience: AudienceModel = mongoose.model<AudienceDocument, AudienceModel>(
  "Audience",
  audienceSchema
);

export default Audience;
