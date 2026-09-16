import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import BookingSuccess from './pages/BookingSuccess';
import BookingCancelled from './pages/BookingCancelled';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/admin/AdminRoute';
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <>
    <Header/>
      <Link to="/admin-login" className="admin-nav-btn">Admin Login</Link>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/booking-cancelled" element={<BookingCancelled />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Routes>
    </>
  );
}

export default App;