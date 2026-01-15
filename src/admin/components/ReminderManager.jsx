import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, addDoc, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { sendEmail } from '../../utils/sendEmail';
import { toast } from 'react-toastify';
import { Send, Users, Mail, Info, CheckCircle, AlertCircle } from 'lucide-react';

const ReminderManager = () => {
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        lastSent: null,
        lastSentCount: 0
    });

    const [emailConfig, setEmailConfig] = useState(null);
    const [registrants, setRegistrants] = useState([]);
    const [workshopSettings, setWorkshopSettings] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Get Workshop Settings & Email Config
            const settingsSnap = await getDoc(doc(db, 'settings', 'workshop'));
            if (settingsSnap.exists()) {
                const data = settingsSnap.data();
                setWorkshopSettings(data);

                if (data.emailjsServiceId && data.emailjsTemplateId && data.emailjsPublicKey) {
                    setEmailConfig({
                        serviceId: data.emailjsServiceId,
                        templateId: data.emailjsTemplateId,
                        publicKey: data.emailjsPublicKey
                    });
                }
            }

            // 2. Get All Registrants
            const regSnap = await getDocs(collection(db, 'registrants'));
            const regList = regSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRegistrants(regList);

            // 3. Get Last Sent Log
            const logsQ = query(
                collection(db, 'reminder_logs'),
                orderBy('sentAt', 'desc'),
                limit(1)
            );
            const logsSnap = await getDocs(logsQ);

            let lastSent = null;
            let lastSentCount = 0;

            if (!logsSnap.empty) {
                const logData = logsSnap.docs[0].data();
                lastSent = logData.sentAt;
                lastSentCount = logData.recipientCount;
            }

            setStats({
                total: regList.length,
                lastSent,
                lastSentCount
            });

            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    const handleBulkSend = async () => {
        if (!emailConfig) {
            toast.error("Please configure EmailJS in Settings first!");
            return;
        }

        if (registrants.length === 0) {
            toast.warn("No registrants found to send emails to.");
            return;
        }

        if (!window.confirm(`Are you sure you want to send a bulk email to ALL ${registrants.length} registrants?`)) {
            return;
        }

        setSending(true);
        let successCount = 0;
        let lastError = null;

        try {
            const promises = registrants.map(async (user) => {
                if (user.email) {
                    try {
                        await sendEmail({
                            to_email: user.email,
                            to_name: user.fullName || 'Participant',
                            workshop_date: workshopSettings?.date || 'Upcoming Date',
                            meeting_link: workshopSettings?.meetingLink || "Link in Dashboard"
                        }, emailConfig);
                        return true;
                    } catch (e) {
                        console.error(`Failed to send to ${user.email}`, e);
                        lastError = e?.text || e?.message || "Unknown Error";
                        return false;
                    }
                }
                return false;
            });

            const results = await Promise.all(promises);
            successCount = results.filter(r => r).length;

            // Log the bulk send
            await addDoc(collection(db, 'reminder_logs'), {
                type: 'bulk_broadcast',
                sentAt: Timestamp.now(),
                recipientCount: successCount,
                workshopDate: workshopSettings?.date || 'manual'
            });

            if (successCount > 0) {
                toast.success(`Successfully broadcasted to ${successCount} registrants!`);
                if (successCount < registrants.length) {
                    toast.warn(`${registrants.length - successCount} emails failed to send.`);
                }
            } else {
                toast.error(`Broadcast failed: ${lastError}`);
                toast.info("Please check your EmailJS settings and template names.");
            }

            fetchData();
        } catch (error) {
            console.error("Bulk send error:", error);
            toast.error("An error occurred during bulk send.");
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary-blue)', borderRadius: '50%' }}></div>
        </div>
    );

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '28px', color: 'var(--text-dark)', marginBottom: '8px' }}>Bulk Email Broadcaster</h2>
                    <p style={{ color: 'var(--text-grey)' }}>Send workshop details and meeting links to all registrants at once.</p>
                </div>
                <div style={{ background: 'var(--sky-blue)', padding: '12px 24px', borderRadius: '16px', textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: 'var(--primary-blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audience</div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--primary-blue)' }}>{stats.total} Registrants</div>
                </div>
            </div>

            <div className="grid-responsive" style={{ gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Main Sender Section */}
                <div className="card" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--sky-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Mail size={20} color="var(--primary-blue)" />
                        </div>
                        <h3 style={{ fontSize: '20px', margin: 0 }}>Message Preview</h3>
                    </div>

                    <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
                        <div style={{ padding: '16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                            <div style={{ fontSize: '14px', color: 'var(--text-grey)', marginBottom: '4px' }}>Subject</div>
                            <div style={{ fontWeight: 600 }}>{workshopSettings?.emailSubject || 'Workshop Invitation'}</div>
                        </div>
                        <div style={{ padding: '24px', minHeight: '150px', fontSize: '15px', lineHeight: '1.6' }}>
                            <p>Hi [Participant Name],</p>
                            <p>{workshopSettings?.emailBody || 'Thank you for registering for our workshop!'}</p>
                            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--sky-blue)', borderRadius: '8px', border: '1px dashed var(--primary-blue)' }}>
                                <div style={{ fontWeight: 600, color: 'var(--primary-blue)', marginBottom: '4px' }}>Meeting Details</div>
                                <div style={{ fontSize: '14px' }}><strong>Date:</strong> {workshopSettings?.date || 'TBD'}</div>
                                <div style={{ fontSize: '14px' }}><strong>Link:</strong> {workshopSettings?.meetingLink || 'To be shared'}</div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn-primary w-full"
                        style={{ marginTop: '32px', height: '56px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
                        onClick={handleBulkSend}
                        disabled={sending || registrants.length === 0}
                    >
                        {sending ? (
                            <>Sending to {registrants.length} users...</>
                        ) : (
                            <>
                                <Send size={20} />
                                Broadcast to All Registrants
                            </>
                        )}
                    </button>

                    {registrants.length === 0 && (
                        <p style={{ color: 'var(--error)', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>
                            <AlertCircle size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            You need at least one registrant to send an email.
                        </p>
                    )}
                </div>

                {/* Sidebar Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '24px' }}>
                        <h4 style={{ fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Info size={18} color="var(--primary-blue)" /> History
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ fontSize: '14px' }}>
                                <div style={{ color: 'var(--text-grey)', marginBottom: '4px' }}>Last Broadcast</div>
                                <div style={{ fontWeight: 600 }}>
                                    {stats.lastSent ? new Date(stats.lastSent.seconds * 1000).toLocaleDateString() : 'Never'}
                                </div>
                            </div>
                            <div style={{ fontSize: '14px' }}>
                                <div style={{ color: 'var(--text-grey)', marginBottom: '4px' }}>Recipients</div>
                                <div style={{ fontWeight: 600 }}>{stats.lastSentCount} users</div>
                            </div>
                            {stats.lastSent && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontSize: '13px', marginTop: '8px' }}>
                                    <CheckCircle size={16} /> Successfully Delivered
                                </div>
                            )}
                        </div>
                    </div>

                    {!emailConfig && (
                        <div className="card" style={{ padding: '24px', border: '1px solid #FECACA', background: '#FEF2F2' }}>
                            <h4 style={{ fontSize: '16px', color: '#B91C1C', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={18} /> Configuration Required
                            </h4>
                            <p style={{ fontSize: '13px', color: '#991B1B', lineHeight: '1.5' }}>
                                EmailJS credentials are missing. Please go to Settings to configure your API keys.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReminderManager;
