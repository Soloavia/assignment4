import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { initDb } from "./db/initDb";
import accountRoutes from "./routes/accountRoutes";
import activityRoutes from "./routes/activityRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize DB schema (+ seed)
initDb();

app.use("/api/accounts", accountRoutes);
app.use("/api/accounts", activityRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Bank API (TS) running on http://localhost:${PORT}`);
});
