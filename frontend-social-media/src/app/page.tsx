"use client";

import { useState, useCallback } from "react";
import { Shield, Zap, RotateCcw } from "lucide-react";
import { Post } from "@/types";
import { SEED_POSTS } from "@/data/seed";
import { analyzeContent } from "@/lib/api";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import PostComposer from "@/components/PostComposer/PostComposer";
import PostCard from "@/components/PostCard/PostCard";
import s from "./page.module.css";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [analyzingAll, setAnalyzingAll] = useState(false);

  /* ── Update a single post by id ─────────────────────────────── */
  const updatePost = useCallback((updated: Post) => {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }, []);

  /* ── Create a new post ──────────────────────────────────────── */
  const handleNewPost = useCallback(
    (text: string, contentType: "post" | "comment" | "message") => {
      const newPost: Post = {
        id: `user-${Date.now()}`,
        user: { id: "me", name: "You", handle: "@tester", avatar: "👤" },
        content: text,
        content_type: contentType,
        source: "web",
        timestamp: Date.now(),
        likes: 0,
        reposts: 0,
        replies: 0,
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    []
  );

  /* ── Analyze ALL un-moderated posts ─────────────────────────── */
  const handleAnalyzeAll = useCallback(async () => {
    setAnalyzingAll(true);

    // Mark all un-moderated posts as loading
    setPosts((prev) =>
      prev.map((p) =>
        !p.moderation ? { ...p, moderating: true } : p
      )
    );

    // Analyze each sequentially to be kind to the backend
    const current = posts.filter((p) => !p.moderation);
    for (const post of current) {
      try {
        const res = await analyzeContent(post.content, post.content_type, post.source);
        if (res.success && res.data) {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === post.id ? { ...p, moderation: res.data!, moderating: false } : p
            )
          );
        } else {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === post.id
                ? {
                    ...p,
                    moderating: false,
                    moderation: {
                      risk_score: -1,
                      decision: "delay",
                      explanation: res.error?.message ?? "Analysis failed",
                      confidence_level: "low",
                      signals_used: [],
                    },
                  }
                : p
            )
          );
        }
      } catch {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  moderating: false,
                  moderation: {
                    risk_score: -1,
                    decision: "delay",
                    explanation: "Network error — backend unreachable",
                    confidence_level: "low",
                    signals_used: [],
                  },
                }
              : p
          )
        );
      }
    }

    setAnalyzingAll(false);
  }, [posts]);

  /* ── Reset all moderation results ───────────────────────────── */
  const handleReset = useCallback(() => {
    setPosts((prev) =>
      prev.map((p) => ({ ...p, moderation: undefined, moderating: false }))
    );
  }, []);

  const unmoderatedCount = posts.filter((p) => !p.moderation && !p.moderating).length;

  return (
    <div className={s.shell}>
      {/* Left Sidebar — Nav */}
      <aside className={s.sidebar}>
        <Navbar />
      </aside>

      {/* Center Feed */}
      <main className={s.main}>
        <div className={s.mainHeader}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h1>Home</h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {unmoderatedCount > 0 && (
                <button
                  className={s.analyzeAllBtn}
                  onClick={handleAnalyzeAll}
                  disabled={analyzingAll}
                >
                  <Zap size={14} />
                  Analyze All ({unmoderatedCount})
                </button>
              )}
              <button className={s.resetBtn} onClick={handleReset} title="Reset all moderation">
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>

        <PostComposer onPost={handleNewPost} disabled={analyzingAll} />

        {/* Feed */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} onUpdate={updatePost} />
        ))}

        {/* End of feed */}
        <div className={s.endOfFeed}>
          <Shield size={20} />
          <span>You&apos;re all caught up — {posts.length} posts loaded</span>
        </div>
      </main>

      {/* Right Sidebar — Stats & Trending */}
      <aside className={s.rightPanel}>
        <Sidebar posts={posts} />
      </aside>
    </div>
  );
}
