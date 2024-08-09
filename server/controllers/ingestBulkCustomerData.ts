import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Customer from "../models/customerModel";
import { publishToQueue } from "../utils/rabbitmq";

const IngestBulkCustomerData = async (req: Request, res: Response) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: error.array()[0].msg });
    }
    let promises = req.body.map(async (value: any) => {
      let user = await Customer.findOne({ email: value.email });
      if (user) {
        throw new Error(`Email ${value.email} already exists`);
      }
      user = await Customer.findOne({ phone: value.phone });
      if (user) {
        throw new Error(`Phone ${value.phone} already exists`);
      }
    });

    await Promise.all(promises);

    req.body.map(async (value: any) => {
      await publishToQueue("customer", JSON.stringify(value));
    });

    await Promise.all(promises);

    return res
      .status(200)
      .json({ success: true, msg: "customers data is added to the db" });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default IngestBulkCustomerData;
