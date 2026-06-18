import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar        from './components/Navbar';
import Dashboard     from './pages/Dashboard';
import Patients      from './pages/Patients';
import PatientForm   from './pages/PatientForm';
import Doctors       from './pages/Doctors';
import Appointments  from './pages/Appointments';
import Billing       from './pages/Billing';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <div style={{ padding: '20px' }}>
                <Routes>
                    <Route path="/"              element={<Dashboard />} />
                    <Route path="/patients"      element={<Patients />} />
                    <Route path="/patients/add"  element={<PatientForm />} />
                    <Route path="/doctors"       element={<Doctors />} />
                    <Route path="/appointments"  element={<Appointments />} />
                    <Route path="/billing"       element={<Billing />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;