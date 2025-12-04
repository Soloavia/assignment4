import { all, run, get } from "../db/dal";
import { Account } from "../models/account.model";

export async function getAccountByNumber(accountNumber: number): Promise<Account | undefined> {
  return get<Account>(
    `SELECT account_number, client_name
     FROM accounts
     WHERE account_number = ?`,
    [accountNumber]
  );
}

export async function listAccounts(): Promise<Account[]> {
  return all<Account>(
    `SELECT account_number, client_name
     FROM accounts
     ORDER BY account_number ASC`
  );
}

export async function createAccount(data: { account_number: number; client_name: string }): Promise<Account> {
  await run(
    `INSERT INTO accounts (account_number, client_name)
     VALUES (?, ?)`,
    [data.account_number, data.client_name]
  );

  return {
    account_number: data.account_number,
    client_name: data.client_name
  };
}
