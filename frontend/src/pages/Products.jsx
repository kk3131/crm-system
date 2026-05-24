import { useEffect, useState } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../api';

const CATEGORIES = ['甜點', '飲料'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', price:'', category:'甜點', stock:'', description:'' });

  const load = () => getProducts().then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setForm({ name:'', price:'', category:'甜點', stock:'', description:'' });
    setEditing(null); setShowAdd(true);
  };

  const openEdit = (p) => {
    setForm({ name:p.name, price:p.price, category:p.category, stock:p.stock, description:p.description||'' });
    setEditing(p.id); setShowAdd(true);
  };

  const submit = async () => {
    if (!form.name || !form.price) return alert('名稱與價格為必填');
    if (editing) await updateProduct(editing, form);
    else await addProduct(form);
    setShowAdd(false); load();
  };

  const remove = async (id, name) => {
    if (!window.confirm(`確定刪除「${name}」？`)) return;
    await deleteProduct(id); load();
  };

  const sweet  = products.filter(p => p.category === '甜點');
  const drinks = products.filter(p => p.category === '飲料');

  return (
    <div style={{ padding:'2rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <h2 style={{ fontSize:'18px', fontWeight:500 }}>商品管理</h2>
        <button style={s.btn} onClick={openAdd}>＋ 新增商品</button>
      </div>

      {['甜點','飲料'].map(cat => (
        <div key={cat} style={{ marginBottom:'2rem' }}>
          <div style={{ fontSize:'13px', fontWeight:500, color:'#888', marginBottom:'10px', paddingBottom:'6px', borderBottom:'1px solid #f0f0f0' }}>
            {cat === '甜點' ? '🍰' : '🧋'} {cat}
          </div>
          <table style={s.table}>
            <thead><tr style={s.th}>
              <th style={th}>商品名稱</th>
              <th style={th}>價格</th>
              <th style={th}>庫存</th>
              <th style={th}>描述</th>
              <th style={th}>操作</th>
            </tr></thead>
            <tbody>
              {(cat === '甜點' ? sweet : drinks).map(p => (
                <tr key={p.id} style={{ borderBottom:'1px solid #f0f0f0' }}>
                  <td style={td}><strong>{p.name}</strong></td>
                  <td style={td}>${p.price}</td>
                  <td style={td}>
                    <span style={{ color: p.stock <= 5 ? '#993C1D' : '#085041', fontWeight:500 }}>
                      {p.stock} 份 {p.stock <= 5 && '⚠️ 庫存低'}
                    </span>
                  </td>
                  <td style={{ ...td, color:'#888', fontSize:'12px' }}>{p.description || '—'}</td>
                  <td style={td}>
                    <button style={s.btnSm} onClick={() => openEdit(p)}>編輯</button>
                    <button style={{ ...s.btnSm, marginLeft:'6px', color:'#993C1D' }} onClick={() => remove(p.id, p.name)}>刪除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {showAdd && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <h3 style={{ marginBottom:'1rem' }}>{editing ? '編輯商品' : '新增商品'}</h3>
            {[['商品名稱','name','text'],['價格（元）','price','number'],['庫存數量','stock','number']].map(([label,key,type]) => (
              <div key={key} style={s.frow}>
                <label style={s.label}>{label}</label>
                <input style={s.input} type={type} value={form[key]}
                  onChange={e => setForm({...form, [key]: e.target.value})} />
              </div>
            ))}
            <div style={s.frow}>
              <label style={s.label}>類別</label>
              <select style={s.input} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={s.frow}>
              <label style={s.label}>圖片描述</label>
              <input style={s.input} value={form.description}
                onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end', marginTop:'1rem' }}>
              <button style={s.btnSec} onClick={() => setShowAdd(false)}>取消</button>
              <button style={s.btn} onClick={submit}>{editing ? '儲存' : '新增'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  btn:     { padding:'8px 16px', background:'#111', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px' },
  btnSec:  { padding:'8px 16px', background:'#f5f5f5', color:'#333', border:'1px solid #ddd', borderRadius:'6px', cursor:'pointer', fontSize:'13px' },
  btnSm:   { padding:'4px 10px', background:'#f5f5f5', color:'#333', border:'1px solid #eee', borderRadius:'4px', cursor:'pointer', fontSize:'12px' },
  table:   { width:'100%', borderCollapse:'collapse' },
  th:      { background:'#f9f9f9', fontSize:'12px', color:'#888' },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  modal:   { background:'#fff', borderRadius:'12px', padding:'1.5rem', width:'420px' },
  frow:    { marginBottom:'12px' },
  label:   { display:'block', fontSize:'12px', color:'#888', marginBottom:'4px' },
  input:   { width:'100%', padding:'8px 10px', border:'1px solid #ddd', borderRadius:'6px', fontSize:'13px', boxSizing:'border-box' },
};
const th = { padding:'10px', textAlign:'left', fontWeight:400 };
const td = { padding:'12px 10px', fontSize:'13px' };