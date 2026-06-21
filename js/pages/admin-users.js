import { requireAuth } from '../auth.js';
import { getUsers, updateUserRole, setUserStatus } from '../api.js';
import { h } from '../ui.js';

async function init() {
  const me = await requireAuth(['admin']);
  if (!me) return;

  const app = document.getElementById('app');

  async function renderPage(roleFilter = '') {
    const { users } = await getUsers(roleFilter || undefined);

    app.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">จัดการผู้ใช้งาน</h1>
        <select class="filter-select" id="role-filter">
          <option value="">ทุกบทบาท</option>
          <option value="user">ผู้ใช้</option>
          <option value="staff">เจ้าหน้าที่</option>
          <option value="admin">ผู้ดูแล</option>
        </select>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>ผู้ใช้</th><th>อีเมล</th><th>บทบาท</th><th>สถานะ</th><th>การดำเนินการ</th></tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:.6rem">
                    ${u.avatar_url
                      ? `<img src="${h(u.avatar_url)}" class="member-avatar" alt="${h(u.name)}">`
                      : `<div class="member-avatar-ph">${h(u.name.charAt(0))}</div>`}
                    <div>
                      <div style="font-weight:600;font-size:.88rem">${h(u.name)}</div>
                      ${u.nickname ? `<div style="font-size:.75rem;color:var(--text-muted)">${h(u.nickname)}</div>` : ''}
                    </div>
                  </div>
                </td>
                <td style="font-size:.85rem">${h(u.email)}</td>
                <td>
                  <select class="role-select" data-uid="${h(u.id)}" ${u.id === me.id ? 'disabled title="ไม่สามารถเปลี่ยนบทบาทของตัวเองได้"' : ''}>
                    <option value="user"  ${u.role === 'user'  ? 'selected' : ''}>ผู้ใช้</option>
                    <option value="staff" ${u.role === 'staff' ? 'selected' : ''}>เจ้าหน้าที่</option>
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>ผู้ดูแล</option>
                  </select>
                </td>
                <td>
                  ${u.is_active === 1
                    ? `<span class="status-pill status-pill-confirmed">ใช้งาน</span>`
                    : `<span class="status-pill status-pill-rejected">ระงับ</span>`}
                </td>
                <td>
                  ${u.id !== me.id ? `
                    <button class="btn btn-sm do-toggle-status ${u.is_active === 1 ? 'btn-danger' : 'btn-success'}"
                      data-uid="${h(u.id)}" data-active="${u.is_active}">
                      ${u.is_active === 1 ? 'ระงับ' : 'เปิดใช้งาน'}
                    </button>` : `<span style="font-size:.78rem;color:var(--text-subtle)">—</span>`}
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`;

    document.getElementById('role-filter').value = roleFilter;
    document.getElementById('role-filter').addEventListener('change', e => renderPage(e.target.value));

    document.querySelectorAll('.role-select').forEach(sel => {
      sel.addEventListener('change', async e => {
        try { await updateUserRole(sel.dataset.uid, e.target.value); }
        catch (err) { alert(err.message); sel.value = sel.dataset.prev; }
        sel.dataset.prev = e.target.value;
      });
      sel.dataset.prev = sel.value;
    });

    document.querySelectorAll('.do-toggle-status').forEach(btn => {
      btn.addEventListener('click', async () => {
        const isActive = btn.dataset.active === '1';
        const label    = isActive ? 'ระงับ' : 'เปิดใช้งาน';
        if (!confirm(`ต้องการ${label}ผู้ใช้นี้?`)) return;
        try {
          await setUserStatus(btn.dataset.uid, !isActive);
          await renderPage(document.getElementById('role-filter').value);
        } catch (err) { alert(err.message); }
      });
    });
  }

  await renderPage();
}

init();
