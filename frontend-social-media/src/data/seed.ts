import { Post, User } from "@/types";

/* ── Fake Users ──────────────────────────────────────────────────── */

const users: User[] = [
  { id: "u1", name: "Alice Chen",      handle: "@alicechen",     avatar: "👩‍💻" },
  { id: "u2", name: "Marcus Rivera",   handle: "@marcusdev",     avatar: "👨‍🎨" },
  { id: "u3", name: "Priya Sharma",    handle: "@priyaaa",       avatar: "🧕" },
  { id: "u4", name: "Jordan Blake",    handle: "@jblake",        avatar: "🧑‍🚀" },
  { id: "u5", name: "Lily Nguyen",     handle: "@lilynguyen",    avatar: "👩‍🔬" },
  { id: "u6", name: "Spam Bot 3000",   handle: "@totallylegit",  avatar: "🤖" },
  { id: "u7", name: "Quick Cash Mike", handle: "@mikecash99",    avatar: "💰" },
  { id: "u8", name: "Emily Torres",    handle: "@emtorres",      avatar: "🎵" },
];

/* ── Seed Posts ───────────────────────────────────────────────────
   Mix of safe posts and risky posts (matching RISKY_PATTERNS from
   the backend: "free money", "click here", "act now", "limited offer",
   "buy followers") so we can demo the full moderation spectrum.
   ──────────────────────────────────────────────────────────────── */

let _id = 0;
const id = () => `seed-${++_id}`;
const ago = (min: number) => Date.now() - min * 60_000;

export const SEED_POSTS: Post[] = [
  // ── Safe posts ─────────────────────────────────────────────────
  {
    id: id(), user: users[0], content_type: "post", source: "web",
    content: "Just finished a 3-hour deep-work session on our new recommendation engine. The embedding approach is working way better than TF-IDF. Sharing the writeup soon 📝",
    timestamp: ago(2), likes: 42, reposts: 8, replies: 5,
  },
  {
    id: id(), user: users[1], content_type: "post", source: "mobile",
    content: "Golden hour photography tip: shoot with your subject facing away from the sun for soft, even lighting on their face. Works every time 🌅",
    timestamp: ago(15), likes: 128, reposts: 34, replies: 12,
  },
  {
    id: id(), user: users[2], content_type: "post", source: "web",
    content: "Reading 'Designing Data-Intensive Applications' for the third time and still finding new things I missed. If you're in backend engineering, this book is essential.",
    timestamp: ago(45), likes: 87, reposts: 21, replies: 9,
  },
  {
    id: id(), user: users[4], content_type: "post", source: "web",
    content: "Our lab just published new findings on CRISPR gene editing efficiency in plant cells. 94% success rate on the latest trial. Full paper linked in my bio!",
    timestamp: ago(60), likes: 256, reposts: 67, replies: 23,
  },
  {
    id: id(), user: users[3], content_type: "post", source: "mobile",
    content: "The ISS just passed over my city and I caught it on camera. That tiny dot is home to 7 people right now 🚀✨",
    timestamp: ago(90), likes: 342, reposts: 89, replies: 31,
  },
  {
    id: id(), user: users[7], content_type: "post", source: "mobile",
    content: "New song just dropped on all platforms! Been working on this one for 6 months. Would love to hear what you all think 🎶",
    timestamp: ago(120), likes: 195, reposts: 44, replies: 18,
  },

  // ── Risky / spammy posts ──────────────────────────────────────
  {
    id: id(), user: users[5], content_type: "post", source: "api",
    content: "🚨 Click here for FREE MONEY! Limited offer — act now before it's gone! No strings attached! 💰💰💰",
    timestamp: ago(5), likes: 2, reposts: 0, replies: 0,
  },
  {
    id: id(), user: users[6], content_type: "comment", source: "web",
    content: "Want 10K followers overnight? Buy followers from us — cheapest rates guaranteed! DM me now! Act now for 50% off!!",
    timestamp: ago(8), likes: 0, reposts: 0, replies: 1,
  },
  {
    id: id(), user: users[5], content_type: "post", source: "api",
    content: "Limited offer!! Double your crypto in 24 hours. Click here to start. Free money for early birds only.",
    timestamp: ago(12), likes: 1, reposts: 0, replies: 0,
  },
  {
    id: id(), user: users[6], content_type: "comment", source: "web",
    content: "Hey",
    timestamp: ago(3), likes: 0, reposts: 0, replies: 0,
  },
];
