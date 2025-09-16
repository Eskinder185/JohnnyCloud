export const SUPPORT_EMAIL = (import.meta.env.VITE_SUPPORT_EMAIL || "").trim();
export const SLACK_JOIN_URL = (import.meta.env.VITE_SLACK_JOIN_URL || "").trim();
export const SLACK_CONTACTS =
  (import.meta.env.VITE_SLACK_CONTACTS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

export function mailtoSupport(subject="JohnnyCloud Support", body="Hi team,"){
  return `mailto:${encodeURIComponent(SUPPORT_EMAIL)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function mailtoSlackContacts(subject="Slack access request", body="Please add me to Slack."){
  const to = SLACK_CONTACTS.join(",");
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

