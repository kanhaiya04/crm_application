import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Customer from "../models/customerModel";
import { publishToQueue } from "../utils/rabbitmq";

const IngestBulkOrderData = async (req: Request, res: Response) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: error.array()[0].msg });
    }
    let promises = req.body.map(async (value: any) => {
      let user = await Customer.findById(value.customerId);
      if (!user) {
        throw new Error(`${value.customerId} CustomerId doesn't exists`);
      }
    });

    await Promise.all(promises);

    req.body.map(async (value: any) => {
      await publishToQueue("order", JSON.stringify(value));
    });

    await Promise.all(promises);

    return res
      .status(200)
      .json({ success: true, msg: "orders data is added to the db" });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default IngestBulkOrderData;
