import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [patients,     setPatients]     = useState([]);
    const [doctors,      setDoctors]      = useState([]);
    const [form, setForm] = useState({
        patientId:'', doctorId:'', apptDate:'', apptTime:'', notes:''
    });
    const [msg, setMsg] = useState('');

    const load = () => API.get('/appointments').then(r => setAppointments(r.data));

    useEffect(() => {
        load();
        API.get('/patients').then(r => setPatients(r.data));
        API.get('/doctors').then(r => setDoctors(r.data));
    }, []);

    const onSubmit = async e => {
        e.preventDefault();
        await API.post('/appointments', {
            patient: { patientId: form.patientId },
            doctor:  { doctorId:  form.doctorId  },
            apptDate: form.apptDate,
            apptTime: form.apptTime,
            notes:    form.notes,
            status:   'Scheduled'
        });
        setMsg('✅ Appointment booked!');
        load();
    };

    const complete = async (id) => {
        await API.patch(`/appointments/${id}/complete`);
        setMsg('✅ Appointment completed. Bill auto-generated.');
        load();
    };

    const th = { background:'#1F3864', color:'white', padding:'10px 12px', textAlign:'left' };
    const td = { padding:'8px 12px', borderBottom:'1px solid #ddd' };

    return (
        <div>
            <h2 style={{ color:'#1F3864' }}>Appointments</h2>

            {msg && <div style={{ padding:10, background:'#e8f5e9',
                borderLeft:'4px solid #43a047', margin:'10px 0' }}>{msg}</div>}

            {/* Add Appointment Form */}
            <div style={{ background:'#f5f5f5', padding:20, borderRadius:8, marginBottom:24 }}>
                <h3>Book New Appointment</h3>
                <form onSubmit={onSubmit} style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
                    <select value={form.patientId}
                            onChange={e => setForm({...form, patientId: e.target.value})}
                            style={sel} required>
                        <option value="">Select Patient</option>
                        {patients.map(p => <option key={p.patientId} value={p.patientId}>{p.fullName}</option>)}
                    </select>
                    <select value={form.doctorId}
                            onChange={e => setForm({...form, doctorId: e.target.value})}
                            style={sel} required>
                        <option value="">Select Doctor</option>
                        {doctors.map(d => <option key={d.doctorId} value={d.doctorId}>{d.fullName}</option>)}
                    </select>
                    <input type="date" value={form.apptDate}
                           onChange={e => setForm({...form, apptDate: e.target.value})}
                           style={sel} required />
                    <input type="time" value={form.apptTime}
                           onChange={e => setForm({...form, apptTime: e.target.value})}
                           style={sel} required />
                    <input placeholder="Notes" value={form.notes}
                           onChange={e => setForm({...form, notes: e.target.value})}
                           style={{ ...sel, width:200 }} />
                    <button type="submit" style={btn}>Book</button>
                </form>
            </div>

            {/* Appointment Table */}
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                <tr>
                    {['ID','Patient','Doctor','Date','Time','Status','Notes','Action'].map(h =>
                        <th key={h} style={th}>{h}</th>
                    )}
                </tr>
                </thead>
                <tbody>
                {appointments.map((a, i) => (
                    <tr key={a.apptId} style={{ background: i%2===0 ? '#f9f9f9':'white' }}>
                        <td style={td}>{a.apptId}</td>
                        <td style={td}>{a.patient?.fullName}</td>
                        <td style={td}>{a.doctor?.fullName}</td>
                        <td style={td}>{a.apptDate}</td>
                        <td style={td}>{a.apptTime}</td>
                        <td style={td}>
                <span style={{
                    background: a.status==='Completed' ? '#43a047' :
                        a.status==='Cancelled'  ? '#e53935' : '#FB8C00',
                    color:'white', padding:'2px 8px', borderRadius:12, fontSize:12
                }}>{a.status}</span>
                        </td>
                        <td style={td}>{a.notes}</td>
                        <td style={td}>
                            {a.status === 'Scheduled' && (
                                <button onClick={() => complete(a.apptId)}
                                        style={{ background:'#1F7A4D', color:'white',
                                            border:'none', padding:'4px 10px',
                                            borderRadius:4, cursor:'pointer' }}>
                                    Complete
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const sel = { padding:8, border:'1px solid #ccc', borderRadius:4 };
const btn = { padding:'8px 16px', background:'#2E5496', color:'white',
    border:'none', borderRadius:4, cursor:'pointer' };