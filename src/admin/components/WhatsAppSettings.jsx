import { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { sendWhatsAppMessage } from '../../utils/sendWhatsapp';
import { toast } from 'react-toastify';
import { Save, Send } from 'lucide-react';

const WhatsAppSettings = () => {
    const [config, setConfig] = useState({
        apiToken: '',
        phoneNumberId: '',
        senderNumber: '',
        messageTemplate: "Hello {{name}}, reminder for {{workshopTitle}} on {{date}} at {{time}}. Join here: {{meetingLink}}"
    });
    const [workshopSettings, setWorkshopSettings] = useState({});
    const [sending, setSending] = useState(false);

    useEffect(() => {
        // Load config from LocalStorage for security/simplicity in this demo
        // Ideally should be in a secure backend or Firestore (if secured properly)
        // For this prompt, saving to Firestore 'settings/whatsapp' as requested
        const loadData = async () => {
            try {
                const waSnap = await getDoc(doc(db, 'settings', 'whatsapp'));
                if (waSnap.exists()) setConfig(prev => ({ ...prev, ...waSnap.data() }));

                const wsSnap = await getDoc(doc(db, 'settings', 'workshop'));
                if (wsSnap.exists()) setWorkshopSettings(wsSnap.data());
            } catch (e) {
                console.error(e);
            }
        };
        loadData();
    }, []);

    const handleChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const saveConfig = async (e) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'settings', 'whatsapp'), config);
            // Also save to local storage for the utility to pick up easily
            window.localStorage.setItem('whatsapp_token', config.apiToken);
            window.localStorage.setItem('whatsapp_phone_id', config.phoneNumberId);
            toast.success("WhatsApp Config Saved");
        } catch (e) {
            toast.error("Failed to save config");
        }
    };

    const handleBroadcast = async () => {
        if (!window.confirm("Send WhatsApp message to ALL registrants? This cannot be undone.")) return;

        setSending(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'registrants'));
            const registrants = querySnapshot.docs.map(doc => doc.data());
            let count = 0;

            for (const reg of registrants) {
                if (reg.whatsappNumber) {
                    // Replace placeholders
                    let msg = config.messageTemplate
                        .replace('{{name}}', reg.fullName || 'Friend')
                        .replace('{{workshopTitle}}', workshopSettings.title || 'Workshop')
                        .replace('{{date}}', workshopSettings.date || '')
                        .replace('{{time}}', workshopSettings.time || '')
                        .replace('{{meetingLink}}', workshopSettings.meetingLink || '');

                    try {
                        await sendWhatsAppMessage(reg.whatsappNumber, msg);
                        count++;
                    } catch (err) {
                        console.error(`Failed to send WA to ${reg.whatsappNumber}`);
                    }
                }
            }
            toast.success(`Sent WhatsApp to ${count} registrants`);

        } catch (err) {
            console.error(err);
            toast.error("Error during broadcast");
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '24px' }}>WhatsApp Integration</h2>

            <div className="card" style={{ maxWidth: '800px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Configuration</h3>
                <form onSubmit={saveConfig}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>API Token</label>
                        <input type="password" name="apiToken" value={config.apiToken} onChange={handleChange} placeholder="EAAG..." />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Phone Number ID</label>
                            <input type="text" name="phoneNumberId" value={config.phoneNumberId} onChange={handleChange} placeholder="105..." />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Sender Number (Display)</label>
                            <input type="text" name="senderNumber" value={config.senderNumber} onChange={handleChange} placeholder="+1555..." />
                        </div>
                    </div>

                    <button type="submit" className="btn-secondary">
                        <Save size={18} /> Save Configuration
                    </button>
                </form>
            </div>

            <div className="card" style={{ maxWidth: '800px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Broadcast Message</h3>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Message Template</label>
                    <p style={{ fontSize: '14px', color: 'var(--text-grey)', marginBottom: '8px' }}>
                        Available variables: {'{{name}}'}, {'{{workshopTitle}}'}, {'{{date}}'}, {'{{time}}'}, {'{{meetingLink}}'}
                    </p>
                    <textarea
                        name="messageTemplate"
                        value={config.messageTemplate}
                        onChange={handleChange}
                        rows="4"
                        style={{ width: '100%', padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    ></textarea>
                </div>

                <button
                    onClick={handleBroadcast}
                    className="btn-primary"
                    disabled={sending}
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <Send size={18} /> {sending ? 'Sending...' : 'Send WhatsApp Message to All Registrants'}
                </button>
            </div>
        </div>
    );
};

export default WhatsAppSettings;
