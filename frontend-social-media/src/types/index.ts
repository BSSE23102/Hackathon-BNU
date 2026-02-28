/* ── Post & Moderation Types ─────────────────────────────────────── */

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string; // emoji avatar
}

export interface ModerationResult {
  risk_score: number;
  decision: "allow" | "flag" | "escalate" | "delay";
  explanation: string;
  confidence_level: "low" | "medium" | "high";
  signals_used: string[];
}

export interface Post {
  id: string;
  user: User;
  content: string;
  content_type: "post" | "comment" | "message";
  source: "web" | "mobile" | "api";
  timestamp: number;
  likes: number;
  reposts: number;
  replies: number;
  moderation?: ModerationResult;
  moderating?: boolean;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: ModerationResult;
  error?: {
    code: string;
    message: string;
  };
}
