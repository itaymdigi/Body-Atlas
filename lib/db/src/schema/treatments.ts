import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { patientsTable } from "./patients";

export const treatmentsTable = pgTable("treatments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").notNull().references(() => patientsTable.id),
  reflexologyZones: text("reflexology_zones").array().notNull().default([]),
  elementFocus: text("element_focus").notNull(),
  goals: text("goals").array().notNull().default([]),
  sessionDurationMin: integer("session_duration_min").notNull().default(45),
  frequencyPerWeek: integer("frequency_per_week").notNull().default(1),
  followUpSchedule: text("follow_up_schedule"),
  summary: text("summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTreatmentSchema = createInsertSchema(treatmentsTable).omit({ id: true, createdAt: true });
export type InsertTreatment = z.infer<typeof insertTreatmentSchema>;
export type Treatment = typeof treatmentsTable.$inferSelect;
