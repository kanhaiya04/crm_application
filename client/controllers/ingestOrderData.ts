import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { publishToQueue } from "../utils/rabbitmq";
import Customer from "../models/customerModel";

const IngestOrderData = async (req: Request, res: Response) => {
  try {
    //validating the request body
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: error.array()[0].msg });
    }

    // checking user should exists
    let user = await Customer.findById(req.body.customerId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Not a valid CustomerID" });
    }

    // publishing the customer data to the queue
    await publishToQueue("order", JSON.stringify(req.body));

    res.status(200).json({ success: true, msg: "customer added to the db" });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default IngestOrderData;
