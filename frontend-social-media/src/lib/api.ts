import { AnalyzeResponse } from "@/types";

const API_BASE = "/api";

export async function analyzeContent(
  content_text: string,
  content_type: string = "post",
  source: string = "web"
): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/analyze-content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content_text, content_type, source }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    return {
      success: false,
      error: {
        code: "HTTP_ERROR",
        message: err?.error?.message ?? `Request failed (${res.status})`,
      },
    };
  }

  return res.json();
}

export async function healthCheck(): Promise<{ status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
