import { Router } from "express";

import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
  getAuditLogs,
  getDeletedTasks,
} from "../controllers/task.controller";

const router = Router();

router.get("/", getTasks);

router.get("/deleted", getDeletedTasks);

router.post("/", createTask);

router.patch("/:id/status", updateTaskStatus);

router.delete("/:id", deleteTask);

router.get("/:id/audit-logs", getAuditLogs);

export default router;