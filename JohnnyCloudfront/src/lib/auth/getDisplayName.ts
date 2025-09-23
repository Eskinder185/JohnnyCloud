
/**
 * Extract display name from Cognito ID token claims
 * @param idToken - The Cognito ID token
 * @returns The display name with fallback logic
 */
export function getDisplayName(claims: any): string {
  const fullName = [claims?.given_name, claims?.family_name].filter(Boolean).join(" ").trim();
  const raw = (claims?.["custom:Display_Name"] ?? claims?.preferred_username ?? (fullName || undefined) ?? claims?.email) || "User";
  return String(raw).trim() || "User";
}
