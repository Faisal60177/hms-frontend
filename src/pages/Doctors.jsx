import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';

export default function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [search,  setSearch]  = useState('');

    useEffect(() => {
        API.get('/doctors').then(r => setDoctors(r.data));
    }, []);

    const filtered = doctors.filter(d =>
        d.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(search.toLowerCase())
    );

    const deptGroups = [...new Set(doctors.map(d => d.department?.deptName))].filter(Boolean);

    return (
        <div className="page-wrapper">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Medical Staff</h1>
                    <p className="page-subtitle">{doctors.length} doctors across {deptGroups.length} departments</p>
                </div>
                <div className="search-bar">
                    <span>🔍</span>
                    <input placeholder="Search doctors..."
                           value={search} onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16
            }}>
                {filtered.map(d => (
                    <div key={d.doctorId} className="card" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <div style={{
                                width: 50, height: 50, borderRadius: '50%',
                                background: '#dbeafe', color: '#1d4ed8',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontWeight: 700, fontSize: 18,
                                flexShrink: 0,
                            }}>
                                {d.fullName?.split(' ').pop()?.charAt(0)}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 15 }}>{d.fullName}</div>
                                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                                    {d.specialization}
                                </div>
                                <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="badge badge-info">
                    {d.department?.deptName}
                  </span>
                                    <span className={`badge ${d.availability === 'Available' ? 'badge-success' : 'badge-danger'}`}>
                    {d.availability}
                  </span>
                                </div>
                            </div>
                        </div>
                        <div className="divider" />
                        <div style={{ display: 'flex', justifyContent: 'space-between',
                            fontSize: 13, color: '#6b7280' }}>
                            <span>📞 {d.phone}</span>
                            <span style={{ fontWeight: 700, color: '#059669', fontSize: 14 }}>
                ৳{d.consultationFee?.toLocaleString()}
              </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}