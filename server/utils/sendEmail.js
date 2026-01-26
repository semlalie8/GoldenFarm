/**
 * Email notification utility
 * Logs to console for admin audit.
 * Real emails are handled by frontend EmailJS for standard templates.
 */
const sendEmail = async (options) => {
    // 1. Log to console (Simulation/Logging for Admin)
    console.log('----------------------------------------------------');
    console.log('📧 NOTIFICATION LOGGED');
    console.log(`To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: ${options.message}`);
    console.log('----------------------------------------------------');

    return { success: true, message: 'Logged to console' };
};

export default sendEmail;
