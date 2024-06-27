import { Router } from "express";
import IngestCustomerData from "../controllers/ingestCustomerData";
import { check, checkSchema } from "express-validator";
import IngestBulkCustomerData from "../controllers/ingestBulkCustomerData";
import IngestOrderData from "../controllers/ingestOrderData";
import IngestBulkOrderData from "../controllers/ingestBulkOrderData";

const router = Router();

const validateObject = checkSchema({
  name: {
    in: ["body"],
    isString: true,
    trim: true,
    notEmpty: {
      errorMessage: "Name is required",
    },
  },
  email: {
    in: ["body"],
    isEmail: true,
    normalizeEmail: true,
    errorMessage: "Invalid email address",
  },
  phone: {
    in: ["body"],
    isString: true,
    notEmpty: {
      errorMessage: "Phone number is required",
    },
    matches: {
      options: [/^\d{3}-\d{3}-\d{4}$/],
      errorMessage: "Phone number must be in the format XXX-XXX-XXXX",
    },
  },
  address: {
    in: ["body"],
    optional: true,
    isString: true,
  },
  totalSpend: {
    in: ["body"],
    optional: true,
    isNumeric: true,
  },
  noOfVisits: {
    in: ["body"],
    optional: true,
    isNumeric: true,
  },
  created: {
    in: ["body"],
    optional: true,
    isISO8601: true,
    toDate: true,
  },
  lastVisit: {
    in: ["body"],
    optional: true,
    isISO8601: true,
    toDate: true,
  },
});

const validateArray = [
  check("*.name")
    .isString()
    .withMessage("Name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  check("*.email")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),

  check("*.phone")
    .isString()
    .withMessage("Phone number must be a string")
    .matches(/^\d{3}-\d{3}-\d{4}$/)
    .withMessage("Phone number must be in the format XXX-XXX-XXXX")
    .notEmpty()
    .withMessage("Phone number is required"),

  check("*.address")
    .optional()
    .isString()
    .withMessage("Address must be a string"),

  check("*.totalSpend")
    .optional()
    .isNumeric()
    .withMessage("Total Spend must be a number"),

  check("*.noOfVisits")
    .optional()
    .isNumeric()
    .withMessage("Number of Visits must be a number"),

  check("*.created")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Created date must be a valid date"),

  check("*.lastVisit")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Last visit date must be a valid date"),
];

const validateOrder = checkSchema({
  customerId: {
    in: ["body"],
    isMongoId: {
      errorMessage: "customerId must be a valid Mongo ID",
    },
    exists: {
      errorMessage: "customerId is required",
    },
  },
  orderDescription: {
    in: ["body"],
    isString: {
      errorMessage: "orderDescription must be a string",
    },
    notEmpty: {
      errorMessage: "orderDescription is required",
    },
  },
  totalAmount: {
    in: ["body"],
    isNumeric: {
      errorMessage: "totalAmount must be a number",
    },
    notEmpty: {
      errorMessage: "totalAmount is required",
    },
  },
  created: {
    in: ["body"],
    optional: true,
    isISO8601: {
      errorMessage: "created must be a valid ISO 8601 date",
    },
    toDate: true,
  },
});

const validateOrderArray = [
  check("*.customerId")
    .isMongoId()
    .withMessage("customerId must be a valid Mongo ID")
    .exists()
    .withMessage("customerId is required"),
  check("*.orderDescription")
    .isString()
    .withMessage("orderDescription must be a string")
    .notEmpty()
    .withMessage("orderDescription is required"),
  check("*.totalAmount")
    .isNumeric()
    .withMessage("totalAmount must be a number")
    .notEmpty()
    .withMessage("totalAmount is required"),
  check("*.created")
    .optional()
    .isISO8601()
    .withMessage("created must be a valid ISO 8601 date")
    .toDate(),
];

// ingesting single object
router.post("/customer", validateObject, IngestCustomerData);

// ingesting bulk customer data
router.post("/customer/bulk", validateArray, IngestBulkCustomerData);

router.post("/order", validateOrder, IngestOrderData);

router.post("/order/bulk", validateOrderArray, IngestBulkOrderData);

export default router;
