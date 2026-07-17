"use client";

import { useState } from "react";
import type { RouteLocale } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n";

export function ContactForm({ locale }: { locale: RouteLocale }) {
  const t = getTranslator(locale);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, name, email, message }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="sand-card" style={{ padding: "1.5rem" }}>
        <p style={{ fontWeight: 600, color: "var(--color-sand-navy)" }}>✓ {t("antrag.confirmation.title")}</p>
        <p style={{ marginTop: "0.5rem", color: "var(--color-sand-muted)" }}>{t("antrag.confirmation.nextText")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="sand-card" style={{ padding: "1.5rem", display: "grid", gap: "1rem", maxWidth: "560px" }} noValidate>
      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t("kontakt.nameLabel")}</span>
        <input className="sand-field" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t("kontakt.emailLabel")}</span>
        <input className="sand-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label style={{ display: "grid", gap: "0.35rem" }}>
        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t("kontakt.messageLabel")}</span>
        <textarea className="sand-field" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />
      </label>
      {status === "error" && <p style={{ color: "#b91c1c", fontSize: "0.85rem" }}>{t("antrag.submitError")}</p>}
      <button type="submit" className="sand-btn sand-btn-primary" disabled={status === "sending"}>
        {t("kontakt.send")}
      </button>
    </form>
  );
}
