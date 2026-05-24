import { useEffect, useState } from 'react';
import { getRFM, sendNotify } from '../api';

export default function Notify() {
  const [data, setData] = useState([]);
  const [sent, setSent] = useState({});

  useEffect(() => {
    getRFM().then(r => setData(r.data.filter(m => m.total >= 9)));
  }, []);

  const handle = async (member) => {
    const content = `親愛的 ${member.name}，感謝您長期的支持！專屬優惠碼：VIP2025，消費享九折優惠。`;
    const res = await sendNotify(member.member_id, { content });
    setSent(prev => ({ ...prev, [member.member_id]: res.data.status }));
  };

  return (
    <div style={{ padding:'2rem' }}>
      <h2 style={{ fontSize:'18px', fontWeight:500, marginBottom:'0.5rem' }}>優惠通知</h2>
      <p style={{ fontSize:'13px', color:'#888', marginBottom:'1.5rem' }}>RFM 總分 9 分以上的高貢獻客戶</p>
      {data.map(m => (
        <div key={m.member_id} style={s.card}>
          <div>
            <div style={s.name}>{m.name}</div>
            <div style={s.detail}>累計消費 ${m.monetary.toLocaleString()} · RFM {m.total}/15</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            {sent[m.member_id] && (
              <span style={{ fontSize:'12px', color:'#085041', background:'#E1F5EE', padding:'4px 10px', borderRadius:'4px' }}>
                ✓ {sent[m.member_id] === 'sent' ? '已發送' : '發送失敗'}
              </span>
            )}
            <button style={s.btn} onClick={() => handle(m)}>發送優惠</button>
          </div>
        </div>
      ))}
    </div>
  );
}

const s = {
  card:   { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', marginBottom:'10px', border:'1px solid #eee', borderRadius:'10px' },
  name:   { fontSize:'14px', fontWeight:500, marginBottom:'3px' },
  detail: { fontSize:'12px', color:'#888' },
  btn:    { padding:'7px 14px', background:'#111', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px' },
};