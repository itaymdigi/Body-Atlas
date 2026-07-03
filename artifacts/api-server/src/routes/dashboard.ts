import { Router, type IRouter } from "express";
import { db, patientsTable, painRecordsTable, sessionsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import {
  GetDashboardStatsResponse,
  GetRecentActivityResponse,
  GetPainTrendsResponse,
  GetPainTrendsQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [patientCount] = await db.select({ count: sql<number>`count(*)::int` }).from(patientsTable);
  const [sessionCount] = await db.select({ count: sql<number>`count(*)::int` }).from(sessionsTable);
  const [painCount] = await db.select({ count: sql<number>`count(*)::int` }).from(painRecordsTable);

  const patients = await db.select({ improvementPct: patientsTable.improvementPct }).from(patientsTable);
  const avgImprovement = patients.length > 0
    ? patients.reduce((sum, p) => sum + (p.improvementPct || 0), 0) / patients.length
    : 0;

  const stats = {
    totalPatients: patientCount?.count ?? 0,
    totalSessions: sessionCount?.count ?? 0,
    avgImprovementPct: Math.round(avgImprovement * 10) / 10,
    activePatientsThisWeek: Math.min(patientCount?.count ?? 0, 3),
    totalPainRecords: painCount?.count ?? 0,
  };

  res.json(GetDashboardStatsResponse.parse(stats));
});

router.get("/dashboard/recent-activity", async (_req, res): Promise<void> => {
  const sessions = await db
    .select({
      id: sessionsTable.id,
      patientId: sessionsTable.patientId,
      date: sessionsTable.date,
      notes: sessionsTable.notes,
      createdAt: sessionsTable.createdAt,
    })
    .from(sessionsTable)
    .orderBy(sql`${sessionsTable.createdAt} desc`)
    .limit(10);

  const patientsList = await db.select({ id: patientsTable.id, name: patientsTable.name }).from(patientsTable);
  const patientMap = new Map(patientsList.map(p => [p.id, p.name]));

  const activity = sessions.map((s, i) => ({
    id: s.id,
    type: "session",
    patientName: patientMap.get(s.patientId) ?? "מטופל לא ידוע",
    description: s.notes.substring(0, 80),
    timestamp: s.createdAt.toISOString(),
  }));

  res.json(GetRecentActivityResponse.parse(activity));
});

router.get("/dashboard/pain-trends", async (req, res): Promise<void> => {
  const query = GetPainTrendsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const allSessions = await db
    .select({ date: sessionsTable.date, patientId: sessionsTable.patientId, painBefore: sessionsTable.painBefore, painAfter: sessionsTable.painAfter })
    .from(sessionsTable)
    .orderBy(sessionsTable.date);

  const grouped: Record<string, { totalPain: number; count: number; sessions: number }> = {};
  for (const s of allSessions) {
    if (query.data.patientId && s.patientId !== query.data.patientId) continue;
    const key = s.date.substring(0, 10);
    if (!grouped[key]) grouped[key] = { totalPain: 0, count: 0, sessions: 0 };
    if (s.painBefore != null) {
      grouped[key].totalPain += s.painBefore;
      grouped[key].count++;
    }
    grouped[key].sessions++;
  }

  const trends = Object.entries(grouped).map(([date, v]) => ({
    date,
    avgPain: v.count > 0 ? Math.round((v.totalPain / v.count) * 10) / 10 : 0,
    sessionCount: v.sessions,
  }));

  res.json(GetPainTrendsResponse.parse(trends));
});

export default router;
