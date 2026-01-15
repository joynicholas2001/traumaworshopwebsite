import { Calendar, Clock, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Home = () => {
    const [workshopDetails, setWorkshopDetails] = useState({
        title: "Online Trauma Sensitization Workshop",
        date: "24-01-2025",
        time: "08:30 PM",
        bannerUrl: null // Could be a placeholder image URL
    });

    useEffect(() => {
        // Fetch workshop details from Firestore 'settings' collection
        const fetchSettings = async () => {
            try {
                const settingsRef = doc(db, 'settings', 'workshop');
                const docSnap = await getDoc(settingsRef);
                if (docSnap.exists()) {
                    setWorkshopDetails(prev => ({ ...prev, ...docSnap.data() }));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, var(--sky-blue) 0%, var(--white) 100%)',
                padding: '80px 0',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <span style={{
                            background: 'rgba(26, 115, 232, 0.1)',
                            color: 'var(--primary-blue)',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: 600,
                            display: 'inline-block',
                            marginBottom: '24px'
                        }}>
                            Join Us Online
                        </span>
                        <h1 style={{ fontSize: '48px', lineHeight: 1.2, marginBottom: '24px' }}>
                            {workshopDetails.title}
                        </h1>
                        <p style={{ fontSize: '18px', color: 'var(--text-grey)', marginBottom: '32px' }}>
                            A comprehensive workshop designed to equip you with the knowledge and tools to understand and support those affected by trauma.
                        </p>

                        <div className="flex-center" style={{ gap: '16px', flexWrap: 'wrap' }}>
                            <Link to="/register" className="btn-primary" style={{ padding: '16px 32px', fontSize: '18px' }}>
                                Register Now <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workshop Details Card */}
            <section style={{ marginTop: '-60px', paddingBottom: '60px', position: 'relative', zIndex: 10 }}>
                <div className="container">
                    <div className="card">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            flexWrap: 'wrap',
                            gap: '24px',
                            alignItems: 'center',
                            marginBottom: '32px'
                        }}>
                            <div className="flex-center" style={{ gap: '12px' }}>
                                <div style={{ background: 'var(--sky-blue)', padding: '12px', borderRadius: '50%' }}>
                                    <Calendar color="var(--primary-blue)" size={24} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-grey)' }}>Date</div>
                                    <div style={{ fontWeight: 600 }}>{workshopDetails.date}</div>
                                </div>
                            </div>

                            <div className="flex-center" style={{ gap: '12px' }}>
                                <div style={{ background: 'var(--sky-blue)', padding: '12px', borderRadius: '50%' }}>
                                    <Clock color="var(--primary-blue)" size={24} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-grey)' }}>Time</div>
                                    <div style={{ fontWeight: 600 }}>{workshopDetails.time}</div>
                                </div>
                            </div>

                            <div className="flex-center" style={{ gap: '12px' }}>
                                <div style={{ background: 'var(--sky-blue)', padding: '12px', borderRadius: '50%' }}>
                                    <MapPin color="var(--primary-blue)" size={24} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', color: 'var(--text-grey)' }}>Location</div>
                                    <div style={{ fontWeight: 600 }}>Online (Zoom/Meet)</div>
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
                            <p style={{ fontSize: '18px', color: 'var(--primary-blue)', lineHeight: '1.6', fontWeight: 500 }}>
                                Mrs. Jean George is a M.Phil-trained Psychiatric Social Worker from NIMHANS, Bangalore, with 20+ years of experience in psychosocial counselling, trauma-informed interventions and support in clinical and community settings.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Topics Section */}
            <section style={{ padding: '60px 0' }}>
                <div className="container">
                    <div className="grid-responsive" style={{ alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '36px', marginBottom: '24px' }}>What You Will Learn</h2>
                            <ul style={{ listStyle: 'none' }}>
                                {[
                                    "Understanding the impact of trauma on individuals",
                                    "Identifying signs and symptoms",
                                    "Practical support strategies",
                                    "Building resilience and recovery",
                                    "Role of faith and community in healing"
                                ].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', fontSize: '18px' }}>
                                        <CheckCircle color="var(--success)" size={24} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{
                            background: 'var(--light-grey)',
                            height: '400px',
                            borderRadius: 'var(--radius-lg)',
                            backgroundImage: workshopDetails.bannerUrl ? `url(${workshopDetails.bannerUrl})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {!workshopDetails.bannerUrl && <p style={{ color: 'var(--text-grey)' }}>Workshop Banner</p>}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
