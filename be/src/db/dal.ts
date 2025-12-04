import { db } from "./database";

export interface RunResult {
  id?: number;
  changes: number;
}

export function run(query: string, params: any[] = []): Promise<RunResult> {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID as number, changes: this.changes });
      }
    });
  });
}

export function get<T = any>(query: string, params: any[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row as T | undefined);
      }
    });
  });
}

export function all<T = any>(query: string, params: any[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as T[]);
      }
    });
  });
}
