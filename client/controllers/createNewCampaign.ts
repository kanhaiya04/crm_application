import { Request, Response } from "express";
import Audience from "../models/audienceModel";
import { publishToQueue } from "../utils/rabbitmq";
import Campaign from "../models/campaignModel";
import { validationResult } from "express-validator";

const createNewCampaign = async (req: Request, res: Response) => {
  try {
    //validating the request body
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: error.array()[0].msg });
    }
    const { title, msg, id } = req.body;
    const audienceList = await Audience.findById(id);
    if (!audienceList)
      return res.status(200).json({ success: false, msg: "Audience is empty" });

    const campaign = await Campaign.create({
      name: title,
      audienceId: id,
      message: msg,
    });
    let queueData: any = { msg, campaignId: campaign._id };
    const promise = audienceList.audience.map(async (value) => {
      queueData = { ...queueData, userId: value };
      await publishToQueue("campaign", JSON.stringify(queueData));
    });
    await Promise.all(promise);
    res
      .status(200)
      .json({ success: true, msg: "Campaign created successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default createNewCampaign;
