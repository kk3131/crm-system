import { useEffect, useState } from 'react';
import { getRFM } from '../api';

const segLabel = total => {
  if (total >= 12) return { label:'VIP 頂級',  color:'#3C3489', bg:'#EEEDFE' };
  if (total >= 9)  return { label:'忠實顧客',  color:'#085041', bg:'#E1F5EE' };
  if (total >= 6)  return { label:'新進會員',  color:'#0C447C', bg:'#E6F1FB' };
  if (total >= 3)  return { label:'流失風險',  color:'#993C1D', bg:'#FAECE7' };
  return              { label:'沉睡顧客',  color:'#5F5E5A', bg:'#F1EFE8' };
};

export default function RFM() {
  const [data, setData] = useState([]);
  useEffect(() => { getRFM().then(r => setData(r.data)); }, []);

  return (
    <div style={{ padding:'2rem' }}>
      <h2 style={{ fontSize:'18px', fontWeight:500, marginBottom:'1.5rem' }}>RFM 貢獻度排名</h2>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ background:'#f9f9f9', fontSize:'12px', color:'#888' }}>
            <th style={th}>排名</th><th style={th}>姓名</th>
            <th style={th}>R 分</th><th style={th}>F 分</th><th style={th}>M 分</th>
            <th style={th}>總分</th><th style={th}>累計消費</th><th style={th}>客群</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => {
            const seg = segLabel(r.total);
            return (
              <tr key={r.member_id} style={{ borderBottom:'1px solid #f0f0f0' }}>
                <td style={td}><strong>{i + 1}</strong></td>
                <td style={td}>{r.name}</td>
                <td style={td}>{r.r}</td>
                <td style={td}>{r.f}</td>
                <td style={td}>{r.m}</td>
                <td style={td}><strong>{r.total}</strong> / 15</td>
                <td style={td}>${r.monetary.toLocaleString()}</td>
                <td style={td}>
                  <span style={{ background:seg.bg, color:seg.color, padding:'3px 8px', borderRadius:'4px', fontSize:'12px', fontWeight:500 }}>
                    {seg.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding:'10px', textAlign:'left' };
const td = { padding:'12px 10px', fontSize:'13px' };