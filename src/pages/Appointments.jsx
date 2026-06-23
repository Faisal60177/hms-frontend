import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [patients,     setPatients]     = useState([]);
    const [doctors,      setDoctors]      = useState([]);
    const [showForm,     setShowForm]     = useState(false);
    const [msg,          setMsg]          = useState('');
    const [filter,       setFilter]       = useState('All');
    const [form, setForm] = useState({
        patientId: '', doctorId: '', apptDate: '', apptTime: '', notes: ''
    });

    const load = () => API.get('/appointments').then(r => setAppointments(r.data));

    useEffect(() => {
        load();
        API.get('/patients').then(r => setPatients(r.data));
        API.get('/doctors').then(r => setDoctors(r.data));
    }, []);

    const onSubmit = async e => {
        e.preventDefault();
        try {
            await API.post('/appointments', {
                patient: { patientId: parseInt(form.patientId) },
                doctor:  { doctorId:  parseInt(form.doctorId) },
                apptDate: form.apptDate, apptTime: form.apptTime,
                notes: form.notes, status: 'Scheduled'
            });
            setMsg('✅ Appointment booked successfully!');
            setShowForm(false);
            setForm({ patientId: '', doctorId: '', apptDate: '', apptTime: '', notes: '' });
            load();
        } catch (ex) {
            setMsg('❌ ' + (ex.response?.data?.message || ex.message));
        }
    };

    const complete = async (id) => {
        await API.patch(`/appointments/${id}/complete`);
        setMsg('✅ Completed. Bill auto-generated.');
        load();
    };

    const statusColor = s =>
        s === 'Completed' ? 'badge-success' :
            s === 'Cancelled' ? 'badge-danger'  :
                s === 'No-Show'   ? 'badge-gray'    : 'badge-warning';

    const filtered = filter === 'All'
        ? appointments
        : appointments.filter(a => a.status === filter);

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Appointments</h1>
                    <p className="page-subtitle">{appointments.length} total appointments</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? '✕ Close' : '➕ Book Appointment'}
                </button>
            </div>

            {msg && (
                <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-danger'}`}>
                    {msg}
                </div>
            )}

            {/* Book Form */}
            {showForm && (
                <div className="card" style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
                        Book New Appointment
                    </h3>
                    <form onSubmit={onSubmit}>
                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Patient *</label>
                                <select className="form-control"
                                        value={form.patientId}
                                        onChange={e => setForm({...form, patientId: e.target.value})} required>
                                    <option value="">Select patient</option>
                                    {patients.map(p => (
                                        <option key={p.patientId} value={p.patientId}>
                                            {p.fullName} (#{p.patientId})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Doctor *</label>
                                <select className="form-control"
                                        value={form.doctorId}
                                        onChange={e => setForm({...form, doctorId: e.target.value})} required>
                                    <option value="">Select doctor</option>
                                    {doctors.map(d => (
                                        <option key={d.doctorId} value={d.doctorId}>
                                            {d.fullName} — ৳{d.consultationFee}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Date *</label>
                                <input className="form-control" type="date"
                                       value={form.apptDate}
                                       onChange={e => setForm({...form, apptDate: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Time *</label>
                                <input className="form-control" type="time"
                                       value={form.apptTime}
                                       onChange={e => setForm({...form, apptTime: e.target.value})} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <input className="form-control" placeholder="Reason for visit..."
                                   value={form.notes}
                                   onChange={e => setForm({...form, notes: e.target.value})} />
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button type="submit" className="btn btn-primary">Book Appointment</button>
                            <button type="button" className="btn btn-outline"
                                    onClick={() => setShowForm(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {['All', 'Scheduled', 'Completed', 'Cancelled'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}>
                        {f} ({f === 'All' ? appointments.length
                        : appointments.filter(a => a.status === f).length})
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>ID</th><th>Patient</th><th>Doctor</th>
                        <th>Department</th><th>Date</th><th>Time</th>
                        <th>Status</th><th>Notes</th><th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map(a => (
                        <tr key={a.apptId}>
                            <td style={{ color: '#9ca3af', fontSize: 12 }}>#{a.apptId}</td>
                            <td style={{ fontWeight: 600 }}>{a.patient?.fullName}</td>
                            <td>{a.doctor?.fullName}</td>
                            <td style={{ color: '#6b7280' }}>{a.doctor?.department?.deptName}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{a.apptDate}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{a.apptTime}</td>
                            <td><span className={`badge ${statusColor(a.status)}`}>{a.status}</span></td>
                            <td style={{ color: '#6b7280', maxWidth: 180,
                                overflow: 'hidden', textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap' }}>{a.notes}</td>
                            <td>
                                {a.status === 'Scheduled' && (
                                    <button className="btn btn-success btn-sm"
                                            onClick={() => complete(a.apptId)}>
                                        ✓ Complete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">📅</div>
                        <p>No appointments found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}