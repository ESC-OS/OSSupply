import { getMe, postLogout, getNotifications } from './api.js';
import { renderNavbar } from './ui.js';

function redirectToLogin() {
  const error = new URLSearchParams(window.location.search).get('error');
  window.location.href = error ? `/OSSupply/login/?error=${encodeURIComponent(error)}` : '/OSSupply/login/';
}

export async function requireAuth(roles = null) {
  let user;
  try {
    const res = await getMe();
    user = res.user;
  } catch {
    redirectToLogin();
    return null;
  }
  if (!user) {
    redirectToLogin();
    return null;
  }
  if (roles && !roles.includes(user.role)) {
    window.location.href = '/OSSupply/dashboard/';
    return null;
  }

  // First-login: prompt profile completion (skip when already on /OSSupply/profile/)
  if (user.nickname === null && !window.location.pathname.startsWith('/OSSupply/profile/')) {
    window.location.href = '/OSSupply/profile/?first=1';
    return null;
  }

  let unread = 0;
  try {
    const data = await getNotifications(1, 1);
    unread = data.unreadCount ?? data.pagination?.unread ?? 0;
  } catch {}

  // Clear any OAuth error hint so it doesn't linger after a successful login
  localStorage.removeItem('oauth_pending');

  renderNavbar(user, unread);

  document.getElementById('nav-logout-btn')?.addEventListener('click', async () => {
    await postLogout().catch(() => {});
    window.location.href = '/OSSupply/login/';
  });

  return user;
}
