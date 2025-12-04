import { Router } from "express";
import * as controller from "../controllers/activityController";

const router = Router({ mergeParams: true });

router.get("/:accountNumber/activities", controller.listActivities);
router.post("/:accountNumber/deposit", controller.depositToAccount);
router.post("/:accountNumber/draw", controller.drawFromAccount);
router.post("/:accountNumber/loan", controller.addLoan);

export default router;
