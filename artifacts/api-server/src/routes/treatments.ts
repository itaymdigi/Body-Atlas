import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, treatmentsTable } from "@workspace/db";
import {
  ListTreatmentsResponse,
  ListTreatmentsQueryParams,
  CreateTreatmentBody,
  CreateTreatmentResponse,
  GetTreatmentParams,
  GetTreatmentResponse,
} from "@workspace/api-zod";
import { serializeDates, serializeDatesArray } from "../lib/serialize";

const router: IRouter = Router();

router.get("/treatments", async (req, res): Promise<void> => {
  const query = ListTreatmentsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  let treatments;
  if (query.data.patientId) {
    treatments = await db.select().from(treatmentsTable).where(eq(treatmentsTable.patientId, query.data.patientId)).orderBy(treatmentsTable.createdAt);
  } else {
    treatments = await db.select().from(treatmentsTable).orderBy(treatmentsTable.createdAt);
  }
  res.json(ListTreatmentsResponse.parse(serializeDatesArray(treatments)));
});

router.post("/treatments", async (req, res): Promise<void> => {
  const parsed = CreateTreatmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [treatment] = await db.insert(treatmentsTable).values(parsed.data).returning();
  res.status(201).json(CreateTreatmentResponse.parse(serializeDates(treatment)));
});

router.get("/treatments/:id", async (req, res): Promise<void> => {
  const params = GetTreatmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [treatment] = await db.select().from(treatmentsTable).where(eq(treatmentsTable.id, params.data.id));
  if (!treatment) {
    res.status(404).json({ error: "Treatment not found" });
    return;
  }
  res.json(GetTreatmentResponse.parse(serializeDates(treatment)));
});

export default router;
