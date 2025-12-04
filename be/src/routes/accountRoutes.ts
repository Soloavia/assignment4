import { Router } from "express";
import * as accountController from "../controllers/accountController";

const router = Router();

router.get("/", accountController.listAccounts);
router.post("/", accountController.createAccount);

export default router;
