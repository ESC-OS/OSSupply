import { requireAuth } from '../auth.js';

async function init() {
  const user = await requireAuth();
  if (!user) return;

  document.getElementById('app').innerHTML = `
    <div style="max-width:680px">
      <h1 class="page-title" style="margin-bottom:1.75rem">Policy</h1>

      <div class="card" style="margin-bottom:1.25rem">
        <div class="card-title">การยืมอุปกรณ์</div>
        <ul style="list-style:disc;padding-left:1.4rem;display:flex;flex-direction:column;gap:.6rem;font-size:.92rem;color:var(--text-muted);line-height:1.7">
          <li>ผู้ยืมต้องเป็นนิสิตหรือบุคลากรของคณะวิศวกรรมศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย</li>
          <li>การยืมอุปกรณ์ทุกครั้งต้องผ่านระบบนี้และได้รับการอนุมัติจากเจ้าหน้าที่ก่อน</li>
          <li>ผู้ยืมต้องระบุโครงการที่เกี่ยวข้องและวันคืนที่ชัดเจน</li>
          <li>อุปกรณ์ต้องได้รับการดูแลรักษาในสภาพดี และคืนภายในระยะเวลาที่กำหนด</li>
        </ul>
      </div>

      <div class="card" style="margin-bottom:1.25rem">
        <div class="card-title">การคืนอุปกรณ์</div>
        <ul style="list-style:disc;padding-left:1.4rem;display:flex;flex-direction:column;gap:.6rem;font-size:.92rem;color:var(--text-muted);line-height:1.7">
          <li>คืนอุปกรณ์ตามวันและเวลาที่กำหนดในคำขอ</li>
          <li>แนบรูปถ่ายอุปกรณ์ก่อนคืนทุกครั้ง</li>
          <li>หากอุปกรณ์ชำรุดหรือสูญหาย ผู้ยืมต้องรับผิดชอบค่าซ่อมแซมหรือชดใช้ตามราคาจริง</li>
          <li>การคืนเกินกำหนดอาจส่งผลต่อสิทธิ์การยืมในอนาคต</li>
        </ul>
      </div>

      <div class="card">
        <div class="card-title">ข้อปฏิบัติทั่วไป</div>
        <ul style="list-style:disc;padding-left:1.4rem;display:flex;flex-direction:column;gap:.6rem;font-size:.92rem;color:var(--text-muted);line-height:1.7">
          <li>ห้ามนำอุปกรณ์ไปให้บุคคลอื่นยืมต่อโดยไม่ได้รับอนุญาต</li>
          <li>ห้ามใช้อุปกรณ์เพื่อประโยชน์ส่วนตัวหรือเชิงพาณิชย์</li>
          <li>หากพบปัญหาหรือข้อขัดข้อง ให้ติดต่อเจ้าหน้าที่ทันที</li>
        </ul>
      </div>
    </div>`;
}

init();
