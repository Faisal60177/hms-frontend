import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axiosConfig';

export default function Patients() {
    const [patients, setPatients] = useState([]);
    const [search,   setSearch]   = useState('');
    const [loading,  setLoading]  = useState(true);
    const [filter,   setFilter]   = useState('All');

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

    const filtered = filter === 'All'
        ? patients
        : patients.filter(p => p.patientType === filter);

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Patient Management</h1>
                    <p className="page-subtitle">{patients.length} total patients registered</p>
                </div>
                <Link to="/patients/add">
                    <button className="btn btn-primary">➕ Register Patient</button>
                </Link>
            </div>

            {/* Filters + Search */}
            <div className="card card-sm" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {['All', 'OPD', 'IPD'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                    className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}>
                                {f} {f !== 'All' && (
                                <span style={{ marginLeft: 4 }}>
                    ({patients.filter(p => p.patientType === f).length})
                  </span>
                            )}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <div className="search-bar">
                            <span>🔍</span>
                            <input placeholder="Search patients..."
                                   value={search}
                                   onChange={e => setSearch(e.target.value)}
                                   onKeyDown={e => e.key === 'Enter' && load()} />
                        </div>
                        <button className="btn btn-outline" onClick={load}>Search</button>
                        <button className="btn btn-outline btn-sm"
                                onClick={() => { setSearch(''); setFilter('All'); load(); }}>
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
                        Loading patients...
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <p>No patients found.</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Age / Gender</th>
                            <th>Blood</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Type</th>
                            <th>Admitted</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map(p => (
                            <tr key={p.patientId}>
                                <td style={{ color: '#9ca3af', fontSize: 12 }}>#{p.patientId}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 34, height: 34, borderRadius: '50%',
                                            background: '#dbeafe', color: '#1d4ed8',
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontWeight: 700, fontSize: 13,
                                            flexShrink: 0,
                                        }}>
                                            {p.fullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>{p.fullName}</div>
                                            <div style={{ fontSize: 12, color: '#9ca3af' }}>{p.address}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{p.age}y / {p.gender}</td>
                                <td>
                    <span className="tag" style={{
                        background: '#fef9c3', color: '#854d0e', fontSize: 12
                    }}>{p.bloodGroup}</span>
                                </td>
                                <td style={{ fontFamily: 'monospace', fontSize: 13 }}>{p.phone}</td>
                                <td style={{ color: '#6b7280' }}>{p.address}</td>
                                <td>
                    <span className={`badge ${p.patientType === 'IPD' ? 'badge-danger' : 'badge-info'}`}>
                      {p.patientType}
                    </span>
                                </td>
                                <td style={{ color: '#6b7280', fontSize: 13 }}>{p.admissionDate}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm"
                                            onClick={() => deletePatient(p.patientId)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
                {filtered.length > 0 && (
                    <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6',
                        fontSize: 13, color: '#6b7280', background: '#f8fafc' }}>
                        Showing {filtered.length} of {patients.length} patients
                    </div>
                )}
            </div>
        </div>
    );
}