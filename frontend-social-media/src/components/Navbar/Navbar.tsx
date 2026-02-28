"use client";

import { Home, Search, Bell, Shield, Settings, MessageSquare } from "lucide-react";
import s from "./Navbar.module.css";

const NAV_ITEMS = [
  { icon: Home, label: "Home", active: true },
  { icon: Search, label: "Explore", active: false },
  { icon: Bell, label: "Notifications", active: false },
  { icon: MessageSquare, label: "Messages", active: false },
  { icon: Shield, label: "Moderation", active: false },
  { icon: Settings, label: "Settings", active: false },
];

export default function Navbar() {
  return (
    <nav className={s.nav}>
      {/* Brand */}
      <div className={s.brand}>
        <Shield size={28} className={s.logoIcon} />
        <span className={s.brandName}>Chirp</span>
      </div>

      {/* Nav links */}
      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          className={`${s.navItem} ${item.active ? s.active : ""}`}
        >
          <span className={s.navItemIcon}>
            <item.icon size={22} />
          </span>
          <span className={s.navLabel}>{item.label}</span>
        </div>
      ))}

      <div className={s.spacer} />

      {/* Current user */}
      <div className={s.userPill}>
        <div className={s.avatar}>👤</div>
        <div className={s.userInfo}>
          <span className={s.userName}>You</span>
          <span className={s.userHandle}>@tester</span>
        </div>
      </div>
    </nav>
  );
}
