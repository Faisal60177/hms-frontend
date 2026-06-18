import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';

export default function Dashboard() {
    const [counts, setCounts] = useState({ patients: 0, doctors: 0, appointments: 0, bills: 0 });

    useEffect(() => {
        Promise.all([
            API.get('/patients'),
            API.get('/doctors'),
            API.get('/appointments'),
            API.get('/billing')
        ]).then(([p, d, a, b]) => setCounts({
            patients: p.data.length,
            doctors:  d.data.length,
            appointments: a.data.length,
            bills:    b.data.length
        }));
    }, []);

    const cards = [
        { label: 'Total Patients',     value: counts.patients,     color: '#2E5496' },
        { label: 'Total Doctors',      value: counts.doctors,      color: '#1F7A4D' },
        { label: 'Appointments',       value: counts.appointments, color: '#7B3F00' },
        { label: 'Billing Records',    value: counts.bills,        color: '#6A0DAD' },
    ];

    return (
        <div>
            <h2 style={{ color:'#1F3864' }}>Dashboard — Hospital Overview</h2>
            <div style={{ display:'flex', gap:20, flexWrap:'wrap', marginTop:20 }}>
                {cards.map(c => (
                    <div key={c.label} style={{
                        background: c.color, color:'white', borderRadius:8,
                        padding:'20px 30px', minWidth:180, textAlign:'center'
                    }}>
                        <div style={{ fontSize:36, fontWeight:'bold' }}>{c.value}</div>
                        <div style={{ marginTop:6, fontSize:14 }}>{c.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}