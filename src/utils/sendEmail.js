import emailjs from 'emailjs-com';

/**
 * Send email using EmailJS.
 * 
 * @param {object} variables - Template variables (to_email, to_name, etc.)
 * @param {object} config - EmailJS configuration (serviceId, templateId, publicKey)
 */
export const sendEmail = async (variables, config) => {
    try {
        const { serviceId, templateId, publicKey } = config;

        if (!serviceId || !templateId || !publicKey) {
            throw new Error('EmailJS configuration missing. Please check Settings.');
        }

        const response = await emailjs.send(
            serviceId,
            templateId,
            variables,
            publicKey
        );

        console.log("EmailJS Success:", response.status, response.text);
        return response;

    } catch (error) {
        console.error("EmailJS Error:", error);
        throw error;
    }
};
