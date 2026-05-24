import { useEffect, useState } from 'react';
import { getMembers, addMember } from '../api';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', phone:'', gender:'不透露', birthday:'' });
  const [show, setShow] = useState(false);

  const load = () => getMembers().then(r => setMembers(r.data));
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.name || !form.email) return alert('姓名與 Email 為必填');
    await addMember(form);
    setShow(false);
    setForm({ name:'', email:'', phone:'', gender:'不透露', birthday:'' });
    load();
  };

  return (
    <div style={s.page}>
      <div style={s.hdr}>
        <h2 style={s.title}>會員管理</h2>
        <button style={s.btn} onClick={() => setShow(true)}>＋ 新增會員</button>
      </div>

      <table style={s.table}>
        <thead><tr style={s.th}>
          <th>姓名</th><th>Email</th><th>電話</th><th>性別</th><th>加入日期</th>
        </tr></thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id} style={s.tr}>
              <td style={s.td}>{m.name}</td>
              <td style={s.td}>{m.email}</td>
              <td style={s.td}>{m.phone || '—'}</td>
              <td style={s.td}>{m.gender || '—'}</td>
              <td style={s.td}>{m.join_date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {show && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={{ marginBottom:'1rem' }}>新增會員</h3>
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
              <button style={s.btnSec} onClick={() => setShow(false)}>取消</button>
              <button style={s.btn} onClick={submit}>新增</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page:    { padding:'2rem' },
  hdr:     { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' },
  title:   { fontSize:'18px', fontWeight:500 },
  btn:     { padding:'8px 16px', background:'#111', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px' },
  btnSec:  { padding:'8px 16px', background:'#f5f5f5', color:'#333', border:'1px solid #ddd', borderRadius:'6px', cursor:'pointer', fontSize:'13px' },
  table:   { width:'100%', borderCollapse:'collapse' },
  th:      { background:'#f9f9f9', fontSize:'12px', color:'#888' },
  tr:      { borderBottom:'1px solid #f0f0f0' },
  td:      { padding:'12px 10px', fontSize:'13px' },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  modal:   { background:'#fff', borderRadius:'12px', padding:'1.5rem', width:'420px' },
  frow:    { marginBottom:'12px' },
  label:   { display:'block', fontSize:'12px', color:'#888', marginBottom:'4px' },
  input:   { width:'100%', padding:'8px 10px', border:'1px solid #ddd', borderRadius:'6px', fontSize:'13px', boxSizing:'border-box' },
};