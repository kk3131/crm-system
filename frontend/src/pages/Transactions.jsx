import { useEffect, useState } from 'react';
import { getTransactions, getMembers, addTransaction } from '../api';

export default function Transactions() {
  const [txs, setTxs] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ member_id:'', amount:'', tx_date:'', description:'' });
  const [show, setShow] = useState(false);

  const load = async () => {
    const [t, m] = await Promise.all([getTransactions(), getMembers()]);
    setTxs(t.data); setMembers(m.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.member_id || !form.amount || !form.tx_date) return alert('請填寫完整');
    await addTransaction(form);
    setShow(false);
    setForm({ member_id:'', amount:'', tx_date:'', description:'' });
    load();
  };

  const nameMap = Object.fromEntries(members.map(m => [m.id, m.name]));

  return (
    <div style={s.page}>
      <div style={s.hdr}>
        <h2 style={s.title}>消費紀錄</h2>
        <button style={s.btn} onClick={() => setShow(true)}>＋ 新增消費</button>
      </div>
      <table style={s.table}>
        <thead><tr style={s.th}>
          <th>會員</th><th>金額</th><th>日期</th><th>項目</th>
        </tr></thead>
        <tbody>
          {txs.map(t => (
            <tr key={t.id} style={s.tr}>
              <td style={s.td}>{nameMap[t.member_id] || t.member_id}</td>
              <td style={s.td}>${Number(t.amount).toLocaleString()}</td>
              <td style={s.td}>{t.tx_date}</td>
              <td style={s.td}>{t.description || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {show && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={{ marginBottom:'1rem' }}>新增消費紀錄</h3>
            <div style={s.frow}>
              <label style={s.label}>會員</label>
              <select style={s.input} value={form.member_id} onChange={e => setForm({...form, member_id: e.target.value})}>
                <option value=''>選擇會員</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div style={s.frow}>
              <label style={s.label}>金額（元）</label>
              <input style={s.input} type='number' value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
            </div>
            <div style={s.frow}>
              <label style={s.label}>日期</label>
              <input style={s.input} type='date' value={form.tx_date} onChange={e => setForm({...form, tx_date: e.target.value})} />
            </div>
            <div style={s.frow}>
              <label style={s.label}>消費項目</label>
              <input style={s.input} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
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