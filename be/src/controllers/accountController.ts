import { Request, Response, NextFunction } from "express";
import * as accountService from "../services/accountService";
import Joi from "joi";

const CreateAccountSchema = Joi.object({
  account_number: Joi.number().integer().positive().required(),
  client_name: Joi.string().min(2).required()
});

export async function listAccounts(req: Request, res: Response, next: NextFunction) {
  try {
    const accounts = await accountService.listAccounts();
    res.json(accounts);
  } catch (err) {
    next(err);
  }
}

export async function createAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const { error, value } = CreateAccountSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const created = await accountService.createAccount(value);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}
