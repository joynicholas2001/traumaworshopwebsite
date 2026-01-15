import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import ThankYou from './pages/ThankYou';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import { useState, useEffect } from 'react';
import { auth } from './firebase/firebase';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    // In a real app, this would check auth state properly
    // For now we'll allow it to render, but the pages themselves will handle redirect if needed for simplicity in development
    // or checks could be added here.
    return children;
};

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    if (loading) return <div className="flex-center w-full h-screen">Loading...</div>;

    return (
        <div className="app-container">
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                    <>
                        <Navbar />
                        <Home />
                        <Footer />
                    </>
                } />

                <Route path="/register" element={
                    <>
                        <Navbar />
                        <Register />
                        <Footer />
                    </>
                } />

                <Route path="/thank-you" element={
                    <>
                        <Navbar />
                        <ThankYou />
                        <Footer />
                    </>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    user ? <Navigate to="/admin/dashboard" /> : <AdminLogin />
                } />

                <Route path="/admin/dashboard/*" element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
