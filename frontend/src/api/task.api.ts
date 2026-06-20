import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

export const getTasks = () =>
  api.get("/tasks");

export const createTask = (
  title: string
) =>
  api.post("/tasks", {
    title,
  });

export const deleteTask = (
  id: string
) =>
  api.delete(`/tasks/${id}`);

export const updateTaskStatus = (
  id: string,
  status: string,
  actor: string
) =>
  api.patch(
    `/tasks/${id}/status`,
    {
      status,
      actor,
    }
  );

export const getAuditLogs = (
  id: string
) =>
  api.get(
    `/tasks/${id}/audit-logs`
  );

export const getDeletedTasks = () =>
  api.get("/tasks/deleted");