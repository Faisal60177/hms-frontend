import { useEffect, useState } from 'react';
import API from '../api/axiosConfig';

export default function Billing() {
    const [bills,  setBills]  = useState([]);
    const [filter, setFilter] = useState('All');

    const load = async () => {
        const url = filter === 'Pending' ? '/billing/pending' : '/billing';
        const res = await API.get(url);
        setBills(res.data);
    };

    useEffect(() => { load(); }, [filter]);

    const markPaid = async (id) => {
        await API.patch(`/billing/${id}/pay`);
        load();
    };

    const th = { background:'#1F3864', color:'white', padding:'10px 12px', textAlign:'left' };
    const td = { padding:'8px 12px', borderBottom:'1px solid #ddd' };

    const statusColor = s =>
        s==='Paid' ? '#43a047' : s==='Pending' ? '#e53935' : '#FB8C00';

    return (
        <div>
            <h2 style={{ color:'#1F3864' }}>Billing Records</h2>

            <div style={{ marginBottom:16, display:'flex', gap:8 }}>
                {['All','Pending'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                            style={{ padding:'8px 16px', border:'none', borderRadius:4,
                                cursor:'pointer',
                                background: filter===f ? '#2E5496':'#ddd',
                                color: filter===f ? 'white':'#333' }}>
                        {f} Bills
                    </button>
                ))}
            </div>

            <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                <tr>
                    {['Bill ID','Patient','Date','Consult','Medicine',
                        'Tests','Bed','Total','Status','Action'].map(h =>
                        <th key={h} style={th}>{h}</th>
                    )}
                </tr>
                </thead>
                <tbody>
                {bills.map((b, i) => (
                    <tr key={b.billId} style={{ background: i%2===0 ? '#f9f9f9':'white' }}>
                        <td style={td}>{b.billId}</td>
                        <td style={td}>{b.patient?.fullName}</td>
                        <td style={td}>{b.billDate}</td>
                        <td style={td}>৳{b.consultationFee}</td>
                        <td style={td}>৳{b.medicineCost}</td>
                        <td style={td}>৳{b.testCharges}</td>
                        <td style={td}>৳{b.bedCharges}</td>
                        <td style={{ ...td, fontWeight:'bold' }}>৳{b.totalAmount}</td>
                        <td style={td}>
                <span style={{ background: statusColor(b.paymentStatus),
                    color:'white', padding:'2px 8px',
                    borderRadius:12, fontSize:12 }}>
                  {b.paymentStatus}
                </span>
                        </td>
                        <td style={td}>
                            {b.paymentStatus !== 'Paid' && (
                                <button onClick={() => markPaid(b.billId)}
                                        style={{ background:'#1F7A4D', color:'white',
                                            border:'none', padding:'4px 10px',
                                            borderRadius:4, cursor:'pointer' }}>
                                    Mark Paid
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