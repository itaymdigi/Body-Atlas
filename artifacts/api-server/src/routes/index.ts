import { Router, type IRouter } from "express";
import healthRouter from "./health";
import patientsRouter from "./patients";
import painRecordsRouter from "./pain-records";
import treatmentsRouter from "./treatments";
import sessionsRouter from "./sessions";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(patientsRouter);
router.use(painRecordsRouter);
router.use(treatmentsRouter);
router.use(sessionsRouter);
router.use(dashboardRouter);

export default router;
