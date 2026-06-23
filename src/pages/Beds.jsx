import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';

export default function Beds() {
    const [beds,     setBeds]     = useState([]);
    const [wards,    setWards]    = useState([]);
    const [patients, setPatients] = useState([]);
    const [admitted, setAdmitted] = useState([]);
    const [msg,      setMsg]      = useState('');
    const [err,      setErr]      = useState('');
    const [form,     setForm]     = useState({ bedId: '', patientId: '' });

    const load = async () => {
        const [b, w, p, a] = await Promise.all([
            API.get('/beds'),
            API.get('/wards'),
            API.get('/patients'),
            API.get('/bed-allocations/current')
        ]);
        setBeds(b.data);
        setWards(w.data);
        setPatients(p.data);
        setAdmitted(a.data);
    };

    useEffect(() => { load(); }, []);

    const assignBed = async (e) => {
        e.preventDefault();
        setMsg(''); setErr('');
        try {
            await API.post('/bed-allocations', {
                bed:     { bedId:     parseInt(form.bedId) },
                patient: { patientId: parseInt(form.patientId) }
            });
            setMsg('✅ Bed assigned successfully!');
            setForm({ bedId: '', patientId: '' });
            load();
        } catch (ex) {
            setErr(`❌ ${ex.response?.data?.message || ex.message}`);
        }
    };

    const discharge = async (patientId) => {
        setMsg(''); setErr('');
        try {
            await API.patch(`/bed-allocations/discharge/${patientId}`);
            setMsg('✅ Patient discharged. Bed is now available.');
            load();
        } catch (ex) {
            setErr(`❌ ${ex.response?.data?.message || ex.message}`);
        }
    };

    const th = { background: '#1F3864', color: 'white', padding: '10px 12px', textAlign: 'left' };
    const td = { padding: '8px 12px', borderBottom: '1px solid #ddd' };
    const sel = { padding: 8, border: '1px solid #ccc', borderRadius: 4, minWidth: 180 };
    const btn = { padding: '8px 16px', background: '#2E5496', color: 'white',
        border: 'none', borderRadius: 4, cursor: 'pointer' };

    const availableBeds = beds.filter(b => b.status === 'Available');

    return (
        <div>
            <h2 style={{ color: '#1F3864' }}>Bed Management</h2>

            {msg && <div style={{ padding: 10, background: '#e8f5e9',
                borderLeft: '4px solid #43a047', margin: '10px 0' }}>{msg}</div>}
            {err && <div style={{ padding: 10, background: '#ffebee',
                borderLeft: '4px solid #e53935', margin: '10px 0' }}>{err}</div>}

            {/* Ward Summary */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
                {wards.map(w => {
                    const wardBeds   = beds.filter(b => b.ward?.wardId === w.wardId);
                    const occupied   = wardBeds.filter(b => b.status === 'Occupied').length;
                    const available  = wardBeds.filter(b => b.status === 'Available').length;
                    const pct        = wardBeds.length ? Math.round((occupied / wardBeds.length) * 100) : 0;
                    return (
                        <div key={w.wardId} style={{ background: '#f5f5f5', borderRadius: 8,
                            padding: '16px 20px', minWidth: 180,
                            borderLeft: `4px solid ${pct > 80 ? '#e53935' : '#43a047'}` }}>
                            <div style={{ fontWeight: 'bold', color: '#1F3864' }}>{w.wardName}</div>
                            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{w.wardType}</div>
                            <div style={{ marginTop: 8 }}>
                                <span style={{ color: '#43a047' }}>✅ {available} free</span>
                                {'  '}
                                <span style={{ color: '#e53935' }}>🔴 {occupied} occupied</span>
                            </div>
                            <div style={{ fontSize: 12, marginTop: 4, color: pct > 80 ? '#e53935' : '#333' }}>
                                {pct}% occupancy {pct > 80 ? '⚠️ HIGH' : ''}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Assign Bed Form */}
            <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 8, marginBottom: 24 }}>
                <h3 style={{ marginTop: 0 }}>Assign Bed to Patient</h3>
                <form onSubmit={assignBed} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <select value={form.patientId}
                            onChange={e => setForm({ ...form, patientId: e.target.value })}
                            style={sel} required>
                        <option value="">Select Patient (IPD)</option>
                        {patients
                            .filter(p => p.patientType === 'IPD')
                            .map(p => (
                                <option key={p.patientId} value={p.patientId}>
                                    {p.fullName} (ID: {p.patientId})
                                </option>
                            ))}
                    </select>

                    <select value={form.bedId}
                            onChange={e => setForm({ ...form, bedId: e.target.value })}
                            style={sel} required>
                        <option value="">Select Available Bed</option>
                        {availableBeds.map(b => (
                            <option key={b.bedId} value={b.bedId}>
                                {b.ward?.wardName} — Bed {b.bedNumber}
                            </option>
                        ))}
                    </select>

                    <button type="submit" style={btn}>Assign Bed</button>
                </form>
            </div>

            {/* Currently Admitted Table */}
            <h3>Currently Admitted Patients</h3>
            {admitted.length === 0 ? (
                <p style={{ color: '#666' }}>No patients currently admitted.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
                    <thead>
                    <tr>
                        {['Patient', 'Ward', 'Bed', 'Admitted On', 'Action'].map(h =>
                            <th key={h} style={th}>{h}</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {admitted.map((a, i) => (
                        <tr key={a.allocId} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                            <td style={td}>{a.patient?.fullName}</td>
                            <td style={td}>{a.bed?.ward?.wardName}</td>
                            <td style={td}>{a.bed?.bedNumber}</td>
                            <td style={td}>{a.assignedDate}</td>
                            <td style={td}>
                                <button
                                    onClick={() => discharge(a.patient?.patientId)}
                                    style={{ background: '#e53935', color: 'white', border: 'none',
                                        padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>
                                    Discharge
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* Full Bed List */}
            <h3>All Beds</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    {['Bed ID', 'Bed No', 'Ward', 'Type', 'Daily Rate', 'Status'].map(h =>
                        <th key={h} style={th}>{h}</th>
                    )}
                </tr>
                </thead>
                <tbody>
                {beds.map((b, i) => (
                    <tr key={b.bedId} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                        <td style={td}>{b.bedId}</td>
                        <td style={td}>{b.bedNumber}</td>
                        <td style={td}>{b.ward?.wardName}</td>
                        <td style={td}>{b.ward?.wardType}</td>
                        <td style={td}>৳{b.ward?.dailyRate}/day</td>
                        <td style={td}>
                <span style={{
                    background: b.status === 'Available' ? '#43a047' :
                        b.status === 'Occupied'  ? '#e53935' : '#FB8C00',
                    color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: 12
                }}>{b.status}</span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}