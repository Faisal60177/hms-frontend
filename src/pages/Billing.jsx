import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';

export default function Billing() {
    const [bills,  setBills]  = useState([]);
    const [filter, setFilter] = useState('All');
    const [msg,    setMsg]    = useState('');

    const load = async () => {
        const res = await API.get('/billing');
        setBills(res.data);
    };

    useEffect(() => { load(); }, []);

    const markPaid = async (id) => {
        await API.patch(`/billing/${id}/pay`);
        setMsg('✅ Bill marked as paid.');
        load();
    };

    const filtered = filter === 'All'
        ? bills
        : bills.filter(b => b.paymentStatus === filter);

    const totalRevenue  = bills.reduce((s, b) => s + (b.totalAmount || 0), 0);
    const totalCollected = bills.filter(b => b.paymentStatus === 'Paid')
        .reduce((s, b) => s + (b.totalAmount || 0), 0);
    const totalPending  = bills.filter(b => b.paymentStatus !== 'Paid')
        .reduce((s, b) => s + (b.totalAmount || 0), 0);

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Billing & Payments</h1>
                    <p className="page-subtitle">{bills.length} total billing records</p>
                </div>
            </div>

            {msg && (
                <div className="alert alert-success">{msg}</div>
            )}

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Total Billed',   value: totalRevenue,   color: '#1d4ed8', bg: '#eff6ff' },
                    { label: 'Collected',      value: totalCollected, color: '#15803d', bg: '#f0fdf4' },
                    { label: 'Pending',        value: totalPending,   color: '#dc2626', bg: '#fef2f2' },
                ].map(s => (
                    <div key={s.label} className="card" style={{ background: s.bg, border: 'none' }}>
                        <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{s.label}</div>
                        <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginTop: 6 }}>
                            ৳{s.value.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {['All', 'Paid', 'Pending', 'Partial'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}>
                        {f} ({f === 'All' ? bills.length : bills.filter(b => b.paymentStatus === f).length})
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Bill #</th><th>Patient</th><th>Date</th>
                        <th>Consult</th><th>Medicine</th><th>Tests</th>
                        <th>Bed</th><th>Total</th><th>Status</th><th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(b => (
                        <tr key={b.billId}>
                            <td style={{ color: '#9ca3af', fontSize: 12 }}>#{b.billId}</td>
                            <td style={{ fontWeight: 600 }}>{b.patient?.fullName}</td>
                            <td style={{ color: '#6b7280', fontSize: 13 }}>{b.billDate}</td>
                            <td>৳{b.consultationFee}</td>
                            <td>৳{b.medicineCost}</td>
                            <td>৳{b.testCharges}</td>
                            <td>৳{b.bedCharges}</td>
                            <td style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>
                                ৳{b.totalAmount?.toLocaleString()}
                            </td>
                            <td>
                  <span className={`badge ${
                      b.paymentStatus === 'Paid'    ? 'badge-success' :
                          b.paymentStatus === 'Pending' ? 'badge-danger'  : 'badge-warning'
                  }`}>
                    {b.paymentStatus}
                  </span>
                            </td>
                            <td>
                                {b.paymentStatus !== 'Paid' && (
                                    <button className="btn btn-success btn-sm"
                                            onClick={() => markPaid(b.billId)}>
                                        ✓ Mark Paid
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">💳</div>
                        <p>No billing records found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}