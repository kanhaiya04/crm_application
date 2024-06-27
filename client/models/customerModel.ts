import mongoose, { Document, Model, Schema } from "mongoose";

export interface CustomerDocument extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  totalSpend: number;
  noOfVisits: number;
  created: Date;
  lastVisit: Date;
}

export interface CustomerModel extends Model<CustomerDocument> {}

const customerSchema = new Schema<CustomerDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
  },
  totalSpend: {
    type: Number,
    default: 0,
  },
  noOfVisits: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  lastVisit: {
    type: Date,
  },
});

const Customer: CustomerModel = mongoose.model<CustomerDocument, CustomerModel>(
  "Customer",
  customerSchema
);

export default Customer;
