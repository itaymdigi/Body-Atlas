import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const patientsTable = pgTable("patients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  phone: text("phone"),
  notes: text("notes"),
  treatmentCount: integer("treatment_count").notNull().default(0),
  avgPainScore: real("avg_pain_score").notNull().default(0),
  improvementPct: real("improvement_pct").notNull().default(0),
  lastTreatmentDate: text("last_treatment_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPatientSchema = createInsertSchema(patientsTable).omit({ id: true, createdAt: true });
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patientsTable.$inferSelect;
