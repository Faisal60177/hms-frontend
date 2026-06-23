import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar          from './components/Navbar';
import Dashboard       from './pages/Dashboard';
import Patients        from './pages/Patients';
import PatientForm     from './pages/PatientForm';
import Doctors         from './pages/Doctors';
import Appointments    from './pages/Appointments';
import Billing         from './pages/Billing';
import Beds            from './pages/Beds';
import MedicalRecords  from './pages/MedicalRecords';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/"                element={<Dashboard />} />
                <Route path="/patients"        element={<Patients />} />
                <Route path="/patients/add"    element={<PatientForm />} />
                <Route path="/doctors"         from element={<Doctors />} />
                <Route path="/appointments"    element={<Appointments />} />
                <Route path="/billing"         element={<Billing />} />
                <Route path="/beds"            element={<Beds />} />
                <Route path="/medical-records" element={<MedicalRecords />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;