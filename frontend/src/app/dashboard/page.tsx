"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { getUser, logout, User } from "@/lib/auth";
import Link from "next/link";

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  estimated_time: number;
  actual_time: number;
  owner_id: number;
  owner: User;
};

type Insight = {
  summary: string;
  overloaded_employees: {
    employee: string;
    total_actual_time: number;
    risk: string;
  }[];
  risky_tasks: {
    task: string;
    employee: string;
    estimated_time: number;
    actual_time: number;
    risk: string;
  }[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [insights, setInsights] = useState<Insight | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const [employeeFilter, setEmployeeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [error, setError] = useState("");
  const [insightsLoading, setInsightsLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  async function loadDashboard(currentUser: User) {
    try {
      setLoading(true);

      const query = new URLSearchParams();

      if (currentUser.role === "ceo") {
        if (employeeFilter) query.set("employee_id", employeeFilter);
        if (statusFilter) query.set("status", statusFilter);
      }

      const tasksData = await apiRequest<Task[]>(
        `/tasks${query.toString() ? `?${query.toString()}` : ""}`,
      );

      setTasks(tasksData);

      if (currentUser.role === "ceo") {
        const usersData = await apiRequest<User[]>("/users");
        const insightsData = await apiRequest<Insight>("/insights");

        setUsers(usersData);
        setInsights(insightsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedUser = getUser();

    if (!savedUser) {
      router.push("/login");
      return;
    }

    setUser(savedUser);
    loadDashboard(savedUser);
  }, []);

  async function handleCreateTask(event: FormEvent) {
    event.preventDefault();

    if (!user) return;

    try {
      setError("");

      await apiRequest<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          estimated_time: Number(estimatedTime),
        }),
      });

      setTitle("");
      setDescription("");
      setEstimatedTime("");

      await loadDashboard(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
  }

  async function updateTask(taskId: number, payload: Partial<Task>) {
    if (!user) return;

    try {
      setError("");

      await apiRequest<Task>(`/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      await loadDashboard(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!user) {
    return null;
  }

  return (
    <main className="dashboard">
      <div className="container">
        <div className="dashboardTop">
          <div className="dashboardTitle">
            <h1>VibeDoing Dashboard</h1>
            <p>
              Logged in as <strong>{user.username}</strong> / {user.role}
            </p>
          </div>

          <div className="controls">
            <Link href="/" className="secondaryButton">
              Landing
            </Link>

            <button className="secondaryButton" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {error && <div className="errorBox">{error}</div>}

        {loading ? (
          <div className="panel">Loading dashboard...</div>
        ) : (
          <div className="grid dashboardGrid">
            {user.role === "worker" && (
              <section className="panel">
                <h2>Create task</h2>

                <form className="taskForm" onSubmit={handleCreateTask}>
                  <input
                    className="input"
                    placeholder="Task title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                  />

                  <textarea
                    className="input"
                    placeholder="Task description"
                    rows={4}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />

                  <input
                    className="input"
                    placeholder="Estimated time, hours"
                    type="number"
                    min="0"
                    step="0.5"
                    value={estimatedTime}
                    onChange={(event) => setEstimatedTime(event.target.value)}
                    required
                  />

                  <button className="primaryButton">Create task</button>
                </form>
              </section>
            )}

            {user.role === "ceo" && (
              <section className="panel">
                <h2>CEO filters</h2>

                <div className="filters">
                  <select
                    className="input"
                    value={employeeFilter}
                    onChange={(event) => setEmployeeFilter(event.target.value)}
                  >
                    <option value="">All employees</option>
                    {users.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.username}
                      </option>
                    ))}
                  </select>

                  <select
                    className="input"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="">All statuses</option>
                    <option value="todo">Todo</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                    <option value="blocked">Blocked</option>
                  </select>

                  <button
                    className="primaryButton"
                    onClick={() => loadDashboard(user)}
                  >
                    Apply filters
                  </button>
                </div>
              </section>
            )}

            <section className="panel">
              <h2>{user.role === "ceo" ? "All company tasks" : "My tasks"}</h2>

              {tasks.length === 0 ? (
                <p className="muted">No tasks yet.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="taskItem">
                    <div className="taskHeader">
                      <h3>{task.title}</h3>
                      <span className={`status status-${task.status}`}>
                        {task.status}
                      </span>
                    </div>

                    <p>{task.description || "No description"}</p>

                    <div className="taskMeta">
                      <span className="tag">Owner: {task.owner.username}</span>
                      <span className="tag">
                        Estimated: {task.estimated_time}h
                      </span>
                      <span className="tag">Actual: {task.actual_time}h</span>
                    </div>

                    <div className="taskControls">
                      <select
                        className="input"
                        value={task.status}
                        onChange={(event) =>
                          updateTask(task.id, { status: event.target.value })
                        }
                      >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                        <option value="blocked">Blocked</option>
                      </select>

                      <input
                        className="input"
                        type="number"
                        min="0"
                        step="0.5"
                        defaultValue={task.actual_time}
                        onBlur={(event) =>
                          updateTask(task.id, {
                            actual_time: Number(event.target.value),
                          })
                        }
                      />
                    </div>

                    {task.actual_time > task.estimated_time && (
                      <div className="risk">
                        Risk: actual time exceeds estimated time
                      </div>
                    )}
                  </div>
                ))
              )}
            </section>

            {user.role === "ceo" && insights && (
              <section className="panel fullWidth">
                <h2>AI insights</h2>
                <p className="muted">{insights.summary}</p>

                <div className="insightGrid">
                  <div>
                    <h3>Overloaded employees</h3>

                    {insights.overloaded_employees.length === 0 ? (
                      <p className="muted">No overload detected.</p>
                    ) : (
                      insights.overloaded_employees.map((item) => (
                        <div key={item.employee} className="insightItem">
                          <strong>{item.employee}</strong>
                          <span>{item.total_actual_time}h logged</span>
                          <small>{item.risk}</small>
                        </div>
                      ))
                    )}
                  </div>

                  <div>
                    <h3>Risky tasks</h3>

                    {insights.risky_tasks.length === 0 ? (
                      <p className="muted">No risky tasks detected.</p>
                    ) : (
                      insights.risky_tasks.map((item) => (
                        <div
                          key={`${item.employee}-${item.task}`}
                          className="insightItem"
                        >
                          <strong>{item.task}</strong>
                          <span>{item.employee}</span>
                          <small>
                            {item.actual_time}h actual / {item.estimated_time}h
                            estimated
                          </small>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
