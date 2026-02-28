"use client";

import { useState, useRef } from "react";
import { Image, BarChart3, MapPin, Smile } from "lucide-react";
import s from "./PostComposer.module.css";

interface Props {
  onPost: (text: string, contentType: "post" | "comment" | "message") => void;
  disabled?: boolean;
}

const MAX_CHARS = 280;

const CONTENT_TYPES: Array<{ value: "post" | "comment" | "message"; label: string }> = [
  { value: "post", label: "Post" },
  { value: "comment", label: "Comment" },
  { value: "message", label: "Message" },
];

export default function PostComposer({ onPost, disabled }: Props) {
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState<"post" | "comment" | "message">("post");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const charLeft = MAX_CHARS - text.length;
  const canPost = text.trim().length > 0 && charLeft >= 0 && !disabled;

  const handlePost = () => {
    if (!canPost) return;
    onPost(text.trim(), contentType);
    setText("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePost();
    }
  };

  return (
    <div className={s.composer}>
      <div className={s.avatar}>👤</div>
      <div className={s.form}>
        <textarea
          ref={textareaRef}
          className={s.textArea}
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_CHARS + 50}
        />

        <div className={s.bottomBar}>
          <div className={s.options}>
            <button className={s.optionBtn} title="Image"><Image size={18} /></button>
            <button className={s.optionBtn} title="Poll"><BarChart3 size={18} /></button>
            <button className={s.optionBtn} title="Emoji"><Smile size={18} /></button>
            <button className={s.optionBtn} title="Location"><MapPin size={18} /></button>
          </div>

          <div className={s.actions}>
            <div className={s.typeSelector}>
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  className={`${s.typePill} ${contentType === ct.value ? s.active : ""}`}
                  onClick={() => setContentType(ct.value)}
                >
                  {ct.label}
                </button>
              ))}
            </div>

            <span className={`${s.charCount} ${charLeft < 0 ? s.over : ""}`}>
              {charLeft}
            </span>

            <button className={s.postBtn} disabled={!canPost} onClick={handlePost}>
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
