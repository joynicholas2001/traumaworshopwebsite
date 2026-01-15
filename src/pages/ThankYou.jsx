import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
    return (
        <div className="flex-center" style={{ minHeight: '80vh', padding: '20px' }}>
            <div className="card text-center" style={{ maxWidth: '500px', padding: '60px 40px' }}>
                <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto'
                }}>
                    <CheckCircle size={40} color="var(--success)" />
                </div>
                <h1 style={{ marginBottom: '16px' }}>Thank You!</h1>
                <p style={{ color: 'var(--text-grey)', fontSize: '18px', marginBottom: '32px' }}>
                    Your registration has been received successfully. We have sent a confirmation email to your inbox.
                </p>
                <Link to="/" className="btn-primary">
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ThankYou;
