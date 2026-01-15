import { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Phone, Mail, Home } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        whatsappNumber: '',
        church: '',
        email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!formData.fullName.trim()) return "Full Name is required";
        if (!formData.whatsappNumber.trim()) return "WhatsApp Number is required";
        if (!formData.church.trim()) return "Church/Organization is required";
        if (!formData.email.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(formData.email)) return "Email is invalid";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const error = validate();
        if (error) {
            toast.error(error);
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'registrants'), {
                ...formData,
                createdAt: serverTimestamp()
            });
            toast.success("Registration successful!");
            navigate('/thank-you');
        } catch (err) {
            console.error("Error registering:", err);
            toast.error("Failed to register. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '80px 0', minHeight: 'calc(100vh - 200px)' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="card">
                    <div className="text-center" style={{ marginBottom: '32px' }}>
                        <h2 style={{ marginBottom: '8px' }}>Secure Your Spot</h2>
                        <p style={{ color: 'var(--text-grey)' }}>Fill out the form below to register for the workshop.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Full Name <span style={{ color: 'var(--error)' }}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <User size={20} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-grey)' }} />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>WhatsApp Number <span style={{ color: 'var(--error)' }}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={20} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-grey)' }} />
                                <input
                                    type="tel"
                                    name="whatsappNumber"
                                    value={formData.whatsappNumber}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 8900"
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Church / Organization <span style={{ color: 'var(--error)' }}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <Home size={20} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-grey)' }} />
                                <input
                                    type="text"
                                    name="church"
                                    value={formData.church}
                                    onChange={handleChange}
                                    placeholder="Grace Community Church"
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email Address <span style={{ color: 'var(--error)' }}>*</span></label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-grey)' }} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full flex-center"
                            disabled={loading}
                            style={{ opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
