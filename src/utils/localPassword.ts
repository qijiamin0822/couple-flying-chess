const LOCAL_PASSWORD_KEY = 'couples-ludo-local-password-hash';

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

export function hasLocalPassword(): boolean {
  return Boolean(localStorage.getItem(LOCAL_PASSWORD_KEY));
}

export async function verifyLocalPassword(password: string): Promise<boolean> {
  const savedHash = localStorage.getItem(LOCAL_PASSWORD_KEY);
  if (!savedHash) return false;

  return savedHash === await hashPassword(password);
}

export async function saveLocalPassword(password: string): Promise<void> {
  localStorage.setItem(LOCAL_PASSWORD_KEY, await hashPassword(password));
}

export function removeLocalPassword(): void {
  localStorage.removeItem(LOCAL_PASSWORD_KEY);
}
