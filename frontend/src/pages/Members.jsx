import { useEffect, useState } from 'react';
import { getMembers, addMember, updateMember, deleteMember } from '../api';

const EMPTY = { name:'', email:'', phone:'', gender:'不透露', birthday:'' };

export default function Members() {
  const [members, setMembers]       = useState([]);
  const [form, setForm]             = useState(EMPTY);
  const [editTarget, setEditTarget] = useState(null); // null = 新增模式
  const [showModal, setShowModal]   = useState(false);
  const [search, setSearch]         = useState('');

  const load = () => getMembers().then(r => setMembers(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setEditTarget(null); setShowModal(true); };
  const openEdit = (m) => {
    setForm({ name:m.name, email:m.email, phone:m.phone||'', gender:m.gender||'不透露', birthday:m.birthday||'' });
    setEditTarget(m);
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditTarget(null); };

  const submit = async () => {
    if (!form.name || !form.email) return alert('姓名與 Email 為必填');
    if (editTarget) {
      await updateMember(editTarget.id, form);
    } else {
      await addMember(form);
    }
    closeModal();
    load();
  };

  const handleDelete = async (m) => {
    if (!window.confirm(`確定刪除會員「${m.name}」？此操作無法復原。`)) return;
    await deleteMember(m.id);
    load();
  };

  const filtered = members.filter(m =>
    m.name.includes(search) || m.email.includes(search)
  );

  return (
    <div style={s.page}>
      <div style={s.hdr}>
        <h2 style={s.title}>會員管理</h2>
        <button style={s.btn} onClick={openAdd}>＋ 新增會員</button>
      </div>

      <input
        style={s.search}
        placeholder="搜尋姓名 / Email…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <table style={s.table}>
        <thead><tr style={s.thRow}>
          <th style={s.th}>姓名</th>
          <th style={s.th}>Email</th>
          <th style={s.th}>電話</th>
          <th style={s.th}>性別</th>
          <th style={s.th}>加入日期</th>
          <th style={s.th}></th>
        </tr></thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m.id} style={s.tr}>
              <td style={s.td}>{m.name}</td>
              <td style={s.td}>{m.email}</td>
              <td style={s.td}>{m.phone || '—'}</td>
              <td style={s.td}>{m.gender || '—'}</td>
              <td style={s.td}>{m.join_date}</td>
              <td style={s.td}>
                <button style={s.btnSm} onClick={() => openEdit(m)}>編輯</button>
                <button style={{...s.btnSm, ...s.btnDanger}} onClick={() => handleDelete(m)}>刪除</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={6} style={{...s.td, textAlign:'center', color:'#aaa'}}>無符合結果</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={{ marginBottom:'1rem' }}>{editTarget ? '編輯會員' : '新增會員'}</h3>
            {[['姓名','name','text'],['Email','email','email'],['電話','phone','text']].map(([label,key,type]) => (
              <div key={key} style={s.frow}>
                <label style={s.label}>{label}</label>
                <input style={s.input} type={type} value={form[key]}
                  onChange={e => setForm({...form, [key]: e.target.value})} />
              </div>
            ))}
            <div style={s.frow}>
              <label style={s.label}>性別</label>
              <select style={s.input} value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option>男</option><option>女</option><option>不透露</option>
              </select>
            </div>
            <div style={s.frow}>
              <label style={s.label}>生日</label>
              <input style={s.input} type="date" value={form.birthday}
                onChange={e => setForm({...form, birthday: e.target.value})} />
            </div>
            <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end', marginTop:'1rem' }}>
              <button style={s.btnSec} onClick={closeModal}>取消</button>
              <button style={s.btn} onClick={submit}>{editTarget ? '儲存' : '新增'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page:      { padding:'2rem' },
  hdr:       { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' },
  title:     { fontSize:'18px', fontWeight:500 },
  search:    { width:'280px', padding:'8px 12px', border:'1px solid #ddd', borderRadius:'6px', fontSize:'13px', marginBottom:'1rem', outline:'none' },
  btn:       { padding:'8px 16px', background:'#111', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px' },
  btnSec:    { padding:'8px 16px', background:'#f5f5f5', color:'#333', border:'1px solid #ddd', borderRadius:'6px', cursor:'pointer', fontSize:'13px' },
  btnSm:     { padding:'4px 10px', background:'#f5f5f5', color:'#333', border:'1px solid #ddd', borderRadius:'4px', cursor:'pointer', fontSize:'12px', marginRight:'4px' },
  btnDanger: { background:'#fff0f0', color:'#c0392b', borderColor:'#f5c6c6' },
  table:     { width:'100%', borderCollapse:'collapse' },
  thRow:     { background:'#f9f9f9' },
  th:        { padding:'10px', fontSize:'12px', color:'#888', fontWeight:500, textAlign:'left' },
  tr:        { borderBottom:'1px solid #f0f0f0' },
  td:        { padding:'12px 10px', fontSize:'13px' },
  overlay:   { position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  modal:     { background:'#fff', borderRadius:'12px', padding:'1.5rem', width:'420px' },
  frow:      { marginBottom:'12px' },
  label:     { display:'block', fontSize:'12px', color:'#888', marginBottom:'4px' },
  input:     { width:'100%', padding:'8px 10px', border:'1px solid #ddd', borderRadius:'6px', fontSize:'13px', boxSizing:'border-box' },
};
