import { Link } from 'react-router-dom';

export default function Navbar() {
    const nav = { background:'#1F3864', padding:'0 20px', display:'flex',
        alignItems:'center', gap:24 };
    const link = { color:'white', textDecoration:'none', padding:'14px 0',
        fontWeight:'bold', fontSize:14 };
    return (
        <nav style={nav}>
      <span style={{ color:'white', fontSize:18, fontWeight:'bold', marginRight:20 }}>
        🏥 HMS
      </span>
            <Link style={link} to="/">Dashboard</Link>
            <Link style={link} to="/patients">Patients</Link>
            <Link style={link} to="/patients/add">Add Patient</Link>
            <Link style={link} to="/doctors">Doctors</Link>
            <Link style={link} to="/appointments">Appointments</Link>
            <Link style={link} to="/billing">Billing</Link>
        </nav>
    );
}