"use client";

export function TotpInput() {
  return (
    <label style={{ display: "grid", gap: "0.35rem" }}>
      <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Authenticator-Code</span>
      <input
        className="sand-field"
        name="token"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9 ]*"
        maxLength={7}
        required
        autoFocus
        placeholder="123456"
        style={{ letterSpacing: "0.3em", fontSize: "1.2rem", textAlign: "center" }}
      />
    </label>
  );
}
