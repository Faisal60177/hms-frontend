import { useState } from 'react';
import API from '../api/axiosConfig';

export default function PatientForm() {
    const [form, setForm] = useState({
        fullName:'', age:'', gender:'Male', bloodGroup:'',
        phone:'', address:'', patientType:'OPD'
    });
    const [msg,  setMsg]  = useState('');
    const [err,  setErr]  = useState('');

    const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setMsg(''); setErr('');
        try {
            const res = await API.post('/patients', form);
            setMsg(`✅ Patient registered! ID: ${res.data.patientId}`);
            setForm({ fullName:'', age:'', gender:'Male', bloodGroup:'',
                phone:'', address:'', patientType:'OPD' });
        } catch (ex) {
            setErr(`❌ ${ex.response?.data?.message || ex.message}`);
        }
    };

    return (
        <div style={{ maxWidth:500 }}>
            <h2 style={{ color:'#1F3864' }}>Register New Patient</h2>
            {msg && <div style={sty.ok}>{msg}</div>}
            {err && <div style={sty.er}>{err}</div>}
            <form onSubmit={onSubmit}>
                {[
                    { label:'Full Name',   name:'fullName',   type:'text'   },
                    { label:'Age',         name:'age',        type:'number' },
                    { label:'Blood Group', name:'bloodGroup', type:'text'   },
                    { label:'Phone',       name:'phone',      type:'text'   },
                    { label:'Address',     name:'address',    type:'text'   },
                ].map(({ label, name, type }) => (
                    <div key={name}>
                        <label style={sty.lbl}>{label}</label>
                        <input type={type} name={name} value={form[name]}
                               onChange={onChange} style={sty.inp}
                               required={name==='fullName'||name==='phone'} />
                    </div>
                ))}
                <label style={sty.lbl}>Gender</label>
                <select name="gender" value={form.gender} onChange={onChange} style={sty.inp}>
                    <option>Male</option><option>Female</option><option>Other</option>
                </select>
                <label style={sty.lbl}>Patient Type</label>
                <select name="patientType" value={form.patientType} onChange={onChange} style={sty.inp}>
                    <option value="OPD">OPD (Outpatient)</option>
                    <option value="IPD">IPD (Inpatient)</option>
                </select>
                <button type="submit" style={sty.btn}>Register Patient</button>
            </form>
        </div>
    );
}

const sty = {
    lbl: { display:'block', marginTop:10, fontWeight:'bold', fontSize:14 },
    inp: { width:'100%', padding:8, margin:'4px 0 12px', border:'1px solid #ccc',
        borderRadius:4, boxSizing:'border-box' },
    btn: { background:'#2E5496', color:'white', padding:'10px 24px',
        border:'none', borderRadius:4, cursor:'pointer', marginTop:8 },
    ok:  { padding:10, background:'#e8f5e9', borderLeft:'4px solid #43a047', margin:'10px 0' },
    er:  { padding:10, background:'#ffebee', borderLeft:'4px solid #e53935', margin:'10px 0' },
};