import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';

export default function MedicalRecords() {
    const [records,  setRecords]  = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors,  setDoctors]  = useState([]);
    const [chronic,  setChronic]  = useState(false);
    const [msg,      setMsg]      = useState('');
    const [err,      setErr]      = useState('');
    const [form,     setForm]     = useState({
        patientId: '', doctorId: '', diagnosis: '',
        prescription: '', testsOrdered: '', isChronic: false
    });

    const load = async () => {
        const url = chronic ? '/medical-records/chronic' : '/medical-records';
        const res = await API.get(url);
        setRecords(res.data);
    };

    useEffect(() => {
        load();
        API.get('/patients').then(r => setPatients(r.data));
        API.get('/doctors').then(r => setDoctors(r.data));
    }, [chronic]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg(''); setErr('');
        try {
            await API.post('/medical-records', {
                patient:      { patientId: parseInt(form.patientId) },
                doctor:       { doctorId:  parseInt(form.doctorId)  },
                diagnosis:    form.diagnosis,
                prescription: form.prescription,
                testsOrdered: form.testsOrdered,
                isChronic:    form.isChronic
            });
            setMsg('✅ Medical record saved!');
            setForm({ patientId: '', doctorId: '', diagnosis: '',
                prescription: '', testsOrdered: '', isChronic: false });
            load();
        } catch (ex) {
            setErr(`❌ ${ex.response?.data?.message || ex.message}`);
        }
    };

    const th = { background: '#1F3864', color: 'white', padding: '10px 12px', textAlign: 'left' };
    const td = { padding: '8px 12px', borderBottom: '1px solid #ddd', verticalAlign: 'top' };
    const sel = { padding: 8, border: '1px solid #ccc', borderRadius: 4, width: '100%',
        marginBottom: 10, boxSizing: 'border-box' };

    return (
        <div>
            <h2 style={{ color: '#1F3864' }}>Medical Records</h2>

            {msg && <div style={{ padding: 10, background: '#e8f5e9',
                borderLeft: '4px solid #43a047', margin: '10px 0' }}>{msg}</div>}
            {err && <div style={{ padding: 10, background: '#ffebee',
                borderLeft: '4px solid #e53935', margin: '10px 0' }}>{err}</div>}

            {/* Add Record Form */}
            <div style={{ background: '#f5f5f5', padding: 20, borderRadius: 8, marginBottom: 24 }}>
                <h3 style={{ marginTop: 0 }}>Add Medical Record</h3>
                <form onSubmit={onSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={{ fontWeight: 'bold', fontSize: 13 }}>Patient</label>
                            <select value={form.patientId}
                                    onChange={e => setForm({ ...form, patientId: e.target.value })}
                                    style={sel} required>
                                <option value="">Select Patient</option>
                                {patients.map(p => (
                                    <option key={p.patientId} value={p.patientId}>{p.fullName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontWeight: 'bold', fontSize: 13 }}>Doctor</label>
                            <select value={form.doctorId}
                                    onChange={e => setForm({ ...form, doctorId: e.target.value })}
                                    style={sel} required>
                                <option value="">Select Doctor</option>
                                {doctors.map(d => (
                                    <option key={d.doctorId} value={d.doctorId}>{d.fullName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {[
                        { label: 'Diagnosis',     name: 'diagnosis'    },
                        { label: 'Prescription',  name: 'prescription' },
                        { label: 'Tests Ordered', name: 'testsOrdered' },
                    ].map(({ label, name }) => (
                        <div key={name} style={{ marginBottom: 10 }}>
                            <label style={{ fontWeight: 'bold', fontSize: 13 }}>{label}</label>
                            <textarea
                                value={form[name]}
                                onChange={e => setForm({ ...form, [name]: e.target.value })}
                                rows={2}
                                style={{ ...sel, marginTop: 4, resize: 'vertical' }}
                            />
                        </div>
                    ))}

                    <label style={{ display: 'flex', alignItems: 'center', gap: 8,
                        cursor: 'pointer', marginBottom: 12 }}>
                        <input type="checkbox"
                               checked={form.isChronic}
                               onChange={e => setForm({ ...form, isChronic: e.target.checked })} />
                        <span style={{ fontWeight: 'bold', color: '#e53935' }}>
              ⚠️ Mark as Chronic Condition (Priority Care)
            </span>
                    </label>

                    <button type="submit"
                            style={{ padding: '10px 24px', background: '#2E5496', color: 'white',
                                border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                        Save Record
                    </button>
                </form>
            </div>

            {/* Filter Toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <button onClick={() => setChronic(false)}
                        style={{ padding: '8px 16px', border: 'none', borderRadius: 4,
                            cursor: 'pointer',
                            background: !chronic ? '#2E5496' : '#ddd',
                            color: !chronic ? 'white' : '#333' }}>
                    All Records
                </button>
                <button onClick={() => setChronic(true)}
                        style={{ padding: '8px 16px', border: 'none', borderRadius: 4,
                            cursor: 'pointer',
                            background: chronic ? '#e53935' : '#ddd',
                            color: chronic ? 'white' : '#333' }}>
                    ⚠️ Chronic Cases Only
                </button>
            </div>

            {/* Records Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    {['ID', 'Patient', 'Doctor', 'Visit Date', 'Diagnosis',
                        'Prescription', 'Tests', 'Chronic'].map(h =>
                        <th key={h} style={th}>{h}</th>
                    )}
                </tr>
                </thead>
                <tbody>
                {records.map((r, i) => (
                    <tr key={r.recordId} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                        <td style={td}>{r.recordId}</td>
                        <td style={td}>{r.patient?.fullName}</td>
                        <td style={td}>{r.doctor?.fullName}</td>
                        <td style={td}>{r.visitDate}</td>
                        <td style={td}>{r.diagnosis}</td>
                        <td style={td}>{r.prescription}</td>
                        <td style={td}>{r.testsOrdered}</td>
                        <td style={td}>
                            {r.isChronic
                                ? <span style={{ color: '#e53935', fontWeight: 'bold' }}>⚠️ YES</span>
                                : <span style={{ color: '#43a047' }}>No</span>}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}