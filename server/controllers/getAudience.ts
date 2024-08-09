import { Request, Response } from "express";
import Audience from "../models/audienceModel";

const getAudience = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.user._id;
    const response = await Audience.find({ userId });
    res.status(200).json({ success: true, response });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default getAudience;
