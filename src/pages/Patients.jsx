import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [search,   setSearch]   = useState('');
    const [loading,  setLoading]  = useState(true);

    const load = async () => {
        setLoading(true);
        const url = search ? `/patients/search?name=${search}` : '/patients';
        const res = await API.get(url);
        setPatients(res.data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const deletePatient = async (id) => {
        if (!window.confirm('Delete this patient?')) return;
        await API.delete(`/patients/${id}`);
        load();
    };

    const th = { background:'#1F3864', color:'white', padding:'10px 12px', textAlign:'left' };
    const td = { padding:'8px 12px', borderBottom:'1px solid #ddd' };

    return (
        <div>
            <h2 style={{ color:'#1F3864' }}>Patient List</h2>

            <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                <input value={search} onChange={e => setSearch(e.target.value)}
                       placeholder="Search by name..." style={inp} />
                <button onClick={load} style={btn}>Search</button>
                <button onClick={() => { setSearch(''); load(); }} style={{ ...btn, background:'#666' }}>
                    Clear
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                    <tr>
                        {['ID','Name','Age','Gender','Blood','Phone','Type','Admitted','Action'].map(h =>
                            <th key={h} style={th}>{h}</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {patients.map((p, i) => (
                        <tr key={p.patientId} style={{ background: i%2===0 ? '#f9f9f9':'white' }}>
                            <td style={td}>{p.patientId}</td>
                            <td style={td}>{p.fullName}</td>
                            <td style={td}>{p.age}</td>
                            <td style={td}>{p.gender}</td>
                            <td style={td}>{p.bloodGroup}</td>
                            <td style={td}>{p.phone}</td>
                            <td style={td}>
                  <span style={{
                      background: p.patientType==='IPD' ? '#e53935':'#43a047',
                      color:'white', padding:'2px 8px', borderRadius:12, fontSize:12
                  }}>{p.patientType}</span>
                            </td>
                            <td style={td}>{p.admissionDate}</td>
                            <td style={td}>
                                <button onClick={() => deletePatient(p.patientId)}
                                        style={{ background:'#e53935', color:'white',
                                            border:'none', padding:'4px 10px',
                                            borderRadius:4, cursor:'pointer' }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const inp = { padding:8, border:'1px solid #ccc', borderRadius:4, width:250 };
const btn = { padding:'8px 16px', background:'#2E5496', color:'white',
    border:'none', borderRadius:4, cursor:'pointer' };