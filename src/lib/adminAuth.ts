const SESSION_KEY = 'admin-session';

export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export function logoutAdmin() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEY);
}
