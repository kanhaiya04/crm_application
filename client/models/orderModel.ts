import mongoose, { Document, Model, Schema } from "mongoose";

export interface OrderDocument extends Document {
  customerId: Schema.Types.ObjectId;
  orderDescription: string;
  totalAmount: number;
  created: Date;
}

export interface OrderModel extends Model<OrderDocument> {}

const orderSchema = new Schema<OrderDocument>({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  orderDescription: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Order: OrderModel = mongoose.model<OrderDocument, OrderModel>(
  "Order",
  orderSchema
);
export default Order;
