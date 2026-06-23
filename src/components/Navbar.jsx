import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { to: '/',                label: 'Dashboard',       icon: '⊞' },
    { to: '/patients',        label: 'Patients',         icon: '👥' },
    { to: '/patients/add',    label: 'Add Patient',      icon: '➕' },
    { to: '/doctors',         label: 'Doctors',          icon: '🩺' },
    { to: '/appointments',    label: 'Appointments',     icon: '📅' },
    { to: '/billing',         label: 'Billing',          icon: '💳' },
    { to: '/beds',            label: 'Beds',             icon: '🛏' },
    { to: '/medical-records', label: 'Medical Records',  icon: '📋' },
];

export default function Navbar() {
    const { pathname } = useLocation();

    return (
        <nav style={{
            background: '#0f172a',
            borderBottom: '1px solid #1e293b',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div style={{
                maxWidth: 1280,
                margin: '0 auto',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                height: 56,
            }}>

                {/* Logo */}
                <Link to="/" style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    textDecoration: 'none', marginRight: 24,
                }}>
                    <div style={{
                        width: 32, height: 32, background: '#2563eb',
                        borderRadius: 8, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: 16,
                    }}>🏥</div>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, lineHeight: 1 }}>
                            MedCare HMS
                        </div>
                        <div style={{ color: '#64748b', fontSize: 10, lineHeight: 1, marginTop: 2 }}>
                            Hospital Management
                        </div>
                    </div>
                </Link>

                {/* Nav Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                    {navItems.map(({ to, label, icon }) => {
                        const active = pathname === to;
                        return (
                            <Link key={to} to={to} style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '6px 12px', borderRadius: 6,
                                textDecoration: 'none', fontSize: 13, fontWeight: 500,
                                color: active ? '#fff' : '#94a3b8',
                                background: active ? '#1e293b' : 'transparent',
                                transition: 'all 0.15s',
                            }}
                                  onMouseEnter={e => {
                                      if (!active) e.currentTarget.style.color = '#fff';
                                  }}
                                  onMouseLeave={e => {
                                      if (!active) e.currentTarget.style.color = '#94a3b8';
                                  }}>
                                <span style={{ fontSize: 14 }}>{icon}</span>
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    paddingLeft: 16, borderLeft: '1px solid #1e293b',
                }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: '#2563eb', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 13, fontWeight: 700,
                    }}>A</div>
                    <div>
                        <div style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>Admin</div>
                        <div style={{ color: '#64748b', fontSize: 10 }}>Administrator</div>
                    </div>
                </div>
            </div>
        </nav>
    );
}