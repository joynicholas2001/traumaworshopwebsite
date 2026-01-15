import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, updateDoc, doc, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Trash2, Search, Download, Send, CheckSquare, Square, Edit, MessageCircle, X, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { sendEmail } from '../../utils/sendEmail';

const Registrants = () => {
    const [registrants, setRegistrants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'registrants'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRegistrants(data);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this registrant?")) {
            try {
                await deleteDoc(doc(db, 'registrants', id));
                toast.success("Registrant deleted");
            } catch (error) {
                toast.error("Error deleting registrant");
            }
        }
    };

    const handleEditClick = (user) => {
        setEditingUser({ ...user });
    };

    const handleEditSave = async (e) => {
        e.preventDefault();
        try {
            const userRef = doc(db, 'registrants', editingUser.id);
            const { id, ...dataToUpdate } = editingUser; // Exclude ID from update

            // Should verify if createdAt is a Timestamp object, it might be if coming from Firestore, 
            // but we don't want to update it improperly. safest is to exclude it or just let it be if it's not changed.
            // Firestore ignores undefined fields, but let's be safe.
            // Ideally we only update the editable fields.
            const updatePayload = {
                fullName: dataToUpdate.fullName,
                email: dataToUpdate.email,
                whatsappNumber: dataToUpdate.whatsappNumber,
                church: dataToUpdate.church
            };

            await updateDoc(userRef, updatePayload);
            toast.success("Registrant updated successfully");
            setEditingUser(null);
        } catch (error) {
            console.error("Error updating:", error);
            toast.error("Failed to update registrant");
        }
    };

    const openWhatsApp = (number, name) => {
        if (!number) return;
        // Simple cleanup: remove spaces, dashes, parens
        const cleanNumber = number.replace(/[^\d+]/g, '');
        const message = encodeURIComponent(`Hello ${name}, greetings from the Online Trauma Sensitization Workshop!`);
        window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    };

    const toggleSelect = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === registrants.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(registrants.map(r => r.id));
        }
    };

    const handleExport = () => {
        const headers = ["Full Name", "WhatsApp", "Email", "Church", "Date Registered"];
        const csvContent = [
            headers.join(','),
            ...registrants.map(r => [
                `"${r.fullName}"`,
                `"${r.whatsappNumber}"`,
                `"${r.email}"`,
                `"${r.church}"`,
                `"${r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : 'N/A'}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "workshop_registrants.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const sendMeetingLink = async (targetIds) => {
        if (targetIds.length === 0) return;
        setSendingEmail(true);
        let successCount = 0;

        for (const id of targetIds) {
            const user = registrants.find(r => r.id === id);
            if (user && user.email) {
                try {
                    await sendEmail('meeting_link_template', {
                        to_email: user.email,
                        to_name: user.fullName,
                        meeting_link: "https://zoom.us/j/123456789"
                    });
                    successCount++;
                } catch (error) {
                    console.error(`Failed to send to ${user.email}`);
                }
            }
        }

        setSendingEmail(false);
        toast.success(`Emails sent to ${successCount} users`);
        setSelectedIds([]);
    };

    const filteredRegistrants = registrants.filter(r =>
        r.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.church?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px' }}>Registrants ({registrants.length})</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleExport} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '14px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Download size={16} /> Export CSV
                    </button>
                    <button
                        onClick={() => sendMeetingLink(selectedIds)}
                        disabled={selectedIds.length === 0 || sendingEmail}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '14px', opacity: selectedIds.length === 0 ? 0.5 : 1 }}
                    >
                        <Send size={16} /> Send Link ({selectedIds.length})
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
                <div style={{ marginBottom: '16px', position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-grey)' }} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or church..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '40px' }}
                    />
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'var(--light-grey)', textAlign: 'left' }}>
                                <th style={{ padding: '12px', width: '40px' }}>
                                    <div onClick={toggleSelectAll} style={{ cursor: 'pointer' }}>
                                        {registrants.length > 0 && selectedIds.length === registrants.length ? <CheckSquare size={20} color="var(--primary-blue)" /> : <Square size={20} color="var(--text-grey)" />}
                                    </div>
                                </th>
                                <th style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-grey)' }}>Name</th>
                                <th style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-grey)' }}>Contact</th>
                                <th style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-grey)' }}>Church</th>
                                <th style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-grey)' }}>Reg. Date</th>
                                <th style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: 'var(--text-grey)', textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center" style={{ padding: '24px' }}>Loading...</td></tr>
                            ) : filteredRegistrants.length === 0 ? (
                                <tr><td colSpan="6" className="text-center" style={{ padding: '24px' }}>No registrants found</td></tr>
                            ) : (
                                filteredRegistrants.map((r) => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                        <td style={{ padding: '12px' }}>
                                            <div onClick={() => toggleSelect(r.id)} style={{ cursor: 'pointer' }}>
                                                {selectedIds.includes(r.id) ? <CheckSquare size={20} color="var(--primary-blue)" /> : <Square size={20} color="var(--text-grey)" />}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px', fontWeight: 500 }}>{r.fullName}</td>
                                        <td style={{ padding: '12px', fontSize: '14px' }}>
                                            <div>{r.email}</div>
                                            <div style={{ color: 'var(--text-grey)' }}>{r.whatsappNumber}</div>
                                        </td>
                                        <td style={{ padding: '12px' }}>{r.church}</td>
                                        <td style={{ padding: '12px', color: 'var(--text-grey)', fontSize: '14px' }}>
                                            {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : 'Just now'}
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button
                                                    onClick={() => openWhatsApp(r.whatsappNumber, r.fullName)}
                                                    style={{ background: 'transparent', color: '#25D366', padding: '4px', border: 'none', cursor: 'pointer' }}
                                                    title="Chat on WhatsApp"
                                                >
                                                    <MessageCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(r)}
                                                    style={{ background: 'transparent', color: 'var(--primary-blue)', padding: '4px', border: 'none', cursor: 'pointer' }}
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(r.id)}
                                                    style={{ background: 'transparent', color: 'var(--error)', padding: '4px', border: 'none', cursor: 'pointer' }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '24px', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Edit Registrant</h3>
                            <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-grey)' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSave}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Full Name</label>
                                <input
                                    type="text"
                                    value={editingUser.fullName}
                                    onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Email Address</label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>WhatsApp Number</label>
                                <input
                                    type="text"
                                    value={editingUser.whatsappNumber}
                                    onChange={e => setEditingUser({ ...editingUser, whatsappNumber: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>Church / Organization</label>
                                <input
                                    type="text"
                                    value={editingUser.church}
                                    onChange={e => setEditingUser({ ...editingUser, church: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="btn-secondary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    style={{ flex: 1, justifyContent: 'center' }}
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Registrants;
