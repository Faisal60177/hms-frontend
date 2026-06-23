import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosConfig';

export default function Dashboard() {
    const [data, setData] = useState({
        patients: [], doctors: [], appointments: [], bills: [], beds: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            API.get('/patients'),
            API.get('/doctors'),
            API.get('/appointments'),
            API.get('/billing'),
            API.get('/beds'),
        ]).then(([p, d, a, b, beds]) => {
            setData({
                patients:     p.data,
                doctors:      d.data,
                appointments: a.data,
                bills:        b.data,
                beds:         beds.data,
            });
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div className="page-wrapper">
            <div style={{ textAlign: 'center', padding: 80, color: '#9ca3af' }}>
                Loading dashboard...
            </div>
        </div>
    );

    const pendingBills   = data.bills.filter(b => b.paymentStatus === 'Pending').length;
    const availableBeds  = data.beds.filter(b => b.status === 'Available').length;
    const todayAppts     = data.appointments.filter(a => a.status === 'Scheduled').length;
    const ipdPatients    = data.patients.filter(p => p.patientType === 'IPD').length;

    const stats = [
        {
            label: 'Total Patients',  value: data.patients.length,
            sub: `${ipdPatients} IPD admitted`,
            icon: '👥', bg: '#eff6ff', iconBg: '#dbeafe', color: '#1d4ed8',
            link: '/patients',
        },
        {
            label: 'Doctors on Staff', value: data.doctors.length,
            sub: 'Across all departments',
            icon: '🩺', bg: '#f0fdf4', iconBg: '#dcfce7', color: '#15803d',
            link: '/doctors',
        },
        {
            label: 'Appointments',    value: data.appointments.length,
            sub: `${todayAppts} scheduled`,
            icon: '📅', bg: '#fefce8', iconBg: '#fef9c3', color: '#a16207',
            link: '/appointments',
        },
        {
            label: 'Available Beds',  value: availableBeds,
            sub: `${data.beds.length - availableBeds} occupied`,
            icon: '🛏', bg: '#fdf4ff', iconBg: '#f3e8ff', color: '#7e22ce',
            link: '/beds',
        },
        {
            label: 'Billing Records', value: data.bills.length,
            sub: `${pendingBills} pending payment`,
            icon: '💳', bg: '#fff7ed', iconBg: '#fed7aa', color: '#c2410c',
            link: '/billing',
        },
    ];

    const recentPatients = [...data.patients]
        .sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate))
        .slice(0, 5);

    const recentBills = [...data.bills].slice(-5).reverse();

    return (
        <div className="page-wrapper">

            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">🏥 MedCare Hospital Management</h1>
                    <p className="page-subtitle">
                        Welcome back, Admin — {new Date().toLocaleDateString('en-BD', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16, marginBottom: 28,
            }}>
                {stats.map(s => (
                    <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
                        <div className="stat-card" style={{ cursor: 'pointer' }}
                             onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                             onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}>
                            <div className="stat-icon" style={{ background: s.iconBg }}>
                                {s.icon}
                            </div>
                            <div>
                                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                                <div className="stat-label">{s.label}</div>
                                <div className="stat-change" style={{ color: '#9ca3af' }}>{s.sub}</div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Two column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* Recent Patients */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700 }}>Recent Patients</h3>
                        <Link to="/patients" style={{ fontSize: 13, color: '#2563eb',
                            textDecoration: 'none', fontWeight: 500 }}>
                            View all →
                        </Link>
                    </div>
                    {recentPatients.map((p, i) => (
                        <div key={p.patientId} style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 0',
                            borderBottom: i < recentPatients.length - 1 ? '1px solid #f3f4f6' : 'none',
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: '50%',
                                background: '#dbeafe', color: '#1d4ed8',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontWeight: 700, fontSize: 13,
                                flexShrink: 0,
                            }}>
                                {p.fullName?.charAt(0)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 600, fontSize: 14,
                                    whiteSpace: 'nowrap', overflow: 'hidden',
                                    textOverflow: 'ellipsis' }}>
                                    {p.fullName}
                                </div>
                                <div style={{ fontSize: 12, color: '#9ca3af' }}>
                                    {p.age}y • {p.gender} • {p.bloodGroup}
                                </div>
                            </div>
                            <span className={`badge ${p.patientType === 'IPD' ? 'badge-danger' : 'badge-info'}`}>
                {p.patientType}
              </span>
                        </div>
                    ))}
                </div>

                {/* Recent Bills */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700 }}>Recent Billing</h3>
                        <Link to="/billing" style={{ fontSize: 13, color: '#2563eb',
                            textDecoration: 'none', fontWeight: 500 }}>
                            View all →
                        </Link>
                    </div>
                    {recentBills.map((b, i) => (
                        <div key={b.billId} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 0',
                            borderBottom: i < recentBills.length - 1 ? '1px solid #f3f4f6' : 'none',
                        }}>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14 }}>
                                    {b.patient?.fullName}
                                </div>
                                <div style={{ fontSize: 12, color: '#9ca3af' }}>{b.billDate}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>
                                    ৳{b.totalAmount?.toLocaleString()}
                                </div>
                                <span className={`badge ${
                                    b.paymentStatus === 'Paid'    ? 'badge-success' :
                                        b.paymentStatus === 'Pending' ? 'badge-danger'  : 'badge-warning'
                                }`}>
                  {b.paymentStatus}
                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginTop: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {[
                        { to: '/patients/add',   label: 'Register Patient', icon: '➕', cls: 'btn-primary' },
                        { to: '/appointments',   label: 'New Appointment',  icon: '📅', cls: 'btn-success' },
                        { to: '/beds',           label: 'Assign Bed',       icon: '🛏', cls: 'btn-outline' },
                        { to: '/medical-records',label: 'Add Medical Record',icon: '📋', cls: 'btn-outline' },
                        { to: '/billing',        label: 'View Billing',     icon: '💳', cls: 'btn-outline' },
                    ].map(({ to, label, icon, cls }) => (
                        <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                            <button className={`btn ${cls}`}>
                                <span>{icon}</span> {label}
                            </button>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
}