const nodemailer = require('nodemailer');

const sendCompletionEmail = async (order) => {
    const emailSubject = 'Order Completed - Gujarati Divyang';
    const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #006400; text-align: center;">Order Completed! ✅</h2>
            <p>Dear <b>${order.name || 'Customer'}</b>,</p>
            <p>Your order for <b>${order.bottleSize}</b> hair oil has been marked as <b>Completed</b>.</p>
            <p>Your medicine will be safely developed and delivered within <b>7 days</b>.</p>
            <p>Total amount: ₹${order.total}</p>
            <hr/>
            <p>Thank you for choosing Gujarati Divyang!</p>
        </div>
    `;

    // PRIMARY: BREVO API
    if (process.env.BREVO_API_KEY) {
        try {
            console.log("[Email] Sending direct via Brevo API...");
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: { name: "Gujarati Divyang", email: process.env.EMAIL_USER || "divyang.softcolon@gmail.com" },
                    to: [{ email: order.email }],
                    subject: emailSubject,
                    htmlContent: emailHtml
                })
            });

            const result = await response.json();
            if (response.ok) {
                console.log("[Email] SUCCESS: Sent via Brevo API", result.messageId);
                return;
            }
            console.error("[Email] Brevo API Error:", result);
        } catch (e) {
            console.error("[Email] Brevo Connection Error:", e.message);
        }
    }

    // FALLBACK: GMAIL SMTP
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            console.log("[Email] Falling back to Gmail SMTP...");
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com', port: 587, secure: false,
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
                connectionTimeout: 3000, family: 4
            });
            await transporter.sendMail({
                from: process.env.EMAIL_USER, to: order.email,
                subject: emailSubject, html: emailHtml
            });
            console.log("[Email] SUCCESS: Sent via Gmail SMTP backup.");
        } catch (e) {
            console.error("[Email] CRITICAL: All email methods failed.", e.message);
        }
    } else if (!process.env.BREVO_API_KEY) {
        console.warn("[Email] ERROR: No email provider (Brevo or Gmail) is configured in environment variables.");
    }
};

module.exports = { sendCompletionEmail };
