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
  job_type?: string | null;
  job_config?: Record<string, unknown>;
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
  jobType?: string,
  jobConfig?: Record<string, unknown>,
): Promise<Schedule> {
  const res = await fetch(`${API_BASE}/api/dispatch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ directive, cron, label, auto_mode: autoMode, job_type: jobType, job_config: jobConfig }),
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

export async function runNow(
  directive: string,
  autoMode = true,
  jobType?: string,
  jobConfig?: Record<string, unknown>,
): Promise<{ session_id?: string; status: string }> {
  const res = await fetch(`${API_BASE}/api/dispatch/run-now`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ directive, auto_mode: autoMode, job_type: jobType, job_config: jobConfig }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export interface ContentJob {
  id: string;
  label: string;
  channel: string;
  job_type: string;
  active: boolean;
  endpoint: string;
  config: Record<string, unknown>;
}

export interface KPISummary {
  channel: string;
  runs: number;
  generated_count: number;
  published_count: number;
  revenue_amount: number;
  last_status: string | null;
  last_executed_at: string | null;
  target?: Record<string, unknown>;
}

export async function listContentJobs(): Promise<ContentJob[]> {
  const res = await fetch(`${API_BASE}/api/content-jobs`);
  if (!res.ok) return [];
  return res.json();
}

export async function runContentJob(jobId: string): Promise<{ status?: string }> {
  const res = await fetch(`${API_BASE}/api/content-jobs/${jobId}/run`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listKpiSummary(): Promise<KPISummary[]> {
  const res = await fetch(`${API_BASE}/api/content-kpis/summary`);
  if (!res.ok) return [];
  return res.json();
}

export async function getBusinessTargets(): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/api/content-kpis/targets`);
  if (!res.ok) return {};
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

// ── Bio-Digital Reports API ────────────────────────────────────

export interface BioReport {
  filename: string;
  date: string;
  size: number;
  has_markdown: boolean;
}

export async function listBioReports(): Promise<BioReport[]> {
  const res = await fetch(`${API_BASE}/api/bio-reports`);
  if (!res.ok) return [];
  return res.json();
}

export function bioReportPdfUrl(filename: string): string {
  return `${API_BASE}/api/bio-reports/${filename}`;
}

export async function runBioReportNow(): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/api/bio-reports/run-now`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getBioReportMarkdown(filename: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/bio-reports/${filename}/markdown`);
  if (!res.ok) throw new Error("Markdown not found");
  return res.text();
}

// ── E-Book API ────────────────────────────────────────────────

export interface Ebook {
  filename: string;
  date: string;
  size: number;
  has_markdown: boolean;
  has_pdf: boolean;
  has_note: boolean;
  title: string;
}

export interface EbookGenerationRequest {
  theme: string;
  author?: string;
  description?: string;
  subject?: string;
  generate_note?: boolean;
}

export async function listEbooks(): Promise<Ebook[]> {
  const res = await fetch(`${API_BASE}/api/ebooks`);
  if (!res.ok) return [];
  return res.json();
}

export function ebookEpubUrl(filename: string): string {
  return `${API_BASE}/api/ebooks/${filename}`;
}

export function ebookPdfUrl(filename: string): string {
  return `${API_BASE}/api/ebooks/${filename.replace(".epub", ".epub")}/pdf`;
}

export async function generateEbook(
  payload: EbookGenerationRequest,
): Promise<{ status: string; message: string; theme: string }> {
  const res = await fetch(`${API_BASE}/api/ebooks/run-now`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getEbookMarkdown(filename: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/ebooks/${filename.replace(".epub", ".epub")}/markdown`);
  if (!res.ok) throw new Error("Markdown not found");
  return res.text();
}

export async function getEbookNoteMarkdown(filename: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/ebooks/${filename.replace(".epub", ".epub")}/note`);
  if (!res.ok) throw new Error("Note markdown not found");
  return res.text();
}

// ── LINE Sticker API ─────────────────────────────────────────

export interface LineStickerSet {
  id: string;
  title: string;
  theme: string;
  description: string;
  status: string;
  count: number;
  created_at: string;
  review_flags: string[];
  has_preview: boolean;
  has_zip: boolean;
  size: number;
}

export interface LineStickerSetDetail {
  id: string;
  title: string;
  theme: string;
  description: string;
  status: string;
  count: number;
  created_at: string;
  audience?: string;
  style_prompt?: string;
  tone?: string;
  negative_prompt?: string;
  review_flags: string[];
  stickers: Array<{ index: number; text: string; file: string }>;
  zip_file: string;
}

export interface LineStickerGenerationRequest {
  theme: string;
  audience?: string;
  style_prompt?: string;
  tone?: string;
  negative_prompt?: string;
  count?: number;
}

export async function listLineStickerSets(): Promise<LineStickerSet[]> {
  const res = await fetch(`${API_BASE}/api/line-stickers`);
  if (!res.ok) return [];
  return res.json();
}

export async function getLineStickerSet(id: string): Promise<LineStickerSetDetail> {
  const res = await fetch(`${API_BASE}/api/line-stickers/${id}`);
  if (!res.ok) throw new Error("Line sticker set not found");
  return res.json();
}

export async function generateLineStickerSet(
  payload: LineStickerGenerationRequest,
): Promise<{ status: string; message: string; theme: string }> {
  const res = await fetch(`${API_BASE}/api/line-stickers/run-now`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function rerunLineStickerSet(id: string): Promise<{ status: string; message: string }> {
  const res = await fetch(`${API_BASE}/api/line-stickers/${id}/rerun`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function lineStickerPreviewUrl(id: string): string {
  return `${API_BASE}/api/line-stickers/${id}/preview`;
}

export function lineStickerZipUrl(id: string): string {
  return `${API_BASE}/api/line-stickers/${id}/download`;
}

// ── Inquiry API ────────────────────────────────────────────────

export interface InquiryPayload {
  company: string;
  name: string;
  email: string;
  industry: string;
  theme: string;
  detail: string;
  budget?: string;
  timeline?: string;
}

export interface Inquiry extends InquiryPayload {
  id: string;
  status: "pending" | "in_progress" | "completed" | "declined";
  created_at: string;
}

export async function submitInquiry(payload: InquiryPayload): Promise<{ id: string; message: string }> {
  const res = await fetch(`${API_BASE}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listInquiries(): Promise<Inquiry[]> {
  const res = await fetch(`${API_BASE}/api/inquiries`);
  if (!res.ok) return [];
  return res.json();
}

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
