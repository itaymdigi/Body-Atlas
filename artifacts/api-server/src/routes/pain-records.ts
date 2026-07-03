import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, painRecordsTable } from "@workspace/db";
import {
  ListPainRecordsResponse,
  ListPainRecordsQueryParams,
  CreatePainRecordBody,
  CreatePainRecordResponse,
  GetPainRecordParams,
  GetPainRecordResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/pain-records", async (req, res): Promise<void> => {
  const query = ListPainRecordsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  let records;
  if (query.data.patientId) {
    records = await db.select().from(painRecordsTable).where(eq(painRecordsTable.patientId, query.data.patientId)).orderBy(painRecordsTable.createdAt);
  } else {
    records = await db.select().from(painRecordsTable).orderBy(painRecordsTable.createdAt);
  }
  res.json(ListPainRecordsResponse.parse(records));
});

router.post("/pain-records", async (req, res): Promise<void> => {
  const parsed = CreatePainRecordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [record] = await db.insert(painRecordsTable).values(parsed.data).returning();
  res.status(201).json(CreatePainRecordResponse.parse(record));
});

router.get("/pain-records/:id", async (req, res): Promise<void> => {
  const params = GetPainRecordParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [record] = await db.select().from(painRecordsTable).where(eq(painRecordsTable.id, params.data.id));
  if (!record) {
    res.status(404).json({ error: "Pain record not found" });
    return;
  }
  res.json(GetPainRecordResponse.parse(record));
});

export default router;
