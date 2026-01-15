const Footer = () => {
    return (
        <footer style={{
            background: 'var(--white)',
            borderTop: '1px solid #E5E7EB',
            padding: '40px 0',
            marginTop: '60px'
        }}>
            <div className="container text-center">
                <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Online Trauma Sensitization Workshop</h3>
                <h4 style={{ fontSize: '18px', marginBottom: '16px' }}>Organized by KABOD BIBLE COLLEGE</h4>
                <p style={{ color: 'var(--text-grey)', marginBottom: '24px' }}>
                    Empowering communities through understanding and healing.
                </p>
                <div style={{ fontSize: '14px', color: 'var(--text-grey)' }}>
                    &copy; {new Date().getFullYear()} Trauma Workshop. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

