import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        API.get('/doctors').then(r => setDoctors(r.data));
    }, []);

    const th = { background:'#1F3864', color:'white', padding:'10px 12px', textAlign:'left' };
    const td = { padding:'8px 12px', borderBottom:'1px solid #ddd' };

    return (
        <div>
            <h2 style={{ color:'#1F3864' }}>Doctor List</h2>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                <tr>
                    {['ID','Name','Specialization','Department','Phone','Fee','Status'].map(h =>
                        <th key={h} style={th}>{h}</th>
                    )}
                </tr>
                </thead>
                <tbody>
                {doctors.map((d, i) => (
                    <tr key={d.doctorId} style={{ background: i%2===0 ? '#f9f9f9':'white' }}>
                        <td style={td}>{d.doctorId}</td>
                        <td style={td}>{d.fullName}</td>
                        <td style={td}>{d.specialization}</td>
                        <td style={td}>{d.department?.deptName}</td>
                        <td style={td}>{d.phone}</td>
                        <td style={td}>৳{d.consultationFee}</td>
                        <td style={td}>
                <span style={{
                    background: d.availability==='Available' ? '#43a047':'#e53935',
                    color:'white', padding:'2px 8px', borderRadius:12, fontSize:12
                }}>{d.availability}</span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}