const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function submitDirective(
  directive: string,
  autoMode = false,
): Promise<{ session_id: string }> {
  const res = await fetch(`${API_BASE}/api/directives`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ directive, auto_mode: autoMode }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Dispatch API ──────────────────────────────────────────────

export interface Schedule {
  id: string;
  directive: string;
  cron: string;
  label: string;
  auto_mode: boolean;
  active: boolean;
  created_at: string;
  last_run: string | null;
}

export async function listSchedules(): Promise<Schedule[]> {
  const res = await fetch(`${API_BASE}/api/dispatch`);
  if (!res.ok) return [];
  return res.json();
}

export async function createSchedule(
  directive: string,
  cron: string,
  label: string,
  autoMode: boolean,
): Promise<Schedule> {
  const res = await fetch(`${API_BASE}/api/dispatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ directive, cron, label, auto_mode: autoMode }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteSchedule(id: string): Promise<void> {
  await fetch(`${API_BASE}/api/dispatch/${id}`, { method: "DELETE" });
}

export async function toggleSchedule(id: string): Promise<Schedule> {
  const res = await fetch(`${API_BASE}/api/dispatch/${id}/toggle`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function runNow(directive: string, autoMode = true): Promise<{ session_id: string }> {
  const res = await fetch(`${API_BASE}/api/dispatch/run-now`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ directive, auto_mode: autoMode }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listDirectives(): Promise<Session[]> {
  const res = await fetch(`${API_BASE}/api/directives`);
  if (!res.ok) return [];
  return res.json();
}

export async function getOrgChart(): Promise<Agent[]> {
  const res = await fetch(`${API_BASE}/api/org-chart`);
  if (!res.ok) return [];
  return res.json();
}

export async function listDocuments(sessionId: string): Promise<{ filename: string; size: number }[]> {
  const res = await fetch(`${API_BASE}/api/documents/${sessionId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getDocument(sessionId: string, filename: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/documents/${sessionId}/${filename}`);
  if (!res.ok) throw new Error("Document not found");
  return res.text();
}

export const streamUrl = (sessionId: string) => `${API_BASE}/api/stream/${sessionId}`;

export interface Session {
  session_id: string;
  directive: string;
  status: "running" | "completed" | "error";
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  display_name: string;
  department: string;
  tier: number;
  reports_to: string;
  direct_reports: string[];
  responsibilities: string[];
  avatar_color: string;
}

export interface SSEEvent {
  event: string;
  agent_id?: string;
  agent_name?: string;
  department?: string;
  avatar_color?: string;
  token?: string;
  document?: string;
  step_id?: string;
  label?: string;
  agents?: string[];
  steps?: PlanStep[];
  documents?: string[];
  message?: string;
  directive?: string;
  session_id?: string;
  ts?: string;
  // tool use (web_enabled agents)
  web_enabled?: boolean;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  preview?: string;
  // notifications
  notion_url?: string;
  gmail_sent?: boolean;
  results?: Record<string, string>;
  // computer use / browser
  screenshot_b64?: string;
  auto_mode?: boolean;
}

export interface PlanStep {
  step_id: string;
  label: string;
  agents: string[];
  depends_on: string[];
  parallel: boolean;
}
