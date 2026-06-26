import { useEffect, useState } from "react";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTaskStatus,
  getAuditLogs,
  getDeletedTasks,
} from "./api/task.api";

import type { Task } from "./types/task";
import type { AuditLog } from "./types/audit-log";

const ACTORS = ["john.doe", "jane.smith", "admin.user"];

const NEXT_STATUS = {
  to_do: "pending",
  pending: "in_progress",
  in_progress: "done",
};

function App() {
  const [activeTab, setActiveTab] = useState<"list" | "history">("list");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [actor, setActor] = useState("john.doe");
  const [logs, setLogs] = useState<Record<string, AuditLog[]>>({});
  const [openLogIds, setOpenLogIds] = useState<Record<string, boolean>>({});
  const [logError, setLogError] = useState<Record<string, string>>({});

  const fetchTasks = async () => {
    try {
      const [activeRes, deletedRes] = await Promise.all([
        getTasks(),
        getDeletedTasks(),
      ]);
      setTasks(activeRes.data);
      setDeletedTasks(deletedRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void (async () => {
      try {
        const [activeRes, deletedRes] = await Promise.all([
          getTasks(),
          getDeletedTasks(),
        ]);
        setTasks(activeRes.data);
        setDeletedTasks(deletedRes.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const handleCreateTask = async () => {
    if (!title.trim()) return;
    try {
      await createTask(title);
      setTitle("");
      await fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      await fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextStatus = async (id: string, status: string) => {
    const nextStatus = NEXT_STATUS[status as keyof typeof NEXT_STATUS];
    if (!nextStatus) return;
    try {
      await updateTaskStatus(id, nextStatus, actor);
      await fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowLogs = async (taskId: string) => {
    if (openLogIds[taskId]) {
      setOpenLogIds((prev) => ({ ...prev, [taskId]: false }));
      return;
    }
    try {
      const response = await getAuditLogs(taskId);
      setLogs((prev) => ({ ...prev, [taskId]: response.data }));
      setLogError((prev) => ({ ...prev, [taskId]: "" }));
      setOpenLogIds((prev) => ({ ...prev, [taskId]: true }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load audit logs";
      setLogError((prev) => ({ ...prev, [taskId]: message }));
      setOpenLogIds((prev) => ({ ...prev, [taskId]: true }));
    }
  };

  const renderAuditLogs = (taskId: string) => {
    if (!openLogIds[taskId]) return null;
    return (
      <div
        style={{
          marginTop: 16,
          padding: 12,
          border: "1px solid gray",
          borderRadius: 6,
        }}
      >
        <h4>Audit Logs</h4>
        {logError[taskId] ? (
          <p style={{ color: "red" }}>{logError[taskId]}</p>
        ) : logs[taskId]?.length === 0 ? (
          <p style={{ color: "gray" }}>No status changes recorded yet.</p>
        ) : (
          logs[taskId]?.map((log) => (
            <div key={log.id} style={{ marginBottom: 12 }}>
              <p>
                <strong>{log.actor}</strong>
                {" changed "}
                <strong>{log.fromStatus}</strong>
                {" → "}
                <strong>{log.toStatus}</strong>
              </p>
              <small>{new Date(log.createdAt).toLocaleString()}</small>
              <hr />
            </div>
          ))
        )}
      </div>
    );
  };

  const tabStyle = (tab: "list" | "history") => ({
    padding: "8px 20px",
    cursor: "pointer",
    background: "none",
    border: "none",
    borderBottom: activeTab === tab ? "2px solid white" : "2px solid transparent",
    color: activeTab === tab ? "white" : "gray",
    fontSize: 16,
    fontWeight: activeTab === tab ? "bold" as const : "normal" as const,
  });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>Test Task Manager</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, borderBottom: "1px solid #444" }}>
        <button style={tabStyle("list")} onClick={() => setActiveTab("list")}>
          Task List
        </button>
        <button style={tabStyle("history")} onClick={() => setActiveTab("history")}>
          History {deletedTasks.length > 0 && `(${deletedTasks.length})`}
        </button>
      </div>

      {activeTab === "list" && (
        <>
          <div style={{ marginBottom: 20 }}>
            <label>Current Actor</label>
            <br />
            <select value={actor} onChange={(e) => setActor(e.target.value)}>
              {ACTORS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 30 }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              onKeyDown={(e) => { if (e.key === "Enter") void handleCreateTask(); }}
            />
            <button onClick={handleCreateTask} style={{ marginLeft: 10 }}>
              Create Task
            </button>
          </div>

          {tasks.length === 0 && <p>No tasks available</p>}

          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <h3>{task.title}</h3>
              <p>Status: <strong>{task.status}</strong></p>
              <p>Created: {new Date(task.createdAt).toLocaleString()}</p>

              {task.status !== "done" && (
                <button onClick={() => handleNextStatus(task.id, task.status)}>
                  Next Status
                </button>
              )}

              <button
                onClick={() => handleDeleteTask(task.id)}
                style={{ marginLeft: 10 }}
              >
                Delete
              </button>

              <button
                onClick={() => handleShowLogs(task.id)}
                style={{ marginLeft: 10 }}
              >
                {openLogIds[task.id] ? "Hide Audit Logs" : "Show Audit Logs"}
              </button>

              {renderAuditLogs(task.id)}
            </div>
          ))}
        </>
      )}

      {activeTab === "history" && (
        <>
          {deletedTasks.length === 0 ? (
            <p style={{ color: "gray" }}>No deleted tasks yet.</p>
          ) : (
            deletedTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  border: "1px solid #555",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                  opacity: 0.8,
                }}
              >
                <h3 style={{ textDecoration: "line-through" }}>{task.title}</h3>
                <p>Final status: <strong>{task.status}</strong></p>
                <p>
                  Deleted:{" "}
                  {task.deletedAt
                    ? new Date(task.deletedAt).toLocaleString()
                    : "-"}
                </p>

                <button onClick={() => handleShowLogs(task.id)}>
                  {openLogIds[task.id] ? "Hide Audit Logs" : "Show Audit Logs"}
                </button>

                {renderAuditLogs(task.id)}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default App;
