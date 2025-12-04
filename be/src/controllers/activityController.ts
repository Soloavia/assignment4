import { Request, Response, NextFunction } from "express";
import { DepositSchema, DrawSchema, LoanSchema } from "../models/activity.model";
import * as activityService from "../services/activityService";

export async function listActivities(req: Request, res: Response, next: NextFunction) {
  try {
    const account = Number(req.params.accountNumber);
    const result = await activityService.listActivitiesForAccount(account);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function depositToAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const acc = Number(req.params.accountNumber);
    const { error, value } = DepositSchema.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const { amount } = value;
    const result = await activityService.depositToAccount(acc, amount);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function drawFromAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const acc = Number(req.params.accountNumber);
    const { error, value } = DrawSchema.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const { amount } = value;
    const result = await activityService.drawFromAccount(acc, amount);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function addLoan(req: Request, res: Response, next: NextFunction) {
  try {
    const acc = Number(req.params.accountNumber);
    const { error, value } = LoanSchema.validate(req.body);

    if (error) return res.status(400).json({ error: error.details[0].message });

    const { sum, payments, interest } = value;
    const result = await activityService.addLoan(acc, sum, payments, interest);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
