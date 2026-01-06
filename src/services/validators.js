// src/services/validators.js

export const ALLOWED_DOMAIN = "@e.braude.ac.il";

/* =========================
   Email helpers
   ========================= */
export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function assertAllowedDomain(email) {
  if (!email.endsWith(ALLOWED_DOMAIN)) {
    throw new Error(`Email must end with ${ALLOWED_DOMAIN}`);
  }
}

/* =========================
   Password helpers
   ========================= */
export function assertStrongPassword(password) {
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }
}

export function assertPasswordsMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }
}

/* =========================
   Team helpers
   ========================= */
export function assertValidTeamNumber(teamNumber) {
  const tn = String(teamNumber || "").trim();
  if (!tn) throw new Error("Team number is required.");
  if (!/^\d+$/.test(tn)) {
    throw new Error("Team number must contain digits only.");
  }
  return tn;
}
