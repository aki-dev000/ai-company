const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://ai-company-production-4024.up.railway.app";

/* ---------- Types ---------- */
export interface Session {
  session_id: string;
  directive: string;
  status: "running" | "completed" | "error";
  created_at: string;
}

export interface Agent {
  id: string;
  display_name: string;
  department: string;
  tier: number;
  reports_to: string | null;
  system_prompt: string;
  output_document: string;
  avatar_color: string;
}

export interface SSEEvent {
  type: string;
  [key: string]: unknown;
}

export interface PlanStep {
  step_id: string;
  label: string;
  agents: string[];
  depends_on: string[];
  parallel: boolean;
}

export interface Schedule {
  id: string;
  label: string;
  directive: string;
  cron: string;
  enabled: boolean;
  last_run?: string;
  next_run?: string;
  auto_mode?: boolean;
}

/* ---------- API calls ---------- */
export async function submitDirective(directive: string, autoMode = false) {
  const res = await fetch(`${BASE_URL}/api/directives`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ directive, auto_mode: autoMode }),
  });
  return res.json();
}

export async function listDirectives(): Promise<Session[]> {
  const res = await fetch(`${BASE_URL}/api/directives`);
  return res.json();
}

export async function getOrgChart(): Promise<Agent[]> {
  const res = await fetch(`${BASE_URL}/api/org-chart`);
  return res.json();
}

export async function listDocuments(sessionId: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/api/documents/${sessionId}`);
  return res.json();
}

export async function getDocument(sessionId: string, filename: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/documents/${sessionId}/${filename}`);
  return res.text();
}

export async function listSchedules(): Promise<Schedule[]> {
  const res = await fetch(`${BASE_URL}/api/schedules`);
  return res.json();
}

export async function createSchedule(data: { label: string; directive: string; cron: string; auto_mode?: boolean }) {
  const res = await fetch(`${BASE_URL}/api/schedules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteSchedule(id: string) {
  await fetch(`${BASE_URL}/api/schedules/${id}`, { method: "DELETE" });
}

export async function toggleSchedule(id: string) {
  const res = await fetch(`${BASE_URL}/api/schedules/${id}/toggle`, { method: "POST" });
  return res.json();
}

export async function runNow(id: string) {
  const res = await fetch(`${BASE_URL}/api/schedules/${id}/run`, { method: "POST" });
  return res.json();
}

export function streamUrl(sessionId: string): string {
  return `${BASE_URL}/api/stream/${sessionId}`;
}
