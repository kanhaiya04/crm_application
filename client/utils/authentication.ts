import { NextFunction, Request, Response } from "express";

const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).send({ success: false, error: "Unauthorized" });
    }
    next();
  } catch (error: any) {
    res.status(401).send({ success: false, error: error.message });
  }
};

export default authenticationMiddleware;
