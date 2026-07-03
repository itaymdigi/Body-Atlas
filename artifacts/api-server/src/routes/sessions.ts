import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, sessionsTable } from "@workspace/db";
import {
  ListSessionsResponse,
  ListSessionsQueryParams,
  CreateSessionBody,
  CreateSessionResponse,
} from "@workspace/api-zod";
import { serializeDates, serializeDatesArray } from "../lib/serialize";

const router: IRouter = Router();

router.get("/sessions", async (req, res): Promise<void> => {
  const query = ListSessionsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }
  let sessions;
  if (query.data.patientId) {
    sessions = await db.select().from(sessionsTable).where(eq(sessionsTable.patientId, query.data.patientId)).orderBy(sessionsTable.createdAt);
  } else {
    sessions = await db.select().from(sessionsTable).orderBy(sessionsTable.createdAt);
  }
  res.json(ListSessionsResponse.parse(serializeDatesArray(sessions)));
});

router.post("/sessions", async (req, res): Promise<void> => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [session] = await db.insert(sessionsTable).values(parsed.data).returning();
  res.status(201).json(CreateSessionResponse.parse(serializeDates(session)));
});

export default router;
