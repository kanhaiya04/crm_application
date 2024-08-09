import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const queryBuilderMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: error.array()[0].msg });
    }
    const { order, operators, totalSpend, visits, lastVisits } = req.body;
    let query = {};
    let query1 = {};
    order.map((value: string, index: number) => {
      if (value === "totalSpend") {
        if (totalSpend.option === 1) {
          if (totalSpend.value1 > totalSpend.value2)
            throw new Error("value1 should be less than value2");
          query = {
            ...query,
            totalSpend: { $gte: totalSpend.value1, $lte: totalSpend.value2 },
          };
        } else if (totalSpend.option === 2) {
          query = {
            ...query,
            totalSpend: { $gte: totalSpend.value1 },
          };
        } else if (totalSpend.option === 3) {
          query = {
            ...query,
            totalSpend: { $lte: totalSpend.value1 },
          };
        }
      } else if (value === "visits") {
        if (visits.option === 1) {
          if (visits.value1 > visits.value2)
            throw new Error("value1 should be less than value2");
          query = {
            ...query,
            noOfVisits: { $gte: visits.value1, $lte: visits.value2 },
          };
        } else if (visits.option === 2) {
          query = {
            ...query,
            noOfVisits: { $gte: visits.value1 },
          };
        } else if (visits.option === 3) {
          query = {
            ...query,
            noOfVisits: { $lte: visits.value1 },
          };
        }
      } else {
        const value1Date = new Date();
        value1Date.setMonth(value1Date.getMonth() - lastVisits.value1);
        if (lastVisits.option === 1) {
          if (lastVisits.value1 > lastVisits.value2)
            throw new Error("value1 should be less than value2");
          const value2Date = new Date();
          value2Date.setMonth(value2Date.getMonth() - lastVisits.value2);
          query = {
            ...query,
            lastVisit: { $gte: value2Date, $lte: value1Date },
          };
        } else if (lastVisits.option === 2) {
          query = { ...query, lastVisit: { $gte: value1Date } };
        } else if (lastVisits.option === 3) {
          query = { ...query, lastVisit: { $lte: value1Date } };
        }
      }
      if (index !== 0) {
        if (operators[index - 1] === "OR") {
          query1 = {
            $or: [query1, query],
          };
        } else {
          query1 = { ...query1, ...query };
        }
      } else {
        query1 = { ...query };
      }
      query = {};
    });

    req.query = query1;
    next();
  } catch (error: any) {
    return res.status(500).json({ success: false, msg: error.message });
  }
};

export default queryBuilderMiddleware;
