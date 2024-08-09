import { Request, Response } from "express";
import Campaign from "../models/campaignModel";
import Audience from "../models/audienceModel";
import { validationResult } from "express-validator";

const getCampaign = async (req: Request, res: Response) => {
  try {
    //validating the request body
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: error.array()[0].msg });
    }
    const { audienceId } = req.body;
    const audienceData = await Audience.findById(audienceId);
    //@ts-ignore
    if (!req.user._id.equals(audienceData.userId)) {
      return res
        .status(200)
        .json({ success: false, msg: "UnAuthorized access" });
    }
    const campaignData = await Campaign.find({ audienceId }).sort({
      created: -1,
    });
    res.status(200).json({ success: true, data: campaignData });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default getCampaign;
