"use client";

import { useEffect, useState } from "react";
import { Search, Server } from "lucide-react";
import { Post } from "@/types";
import { healthCheck } from "@/lib/api";
import s from "./Sidebar.module.css";

const TRENDS = [
  { category: "Technology", topic: "#ContentModeration", posts: "12.4K posts" },
  { category: "AI & Safety", topic: "#TrustAndSafety", posts: "8.1K posts" },
  { category: "Trending", topic: "#ContentShield", posts: "3.2K posts" },
  { category: "DeepTech", topic: "#AdaptiveDecay", posts: "1.7K posts" },
];

interface Props {
  posts: Post[];
}

export default function Sidebar({ posts }: Props) {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        await healthCheck();
        if (!cancelled) setBackendOnline(true);
      } catch {
        if (!cancelled) setBackendOnline(false);
      }
    };
    check();
    const iv = setInterval(check, 10_000);
    return () => { cancelled = true; clearInterval(iv); };
  }, []);

  // Compute moderation stats from posts
  const stats = {
    allow: posts.filter((p) => p.moderation?.decision === "allow").length,
    flag: posts.filter((p) => p.moderation?.decision === "flag").length,
    escalate: posts.filter((p) => p.moderation?.decision === "escalate").length,
    delay: posts.filter((p) => p.moderation?.decision === "delay").length,
    pending: posts.filter((p) => !p.moderation && !p.moderating).length,
  };

  return (
    <div className={s.panel}>
      {/* Search */}
      <div className={s.searchBox}>
        <Search size={18} className={s.searchIcon} />
        <input className={s.searchInput} placeholder="Search Chirp" readOnly />
      </div>

      {/* Backend Status */}
      <div
        className={`${s.backendStatus} ${
          backendOnline === null ? "" : backendOnline ? s.online : s.offline
        }`}
      >
        <Server size={14} />
        <span className={s.statusDot} />
        {backendOnline === null
          ? "Checking backend…"
          : backendOnline
          ? "ContentShield API online"
          : "Backend offline — start uvicorn"}
      </div>

      {/* Moderation Stats */}
      <div className={s.card}>
        <h3 className={s.cardTitle}>Moderation Stats</h3>
        <div className={s.statRow}>
          <span className={s.statLabel}>
            <span className={`${s.statDot} ${s.allow}`} /> Allowed
          </span>
          <span className={s.statCount}>{stats.allow}</span>
        </div>
        <div className={s.statRow}>
          <span className={s.statLabel}>
            <span className={`${s.statDot} ${s.flag}`} /> Flagged
          </span>
          <span className={s.statCount}>{stats.flag}</span>
        </div>
        <div className={s.statRow}>
          <span className={s.statLabel}>
            <span className={`${s.statDot} ${s.escalate}`} /> Escalated
          </span>
          <span className={s.statCount}>{stats.escalate}</span>
        </div>
        <div className={s.statRow}>
          <span className={s.statLabel}>
            <span className={`${s.statDot} ${s.delay}`} /> Delayed
          </span>
          <span className={s.statCount}>{stats.delay}</span>
        </div>
        <div className={s.statRow}>
          <span className={s.statLabel}>
            <span className={`${s.statDot}`} style={{ background: "#ccc" }} /> Pending
          </span>
          <span className={s.statCount}>{stats.pending}</span>
        </div>
      </div>

      {/* Trending */}
      <div className={s.card}>
        <h3 className={s.cardTitle}>Trending</h3>
        {TRENDS.map((t) => (
          <div key={t.topic} className={s.trendItem}>
            <div className={s.trendMeta}>{t.category}</div>
            <div className={s.trendTopic}>{t.topic}</div>
            <div className={s.trendPosts}>{t.posts}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className={s.footer}>
        ContentShield Demo · BNU Hackathon 2026
      </div>
    </div>
  );
}
