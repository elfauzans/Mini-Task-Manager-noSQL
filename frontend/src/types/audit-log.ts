import type { TaskStatus } from "./task";

export interface AuditLog {
  id: string;
  taskId: string;
  actor: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  createdAt: string;
}