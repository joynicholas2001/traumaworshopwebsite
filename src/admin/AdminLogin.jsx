import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
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
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
            toast.success("Welcome back!");
        } catch (error) {
            console.error("Login failed:", error);

            // Auto-create admin if not found (Development convenience)
            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                try {
                    // One last check: If we are calling this with the specific email the user wants
                    if (email === 'kabodbiblecollege@gmail.com') {
                        await createUserWithEmailAndPassword(auth, email, password);
                        navigate('/admin/dashboard');
                        toast.success("Admin account created and logged in!");
                        return;
                    }
                } catch (createError) {
                    console.error("Creation failed:", createError);
                    // If creation fails (e.g. wrong password for existing email), fall through to error toast
                }
            }

            if (error.code === 'auth/wrong-password') {
                toast.error("Incorrect Password.");
            } else if (error.code === 'auth/too-many-requests') {
                toast.error("Too many failed attempts. Try again later.");
            } else {
                toast.error("Login failed: " + error.code);
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
                        <label style={{ display: 'block', marginBottom: '8px' }}>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
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
                                placeholder="Enter your password"
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
