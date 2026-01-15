export const sendWhatsAppMessage = async (phoneNumber, message) => {
    try {
        // You would normally fetch these from your 'settings' collection in Firestore
        // For now using placeholders or checking local storage if you implement a settings provider
        const API_TOKEN = window.localStorage.getItem('whatsapp_token') || 'YOUR_WHATSAPP_TOKEN';
        const PHONE_NUMBER_ID = window.localStorage.getItem('whatsapp_phone_id') || 'YOUR_PHONE_ID';

        if (API_TOKEN === 'YOUR_WHATSAPP_TOKEN') {
            console.log("WhatsApp Mock Send:", { phoneNumber, message });
            return { success: true, mock: true };
        }

        const url = `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: phoneNumber, // Format: country code + number (e.g., 15550001000)
                type: "text",
                text: {
                    body: message
                }
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to send WhatsApp message');
        }
        return data;

    } catch (error) {
        console.error("WhatsApp API Error:", error);
        throw error;
    }
};
