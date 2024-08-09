import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { publishToQueue } from "../utils/rabbitmq";
import Customer from "../models/customerModel";

const IngestCustomerData = async (req: Request, res: Response) => {
  try {
    //validating the request body
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: error.array()[0].msg });
    }

    // checking is the email already exists
    let user = await Customer.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, msg: "Email already exists" });
    }

    // checking is the phone already exists
    user = await Customer.findOne({ phone: req.body.phone });
    if (user) {
      return res
        .status(400)
        .json({ success: false, msg: "Phone already exists" });
    }

    // publishing the customer data to the queue
    await publishToQueue("customer", JSON.stringify(req.body));

    res.status(200).json({ success: true, msg: "customer added to the db" });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default IngestCustomerData;
