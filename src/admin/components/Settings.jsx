import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        title: '',
        date: '',
        time: '',
        meetingLink: '',
        bannerUrl: '',
        emailSubject: '',
        emailBody: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docSnap = await getDoc(doc(db, 'settings', 'workshop'));
                if (docSnap.exists()) {
                    setSettings(docSnap.data());
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching settings:", err);
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'workshop'), settings);
            toast.success("Settings saved successfully!");
        } catch (err) {
            console.error("Error saving settings:", err);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div>
            <h2 style={{ marginBottom: '24px' }}>Workshop Settings</h2>

            <div className="card" style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSave}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Workshop Title</label>
                            <input type="text" name="title" value={settings.title} onChange={handleChange} placeholder="Online Trauma Sensitization Workshop" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Banner Image URL</label>
                            <input type="text" name="bannerUrl" value={settings.bannerUrl || ''} onChange={handleChange} placeholder="https://..." />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Date</label>
                            <input type="date" name="date" value={settings.date} onChange={handleChange} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Time</label>
                            <input type="text" name="time" value={settings.time} onChange={handleChange} placeholder="10:00 AM - 02:00 PM" />
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Meeting Link</label>
                        <input type="text" name="meetingLink" value={settings.meetingLink} onChange={handleChange} placeholder="https://zoom.us/..." />
                    </div>

                    <div style={{ borderTop: '1px solid #E5E7EB', margin: '24px 0', padding: '24px 0 0 0' }}>
                        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Email Template</h3>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email Subject</label>
                            <input type="text" name="emailSubject" value={settings.emailSubject} onChange={handleChange} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email Body</label>
                            <textarea
                                name="emailBody"
                                value={settings.emailBody}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Content of the email to send with the meeting link..."
                                style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', fontFamily: 'Inter' }}
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={saving}>
                        <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
