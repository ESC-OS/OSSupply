const BASE = 'https://os-api.esc68-os.workers.dev';

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    ...opts,
    headers: { 'Content-Type': 'application/json', ...opts.headers },
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    let errKey = null;
    try { const d = await res.json(); msg = d.message || d.error || msg; errKey = d.error; } catch {}
    if (res.status === 403 && errKey === 'profile_incomplete') {
      window.location.href = '/OSSupply/profile/?required=true';
      return null;
    }
    throw new Error(msg);
  }
  return res.json();
}

const api = {
  get:    (path)       => req(path),
  post:   (path, body) => req(path, { method: 'POST',  body: body != null ? JSON.stringify(body) : undefined }),
  patch:  (path, body) => req(path, { method: 'PATCH', body: body != null ? JSON.stringify(body) : undefined }),
  delete: (path)       => req(path, { method: 'DELETE' }),
};

export function photoUrl(key) { return `${BASE}/upload/photo/${key}`; }

// Auth
export const getMe     = ()    => api.get('/auth/me');
export const postLogout = ()   => api.post('/auth/logout');
export const loginUrl  = ()    => `${BASE}/auth/google`;

// Items
export const getItems       = (cat)       => api.get(`/items${cat ? '?category=' + encodeURIComponent(cat) : ''}`);
export const getItem        = (id)        => api.get(`/OSSupply/items/${id}`);
export const createItem     = (data)      => api.post('/items', data);
export const updateItem     = (id, data)  => api.patch(`/OSSupply/items/${id}`, data);
export const deleteItem     = (id)        => api.delete(`/OSSupply/items/${id}`);
export const getStockLogs   = (id)        => api.get(`/OSSupply/items/${id}/stock/logs`);
export const addStock       = (id, data)  => api.post(`/OSSupply/items/${id}/stock/add`, data);
export const removeStock    = (id, data)  => api.post(`/OSSupply/items/${id}/stock/remove`, data);
export const sendToRepair   = (id, data)  => api.post(`/OSSupply/items/${id}/stock/repair`, data);
export const restoreRepair  = (id, data)  => api.post(`/OSSupply/items/${id}/stock/restore`, data);

// Projects
export const getProjects    = ()          => api.get('/projects');
export const getProject     = (id)        => api.get(`/OSSupply/projects/${id}`);
export const createProject  = (data)      => api.post('/projects', data);
export const updateProject  = (id, data)  => api.patch(`/OSSupply/projects/${id}`, data);
export const deleteProject  = (id)        => api.delete(`/OSSupply/projects/${id}`);

export const addProjectMember    = (id, data)   => api.post(`/OSSupply/projects/${id}/members`, data);
export const removeProjectMember = (id, userId) => api.delete(`/OSSupply/projects/${id}/members/${userId}`);

// Requests
export const getRequests       = (status)       => api.get(`/requests${status ? '?status=' + status : ''}`);
export const getRequest        = (id)           => api.get(`/OSSupply/requests/${id}`);
export const createRequest     = (data)         => api.post('/requests', data);
export const addRequestItem    = (id, data)     => api.post(`/OSSupply/requests/${id}/items`, data);
export const removeRequestItem = (id, itemId)   => api.delete(`/OSSupply/requests/${id}/OSSupply/items/${itemId}`);
export const submitRequest     = (id)           => api.post(`/OSSupply/requests/${id}/submit`);
export const cancelRequest     = (id)           => api.patch(`/OSSupply/requests/${id}/cancel`);
export const rejectRequest     = (id, data)     => api.patch(`/OSSupply/requests/${id}/reject`, data);
export const processRequest    = (id, data)     => api.patch(`/OSSupply/requests/${id}/process`, data);
export const tickItem          = (id, itemId)   => api.patch(`/OSSupply/requests/${id}/OSSupply/items/${itemId}/tick`);
export const markReady         = (id)           => api.patch(`/OSSupply/requests/${id}/ready`);
export const confirmPickup     = (id)           => api.patch(`/OSSupply/requests/${id}/pickup`);
export const getRequestReturns = (id)           => api.get(`/OSSupply/requests/${id}/returns`);
export const submitReturn      = (id, data)     => api.post(`/OSSupply/requests/${id}/returns`, data);

// Returns (admin)
export const getAllReturns  = (status) => api.get(`/returns${status ? '?status=' + status : ''}`);
export const confirmReturn  = (id)        => api.patch(`/returns/${id}/confirm`);
export const rejectReturn   = (id, data)  => api.patch(`/returns/${id}/reject`, data);

// Notifications
export const getNotifications = (page, limit) => api.get(`/notifications?page=${page}&limit=${limit}`);
export const markNotifRead    = (id)           => api.patch(`/OSSupply/notifications/${id}/read`);
export const markAllRead      = ()             => api.patch('/OSSupply/notifications/read-all');

// Users
export const updateMe      = (data)      => api.patch('/users/me', data);

// Users (admin)
export const getUsers      = (role) => api.get(`/users${role ? '?role=' + role : ''}`);
export const updateUserRole = (id, role) => api.patch(`/users/${id}/role`, { role });

// Upload
export async function uploadPhoto(file) {
  const { r2Key, uploadPath } = await api.post('/upload/presign');
  await fetch(BASE + uploadPath, {
    method: 'PUT', credentials: 'include',
    headers: { 'Content-Type': file.type }, body: file,
  });
  return r2Key;
}
