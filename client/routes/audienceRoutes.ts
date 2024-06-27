import { Router } from "express";
import SizeOfAudience from "../controllers/sizeofAudience";
import { checkSchema } from "express-validator";
import queryBuilderMiddleware from "../utils/queryBuilderMiddleware";
import SaveAudience from "../controllers/saveAudience";
import getAudience from "../controllers/getAudience";
import authenticationMiddleware from "../utils/authentication";

const router = Router();

const validateConditions = checkSchema({
  order: {
    in: ["body"],
    isArray: {
      errorMessage: "order must be an array",
    },
    custom: {
      options: (value) =>
        value.every(
          (item: string) => typeof item === "string" && item.trim().length > 0
        ),
      errorMessage: "order array must contain non-empty strings",
    },
  },
  operators: {
    in: ["body"],
    isArray: {
      errorMessage: "operators must be an array",
    },
    custom: {
      options: (value, { req }) => {
        // Check if the length of operators array is order array length - 1
        if (value.length !== req.body.order.length - 1) {
          throw new Error(
            "operators array length must be order array length - 1"
          );
        }
        // Check if all items in operators are non-empty strings
        if (
          !value.every(
            (item: string) => typeof item === "string" && item.trim().length > 0
          )
        ) {
          throw new Error("operators array must contain non-empty strings");
        }
        return true;
      },
    },
  },
  totalSpend: {
    in: ["body"],
    exists: {
      errorMessage: "totalSpend is required",
    },
    isObject: {
      errorMessage: "totalSpend must be an object",
    },
  },
  "totalSpend.active": {
    in: ["body"],
    isBoolean: {
      errorMessage: "totalSpend.active must be a boolean",
    },
  },
  "totalSpend.option": {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        if (req.body.totalSpend.active) {
          return Number.isInteger(value) && value >= 1 && value <= 3;
        }
        return true; // Skip validation if active is false
      },
      errorMessage:
        "totalSpend.option must be an integer between 1 and 3 when active is true",
    },
  },
  "totalSpend.value1": {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        if (req.body.totalSpend.active) {
          return Number.isInteger(value) && value >= 0;
        }
        return true; // Skip validation if active is false
      },
      errorMessage:
        "totalSpend.value1 must be a number greater than or equal to 0 when active is true",
    },
  },
  "totalSpend.value2": {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        if (req.body.totalSpend.active) {
          return Number.isInteger(value) && value >= 0;
        }
        return true; // Skip validation if active is false
      },
      errorMessage:
        "totalSpend.value2 must be a number greater than or equal to 0 when active is true",
    },
  },
  visits: {
    in: ["body"],
    exists: {
      errorMessage: "visits is required",
    },
    isObject: {
      errorMessage: "visits must be an object",
    },
  },
  "visits.active": {
    in: ["body"],
    isBoolean: {
      errorMessage: "visits.active must be a boolean",
    },
  },
  "visits.option": {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        if (req.body.visits.active) {
          return Number.isInteger(value) && value >= 1 && value <= 3;
        }
        return true; // Skip validation if active is false
      },
      errorMessage:
        "visits.option must be an integer between 1 and 3 when active is true",
    },
  },
  "visits.value1": {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        if (req.body.visits.active) {
          return Number.isInteger(value) && value >= 0;
        }
        return true; // Skip validation if active is false
      },
      errorMessage:
        "visits.value1 must be a number greater than or equal to 0 when active is true",
    },
  },
  "visits.value2": {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        if (req.body.visits.active) {
          return Number.isInteger(value) && value >= 0;
        }
        return true; // Skip validation if active is false
      },
      errorMessage:
        "visits.value2 must be a number greater than or equal to 0 when active is true",
    },
  },
  lastVisits: {
    in: ["body"],
    exists: {
      errorMessage: "lastVisits is required",
    },
    isObject: {
      errorMessage: "lastVisits must be an object",
    },
  },
  "lastVisits.active": {
    in: ["body"],
    isBoolean: {
      errorMessage: "lastVisits.active must be a boolean",
    },
  },
  "lastVisits.option": {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        if (req.body.lastVisits.active) {
          return Number.isInteger(value) && value >= 1 && value <= 3;
        }
        return true; // Skip validation if active is false
      },
      errorMessage:
        "lastVisits.option must be an integer between 1 and 3 when active is true",
    },
  },
  "lastVisits.value1": {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        if (req.body.lastVisits.active) {
          return Number.isInteger(value) && value >= 0;
        }
        return true; // Skip validation if active is false
      },
      errorMessage:
        "lastVisits.value1 must be a number greater than or equal to 0 when active is true",
    },
  },
  "lastVisits.value2": {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        if (req.body.lastVisits.active) {
          return Number.isInteger(value) && value >= 0;
        }
        return true; // Skip validation if active is false
      },
      errorMessage:
        "lastVisits.value2 must be a number greater than or equal to 0 when active is true",
    },
  },
});

router.post(
  "/checkSize",
  authenticationMiddleware,
  validateConditions,
  queryBuilderMiddleware,
  SizeOfAudience
);

router.post(
  "/save",
  authenticationMiddleware,
  validateConditions,
  queryBuilderMiddleware,
  SaveAudience
);

router.get("/get", authenticationMiddleware, getAudience);
export default router;
