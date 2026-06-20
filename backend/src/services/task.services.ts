import { v4 as uuid } from "uuid";

import {
  readJsonFile,
  writeJsonFile,
} from "../utils/file-storage";

import { Task, TaskStatus } from "../models/task";
import { AuditLog } from "../models/audit_log";

const TASKS_PATH = "src/data/tasks.json";
const AUDIT_LOGS_PATH = "src/data/audit-logs.json";

const STATUS_FLOW: Record<
  Exclude<TaskStatus, "done">,
  TaskStatus
> = {
  to_do: "pending",
  pending: "in_progress",
  in_progress: "done",
};

export const getAllTasks = (): Task[] => {
  const tasks = readJsonFile<Task[]>(TASKS_PATH);
  return tasks.filter((t) => !t.deletedAt);
};

export const getDeletedTasks = (): Task[] => {
  const tasks = readJsonFile<Task[]>(TASKS_PATH);
  return tasks.filter((t) => !!t.deletedAt);
};

export const createTask = (
  title: string
): Task => {
  const tasks = readJsonFile<Task[]>(
    TASKS_PATH
  );

  const task: Task = {
    id: uuid(),
    title,
    status: "to_do",
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);

  writeJsonFile(TASKS_PATH, tasks);

  return task;
};

export const deleteTask = (
  id: string
) => {
  const tasks = readJsonFile<Task[]>(
    TASKS_PATH
  );

  const task = tasks.find(
    (item) => item.id === id
  );

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.deletedAt) {
    throw new Error("Task already deleted");
  }

  task.deletedAt = new Date().toISOString();

  writeJsonFile(TASKS_PATH, tasks);

  return {
    message: "Task deleted",
  };
};

export const getAuditLogs = (
  taskId: string
): AuditLog[] => {
  const logs = readJsonFile<AuditLog[]>(
    AUDIT_LOGS_PATH
  );

  return logs
    .filter(
      (log) => log.taskId === taskId
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
};

export const updateTaskStatus = (
  taskId: string,
  status: TaskStatus,
  actor: string
) => {
  const tasks = readJsonFile<Task[]>(
    TASKS_PATH
  );

  const auditLogs =
    readJsonFile<AuditLog[]>(
      AUDIT_LOGS_PATH
    );

  const task = tasks.find(
    (item) => item.id === taskId
  );

  if (!task) {
    throw new Error("Task not found");
  }

  if (!actor) {
    throw new Error("Actor is required");
  }

  const validStatuses: TaskStatus[] = [
    "to_do",
    "pending",
    "in_progress",
    "done",
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  // Idempotent Update
  if (task.status === status) {
    return {
      message: "No changes detected",
      task,
    };
  }

  if (task.status === "done") {
    throw new Error(
      "Task already completed"
    );
  }

  const allowedNextStatus =
    STATUS_FLOW[
      task.status as keyof typeof STATUS_FLOW
    ];

  if (allowedNextStatus !== status) {
    throw new Error(
      `Invalid transition from ${task.status} to ${status}`
    );
  }

  const oldStatus = task.status;

  task.status = status;

  writeJsonFile(TASKS_PATH, tasks);

  const auditLog: AuditLog = {
    id: uuid(),
    taskId: task.id,
    actor,
    fromStatus: oldStatus,
    toStatus: status,
    createdAt: new Date().toISOString(),
  };

  auditLogs.push(auditLog);

  writeJsonFile(
    AUDIT_LOGS_PATH,
    auditLogs
  );

  return task;
};