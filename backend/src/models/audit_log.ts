import { TaskStatus } from "./task.js";

export interface AuditLog {
  id: string;
  taskId: string;
  actor: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  createdAt: string;
}