import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';

export default function PatientForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '', age: '', gender: 'Male', bloodGroup: '',
        phone: '', address: '', patientType: 'OPD'
    });
    const [msg, setMsg]   = useState('');
    const [err, setErr]   = useState('');
    const [saving, setSaving] = useState(false);

    const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setSaving(true); setMsg(''); setErr('');
        try {
            const res = await API.post('/patients', form);
            setMsg(`Patient registered successfully! ID: #${res.data.patientId}`);
            setTimeout(() => navigate('/patients'), 1500);
        } catch (ex) {
            setErr(ex.response?.data?.message || ex.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Register New Patient</h1>
                    <p className="page-subtitle">Fill in patient details below</p>
                </div>
                <button className="btn btn-outline" onClick={() => navigate('/patients')}>
                    ← Back to Patients
                </button>
            </div>

            <div style={{ maxWidth: 720 }}>
                {msg && (
                    <div className="alert alert-success">
                        ✅ {msg}
                    </div>
                )}
                {err && (
                    <div className="alert alert-danger">
                        ❌ {err}
                    </div>
                )}

                <div className="card">
                    <form onSubmit={onSubmit}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20,
                            paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>
                            Personal Information
                        </h3>

                        <div className="form-grid-2">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input className="form-control" name="fullName"
                                       value={form.fullName} onChange={onChange} required
                                       placeholder="Enter full name" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number *</label>
                                <input className="form-control" name="phone" type="tel"
                                       value={form.phone} onChange={onChange} required
                                       placeholder="01XXXXXXXXX" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Age</label>
                                <input className="form-control" name="age" type="number"
                                       value={form.age} onChange={onChange}
                                       placeholder="Age in years" min="0" max="150" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Blood Group</label>
                                <select className="form-control" name="bloodGroup"
                                        value={form.bloodGroup} onChange={onChange}>
                                    <option value="">Select blood group</option>
                                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <select className="form-control" name="gender"
                                        value={form.gender} onChange={onChange}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Patient Type</label>
                                <select className="form-control" name="patientType"
                                        value={form.patientType} onChange={onChange}>
                                    <option value="OPD">OPD — Outpatient</option>
                                    <option value="IPD">IPD — Inpatient (Admitted)</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Address</label>
                            <textarea className="form-control" name="address"
                                      value={form.address} onChange={onChange}
                                      rows={2} placeholder="Full address" />
                        </div>

                        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                            <button type="submit" className="btn btn-primary"
                                    disabled={saving}>
                                {saving ? 'Registering...' : '✅ Register Patient'}
                            </button>
                            <button type="button" className="btn btn-outline"
                                    onClick={() => navigate('/patients')}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}