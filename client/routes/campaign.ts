import { Router } from "express";
import createNewCampaign from "../controllers/createNewCampaign";
import deliveryReceipt from "../controllers/deliveryReceipt";
import getCampaign from "../controllers/getCampaign";
import authenticationMiddleware from "../utils/authentication";
import { checkSchema } from "express-validator";

const router = Router();

const createCampaignValidation = checkSchema({
  title: {
    in: ["body"],
    exists: {
      errorMessage: "Title is required",
    },
    isString: {
      errorMessage: "Title must be a string",
    },
    notEmpty: {
      errorMessage: "Title cannot be empty",
    },
  },
  msg: {
    in: ["body"],
    exists: {
      errorMessage: "Message is required",
    },
    isString: {
      errorMessage: "Message must be a string",
    },
    notEmpty: {
      errorMessage: "Message cannot be empty",
    },
  },
  id: {
    in: ["body"],
    exists: {
      errorMessage: "ID is required",
    },
    isString: {
      errorMessage: "ID must be a string",
    },
    notEmpty: {
      errorMessage: "ID cannot be empty",
    },
  },
});

router.post(
  "/create",
  authenticationMiddleware,
  createCampaignValidation,
  createNewCampaign
);

router.post("/deliveryReceipt", deliveryReceipt);

const getCampaignValidation = checkSchema({
  audienceId: {
    in: ["body"],
    exists: {
      errorMessage: "ID is required",
    },
    isString: {
      errorMessage: "ID must be a string",
    },
    notEmpty: {
      errorMessage: "ID cannot be empty",
    },
  },
});

router.post(
  "/data",
  authenticationMiddleware,
  getCampaignValidation,
  getCampaign
);

export default router;
