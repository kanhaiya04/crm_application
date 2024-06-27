import { Request, Response } from "express";

const deliveryReceipt = async (req: Request, res: Response) => {
  try {
    const random = Math.random();
    const response = random < 0.9 ? true : false;

    res.status(200).json({ success: response });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default deliveryReceipt;
