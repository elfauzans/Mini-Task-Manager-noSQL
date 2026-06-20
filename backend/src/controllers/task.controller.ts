import { Request, Response } from "express";
import * as taskService from "../services/task.services";

interface TaskParams {
  id: string;
}

export const getTasks = (
  req: Request,
  res: Response
) => {
  const tasks = taskService.getAllTasks();

  return res.json(tasks);
};

export const createTask = (
  req: Request,
  res: Response
) => {
  try {
    const { title } = req.body;

    const task = taskService.createTask(title);

    return res.status(201).json(task);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const updateTaskStatus = (
  req: Request<TaskParams>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status, actor } = req.body;

    const result = taskService.updateTaskStatus(
      id,
      status,
      actor
    );

    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteTask = (
  req: Request<TaskParams>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const result = taskService.deleteTask(id);

    return res.json(result);
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

export const getDeletedTasks = (
  _req: Request,
  res: Response
) => {
  const tasks = taskService.getDeletedTasks();
  return res.json(tasks);
};

export const getAuditLogs = (
  req: Request<TaskParams>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const logs = taskService.getAuditLogs(id);

    return res.json(logs);
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
};