import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav style={{
            background: 'var(--white)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{
                height: '70px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Logo */}
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--primary-blue)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '20px'
                    }}>
                        TS
                    </div>
                    <span style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        fontSize: '20px',
                        color: 'var(--primary-blue)'
                    }}>
                        Trauma Workshop by KABOD BIBLE COLLEGE
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu" style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            style={{
                                textDecoration: 'none',
                                color: isActive(link.path) ? 'var(--primary-blue)' : 'var(--text-grey)',
                                fontWeight: isActive(link.path) ? 600 : 500,
                                transition: 'color 0.3s'
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/register" className="btn-primary">
                        Register Now
                    </Link>
                    <Link to="/admin" className="btn-primary">
                        Login
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="mobile-toggle" onClick={toggleMenu} style={{ cursor: 'pointer', display: 'none' }}>
                    {isOpen ? <X color="var(--primary-blue)" /> : <Menu color="var(--primary-blue)" />}
                </div>
            </div>

            {/* Mobile Menu Content (Hidden by default via CSS media queries, implemented inline here for simplicity) */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '70px',
                    left: 0,
                    right: 0,
                    background: 'white',
                    padding: '20px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            style={{
                                textDecoration: 'none',
                                color: isActive(link.path) ? 'var(--primary-blue)' : 'var(--text-dark)',
                                fontWeight: 600,
                                fontSize: '18px'
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>
                        Register Now
                    </Link>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
        </nav>
    );
};

export default Navbar;
