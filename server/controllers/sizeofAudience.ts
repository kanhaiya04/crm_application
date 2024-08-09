import { Request, Response } from "express";
import queryBuilder from "../utils/queryBuilderMiddleware";
import Customer from "../models/customerModel";
import { validationResult } from "express-validator";

const SizeOfAudience = async (req: Request, res: Response) => {
  try {
    const result = await Customer.find(req.query);
    res.status(200).json({ success: true, size: result.length });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default SizeOfAudience;
