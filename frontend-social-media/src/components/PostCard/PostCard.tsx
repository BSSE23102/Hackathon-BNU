"use client";

import {
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Clock,
  Loader2,
} from "lucide-react";
import { Post } from "@/types";
import { analyzeContent } from "@/lib/api";
import s from "./PostCard.module.css";

interface Props {
  post: Post;
  onUpdate: (updated: Post) => void;
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function decisionIcon(decision: string) {
  switch (decision) {
    case "allow":    return <ShieldCheck size={14} />;
    case "flag":     return <ShieldAlert size={14} />;
    case "escalate": return <ShieldQuestion size={14} />;
    case "delay":    return <Clock size={14} />;
    default:         return <Shield size={14} />;
  }
}

export default function PostCard({ post, onUpdate }: Props) {
  const handleAnalyze = async () => {
    onUpdate({ ...post, moderating: true });

    try {
      const res = await analyzeContent(post.content, post.content_type, post.source);
      if (res.success && res.data) {
        onUpdate({ ...post, moderation: res.data, moderating: false });
      } else {
        // On error, still stop loading — show error inline
        onUpdate({
          ...post,
          moderating: false,
          moderation: {
            risk_score: -1,
            decision: "delay",
            explanation: res.error?.message ?? "Analysis failed — is the backend running?",
            confidence_level: "low",
            signals_used: [],
          },
        });
      }
    } catch {
      onUpdate({
        ...post,
        moderating: false,
        moderation: {
          risk_score: -1,
          decision: "delay",
          explanation: "Network error — ensure ContentShield backend is running on :8000",
          confidence_level: "low",
          signals_used: [],
        },
      });
    }
  };

  const mod = post.moderation;
  const isError = mod && mod.risk_score === -1;

  return (
    <article className={s.post}>
      <div className={s.avatar}>{post.user.avatar}</div>

      <div className={s.body}>
        {/* Header */}
        <div className={s.header}>
          <span className={s.name}>{post.user.name}</span>
          <span className={s.handle}>{post.user.handle}</span>
          <span className={s.dot}>·</span>
          <span className={s.time}>{timeAgo(post.timestamp)}</span>
          {post.content_type !== "post" && (
            <span className={s.typeBadge}>{post.content_type}</span>
          )}
        </div>

        {/* Content */}
        <div className={s.content}>{post.content}</div>

        {/* Social actions */}
        <div className={s.actions}>
          <button className={s.actionBtn}>
            <span className={s.actionIcon}><MessageCircle size={16} /></span>
            {post.replies || ""}
          </button>
          <button className={s.actionBtn}>
            <span className={s.actionIcon}><Repeat2 size={16} /></span>
            {post.reposts || ""}
          </button>
          <button className={s.actionBtn}>
            <span className={s.actionIcon}><Heart size={16} /></span>
            {post.likes || ""}
          </button>
          <button className={s.actionBtn}>
            <span className={s.actionIcon}><Share size={16} /></span>
          </button>
        </div>

        {/* Moderation section */}
        <div className={s.moderationSection}>
          {/* Analyze button — only show if not yet moderated */}
          {!mod && !post.moderating && (
            <button className={s.analyzeBtn} onClick={handleAnalyze}>
              <Shield size={14} />
              Analyze with ContentShield
            </button>
          )}

          {/* Loading state */}
          {post.moderating && (
            <div className={s.analyzing}>
              <div className={s.spinner} />
              Analyzing content…
            </div>
          )}

          {/* Error result */}
          {isError && mod && (
            <div className={s.modError}>{mod.explanation}</div>
          )}

          {/* Moderation result */}
          {mod && !isError && (
            <div className={s.modResult}>
              <div className={s.modHeader}>
                <span className={`${s.modDecision} ${s[mod.decision]}`}>
                  {decisionIcon(mod.decision)}
                  {mod.decision}
                </span>

                <div className={s.modMeta}>
                  <span className={s.modScore}>
                    Risk: {(mod.risk_score * 100).toFixed(1)}%
                  </span>
                  <span className={s.modConfidence}>{mod.confidence_level}</span>
                </div>
              </div>

              <div className={s.modExplanation}>{mod.explanation}</div>

              {mod.signals_used.length > 0 && (
                <div className={s.modSignals}>
                  {mod.signals_used.map((sig) => (
                    <span key={sig} className={s.signalChip}>{sig}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
