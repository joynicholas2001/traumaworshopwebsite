import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // The user prompt said: Username: admin, Password: kabod@2026
            // Since Firebase Auth uses email, we'll map "admin" to "kabodbiblecollege@gmail.com"

            const adminEmail = email === 'admin' ? 'kabodbiblecollege@gmail.com' : email;

            await signInWithEmailAndPassword(auth, adminEmail, password);
            // Wait for AuthStateListener in App.js to trigger redirect
            navigate('/admin/dashboard');
        } catch (error) {
            console.error("Login failed:", error);
            // Give more specific feedback if possible, or stick to generic for security
            // Firebase error codes: auth/user-not-found, auth/wrong-password
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                toast.error("Invalid Email or Password. Please check and try again.");
            } else {
                toast.error("Login failed: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--light-grey)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
                <div className="text-center" style={{ marginBottom: '32px' }}>
                    <div style={{
                        background: 'var(--sky-blue)',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px auto'
                    }}>
                        <Lock size={30} color="var(--primary-blue)" />
                    </div>
                    <h2>Admin Login</h2>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Username / Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin or kabodbiblecollege@gmail.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{ paddingRight: '40px' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--text-grey)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '4px'
                                }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full flex-center"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
