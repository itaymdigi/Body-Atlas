import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { patientsTable } from "./patients";

export const painRecordsTable = pgTable("pain_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patientsTable.id),
  date: text("date").notNull(),
  bodyArea: text("body_area").notNull(),
  side: text("side").notNull(),
  painIntensity: integer("pain_intensity").notNull(),
  sensitivityLevel: text("sensitivity_level").notNull(),
  pressureDepth: text("pressure_depth").notNull(),
  painType: text("pain_type").notNull(),
  notes: text("notes"),
  recommendation: text("recommendation"),
  followUpDate: text("follow_up_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPainRecordSchema = createInsertSchema(painRecordsTable).omit({ id: true, createdAt: true });
export type InsertPainRecord = z.infer<typeof insertPainRecordSchema>;
export type PainRecord = typeof painRecordsTable.$inferSelect;
