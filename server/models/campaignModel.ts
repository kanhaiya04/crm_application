import mongoose, { Document, Model, Schema } from "mongoose";

export interface CampaignDocument extends Document {
  name: string;
  audienceId: Schema.Types.ObjectId;
  message: string;
  deliveryStatus: { userId: Schema.Types.ObjectId; status: Boolean }[];
  created: Date;
}

export interface CampaignModel extends Model<CampaignDocument> {}

const CampaignSchema = new Schema<CampaignDocument>({
  name: {
    type: String,
    required: true,
  },
  audienceId: {
    type: Schema.Types.ObjectId,
    ref: "Audience",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  deliveryStatus: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
      },
      status: {
        type: Boolean,
        required: true,
      },
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

const Campaign: CampaignModel = mongoose.model<CampaignDocument, CampaignModel>(
  "Campaign",
  CampaignSchema
);
export default Campaign;
