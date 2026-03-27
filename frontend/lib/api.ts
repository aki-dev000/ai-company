const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function submitDirective(directive: string): Promise<{ session_id: string }> {
  const res = await fetch(`${API_BASE}/api/directives`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ directive }),
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
}

export interface PlanStep {
  step_id: string;
  label: string;
  agents: string[];
  depends_on: string[];
  parallel: boolean;
}
