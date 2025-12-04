import { all, run } from "../db/dal";
import { Activity } from "../models/activity.model";
import { getAccountByNumber } from "./accountService";

function fmt(n: number): string {
  return n.toFixed(2);
}

function isoDate(): string {
  return new Date().toISOString();
}

export async function getCurrentBalance(accountNumber: number): Promise<number> {
  const rows = await all<{ sum: number }>(
    `SELECT sum FROM activities WHERE account_number = ?`,
    [accountNumber]
  );
  return rows.reduce((acc, r) => acc + r.sum, 0);
}

export async function listActivitiesForAccount(accountNumber: number): Promise<Activity[]> {
  const account = await getAccountByNumber(accountNumber);
  if (!account) {
    const err: any = new Error("Account not found");
    err.status = 404;
    throw err;
  }

  return all<Activity>(
    `SELECT id, account_number, action_name, sum, date, interest, payments
     FROM activities
     WHERE account_number = ?
     ORDER BY date ASC, id ASC`,
    [accountNumber]
  );
}

export async function depositToAccount(accountNumber: number, amount: number) {
  if (amount <= 0) throw new Error("Deposit must be positive.");

  const account = await getAccountByNumber(accountNumber);
  if (!account) {
    const err: any = new Error("Account not found");
    err.status = 404;
    throw err;
  }

  await run(
    `INSERT INTO activities (account_number, action_name, sum, date, interest, payments)
     VALUES (?, 'deposit', ?, ?, NULL, NULL)`,
    [accountNumber, amount, isoDate()]
  );

  const balance = await getCurrentBalance(accountNumber);

  return {
    message: "Deposit completed",
    balance: fmt(balance)
  };
}

export async function drawFromAccount(accountNumber: number, amount: number) {
  if (amount <= 0) throw new Error("Draw amount must be positive.");

  const account = await getAccountByNumber(accountNumber);
  if (!account) {
    const err: any = new Error("Account not found");
    err.status = 404;
    throw err;
  }

  const negativeAmount = -Math.abs(amount);

  await run(
    `INSERT INTO activities (account_number, action_name, sum, date, interest, payments)
     VALUES (?, 'draw', ?, ?, NULL, NULL)`,
    [accountNumber, negativeAmount, isoDate()]
  );

  const balance = await getCurrentBalance(accountNumber);

  return {
    message: "Draw completed",
    balance: fmt(balance),
    warning: balance < 0 ? "You are in debt!" : null
  };
}

export async function addLoan(
  accountNumber: number,
  sum: number,
  payments: number,
  interest: number
) {
  if (sum <= 0) throw new Error("Loan sum must be positive.");
  if (interest <= 0) throw new Error("Interest must be greater than zero.");
  if (payments < 1) throw new Error("Payments must be at least 1.");

  const account = await getAccountByNumber(accountNumber);
  if (!account) {
    const err: any = new Error("Account not found");
    err.status = 404;
    throw err;
  }

  await run(
    `INSERT INTO activities (account_number, action_name, sum, date, interest, payments)
     VALUES (?, 'loan', ?, ?, ?, ?)`,
    [accountNumber, sum, isoDate(), interest, payments]
  );

  const balance = await getCurrentBalance(accountNumber);

  return {
    message: "Loan added",
    balance: fmt(balance)
  };
}
