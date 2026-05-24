import { useEffect, useState } from 'react';
import { getMembers, getTransactions, getRFM, getProducts } from '../api';

export default function Overview() {
  const [stats, setStats] = useState({ members:0, txCount:0, revenue:0, vip:0 });
  const [products, setProducts] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    Promise.all([getMembers(), getTransactions(), getRFM(), getProducts()]).then(([m, t, r, p]) => {
      const revenue = t.data.reduce((s, x) => s + Number(x.amount), 0);
      const vip = r.data.filter(x => x.total >= 12).length;
      setStats({ members: m.data.length, txCount: t.data.length, revenue, vip });
      setMembers(m.data);
      setRecentTx(t.data.slice(0, 5));
      setProducts(p.data);
    });
  }, []);

  const nameMap = Object.fromEntries(members.map(m => [m.id, m.name]));
  const sweet  = products.filter(p => p.category === '甜點');
  const drinks = products.filter(p => p.category === '飲料');

  const statCards = [
    { label:'會員總數',   value: stats.members,              unit:'人' },
    { label:'消費總筆數', value: stats.txCount,              unit:'筆' },
    { label:'累計營收',   value:`$${stats.revenue.toLocaleString()}`, unit:'元' },
    { label:'VIP 頂級',  value: stats.vip,                  unit:'人' },
  ];

  return (
    <div style={{ padding:'2rem' }}>
      <h2 style={{ fontSize:'18px', fontWeight:500, marginBottom:'1.5rem' }}>總覽</h2>

      {/* 統計卡片 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px', marginBottom:'2rem' }}>
        {statCards.map(c => (
          <div key={c.label} style={s.card}>
            <div style={s.cardLabel}>{c.label}</div>
            <div style={s.cardValue}>{c.value}</div>
            <div style={s.cardUnit}>{c.unit}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        {/* 近期消費 */}
        <div>
          <div style={s.secTitle}>近期消費紀錄</div>
          {recentTx.map(t => (
            <div key={t.id} style={s.txRow}>
              <div>
                <div style={{ fontSize:'13px', fontWeight:500 }}>{t.description || '一般消費'}</div>
                <div style={{ fontSize:'12px', color:'#888' }}>{nameMap[t.member_id]} · {t.tx_date}</div>
              </div>
              <div style={{ fontSize:'14px', fontWeight:500 }}>${Number(t.amount).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* 商品一覽 */}
        <div>
          <div style={s.secTitle}>商品一覽</div>
          <div style={{ marginBottom:'1rem' }}>
            <div style={s.catLabel}>🍰 甜點</div>
            {sweet.map(p => (
              <div key={p.id} style={s.prodRow}>
                <span style={{ fontSize:'13px' }}>{p.name}</span>
                <span style={{ fontSize:'13px', color:'#555' }}>${p.price} <span style={{ fontSize:'11px', color: p.stock<=5?'#993C1D':'#aaa' }}>庫存 {p.stock}</span></span>
              </div>
            ))}
          </div>
          <div>
            <div style={s.catLabel}>🧋 飲料</div>
            {drinks.map(p => (
              <div key={p.id} style={s.prodRow}>
                <span style={{ fontSize:'13px' }}>{p.name}</span>
                <span style={{ fontSize:'13px', color:'#555' }}>${p.price} <span style={{ fontSize:'11px', color: p.stock<=5?'#993C1D':'#aaa' }}>庫存 {p.stock}</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  card:      { background:'#f9f9f9', borderRadius:'10px', padding:'1rem', textAlign:'center' },
  cardLabel: { fontSize:'12px', color:'#888', marginBottom:'6px' },
  cardValue: { fontSize:'22px', fontWeight:500 },
  cardUnit:  { fontSize:'11px', color:'#aaa', marginTop:'4px' },
  secTitle:  { fontSize:'14px', fontWeight:500, marginBottom:'12px', paddingBottom:'8px', borderBottom:'1px solid #f0f0f0' },
  txRow:     { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #f5f5f5' },
  prodRow:   { display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f5f5f5' },
  catLabel:  { fontSize:'12px', fontWeight:500, color:'#888', marginBottom:'6px' },
};