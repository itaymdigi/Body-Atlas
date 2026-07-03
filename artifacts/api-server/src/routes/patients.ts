import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, patientsTable } from "@workspace/db";
import {
  ListPatientsResponse,
  CreatePatientBody,
  CreatePatientResponse,
  GetPatientParams,
  GetPatientResponse,
  UpdatePatientParams,
  UpdatePatientBody,
  UpdatePatientResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/patients", async (_req, res): Promise<void> => {
  const patients = await db.select().from(patientsTable).orderBy(patientsTable.createdAt);
  res.json(ListPatientsResponse.parse(patients));
});

router.post("/patients", async (req, res): Promise<void> => {
  const parsed = CreatePatientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [patient] = await db.insert(patientsTable).values(parsed.data).returning();
  res.status(201).json(CreatePatientResponse.parse(patient));
});

router.get("/patients/:id", async (req, res): Promise<void> => {
  const params = GetPatientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [patient] = await db.select().from(patientsTable).where(eq(patientsTable.id, params.data.id));
  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }
  res.json(GetPatientResponse.parse(patient));
});

router.patch("/patients/:id", async (req, res): Promise<void> => {
  const params = UpdatePatientParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdatePatientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [patient] = await db.update(patientsTable).set(parsed.data).where(eq(patientsTable.id, params.data.id)).returning();
  if (!patient) {
    res.status(404).json({ error: "Patient not found" });
    return;
  }
  res.json(UpdatePatientResponse.parse(patient));
});

export default router;
