import emailjs from 'emailjs-com';

// Initialize with your user ID (you'd typically do this in init)
// emailjs.init("YOUR_USER_ID");

export const sendEmail = async (templateId, variables) => {
    try {
        // Placeholder Service ID and User ID. In production these should be config/env vars
        const SERVICE_ID = 'default_service';
        const TEMPLATE_ID = templateId;
        const USER_ID = 'YOUR_EMAILJS_USER_ID';

        // Mocking the call if no IDs provided to prevent crash
        if (USER_ID === 'YOUR_EMAILJS_USER_ID') {
            console.log("EmailJS Mock Send:", variables);
            return { status: 200, text: "Mock Success" };
        }

        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, variables, USER_ID);
        return response;
    } catch (error) {
        console.error("EmailJS Error:", error);
        throw error;
    }
};
