import Joi from "joi";

export type ActivityAction = "draw" | "deposit" | "loan";

export interface Activity {
  id?: number;
  account_number: number;
  action_name: ActivityAction;
  sum: number;
  date: string;
  interest?: number | null;
  payments?: number | null;
}

export const DepositSchema = Joi.object({
  amount: Joi.number().positive().required()
});

export const DrawSchema = Joi.object({
  amount: Joi.number().positive().required()
});

export const LoanSchema = Joi.object({
  sum: Joi.number().positive().required(),
  payments: Joi.number().integer().min(1).required(),
  interest: Joi.number().greater(0).required()
});
