import { Request, Response } from "express";
import Customer from "../models/customerModel";
import { publishToQueue } from "../utils/rabbitmq";

const SaveAudience = async (req: Request, res: Response) => {
  try {
    if (req.isAuthenticated()) {
      //@ts-ignore
      console.log(req.user._id);
      const result = await Customer.find(req.query);
      //@ts-ignore
      const response = { result, userId: req.user._id, title: req.body.title };
      await publishToQueue("audience", JSON.stringify(response));
      return res
        .status(200)
        .json({ success: true, msg: "Audience is created" });
    }
    res.status(200).json({ success: false, msg: "not created" });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default SaveAudience;
