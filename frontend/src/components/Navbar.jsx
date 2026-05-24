import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/',          label: '總覽' },
  { to: '/members',   label: '會員管理' },
  { to: '/transactions', label: '消費紀錄' },
  { to: '/products',  label: '商品管理' },
  { to: '/rfm',       label: 'RFM 分析' },
  { to: '/notify',    label: '優惠通知' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav style={styles.nav}>
      <span style={styles.brand}>🍰 甜點飲料 CRM</span>
      <div style={styles.links}>
        {links.map(l => (
          <Link key={l.to} to={l.to}
            style={{ ...styles.link, ...(pathname === l.to ? styles.active : {}) }}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav:    { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 2rem', height:'56px', background:'#fff', borderBottom:'1px solid #e5e5e5' },
  brand:  { fontWeight:600, fontSize:'16px' },
  links:  { display:'flex', gap:'4px' },
  link:   { padding:'6px 12px', borderRadius:'6px', textDecoration:'none', fontSize:'13px', color:'#555' },
  active: { background:'#f0f0f0', color:'#111', fontWeight:500 },
};