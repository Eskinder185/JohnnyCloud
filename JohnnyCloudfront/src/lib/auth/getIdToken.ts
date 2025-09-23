import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export async function getIdToken(): Promise<string | null> {
  try {
    await getCurrentUser();
    const s = await fetchAuthSession();
    return s.tokens?.idToken?.toString() ?? null;
  } catch {
    return null;
  }
}
