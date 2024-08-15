require("dotenv").config()
import nodemailer, { Transporter } from "nodemailer"
import ejs from "ejs"
import path from "path"



interface EmailOptions {
    email: string
    subject: string
    // htmls: string
    template: string
    data: { [key: string]: any }
}


const sendMail = async (options: EmailOptions) => {
    try {
        // Create a transporter object using nodemailer with SMTP configuration
        const transporter: Transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // SMTP host (e.g., smtp.gmail.com)
            port: parseInt(process.env.SMTP_PORT || '587'), // SMTP port, defaulting to 587 if not provided
            service: process.env.SERVICE, // Email service provider (e.g., Gmail)
            auth: {
                user: process.env.SMTP_EMAIL, // Email address used to send emails
                pass: process.env.SMTP_PASSWORD // Password for the email account
            }
        });

        // Extract necessary details from the options object
        const { email, subject, template, data } = options;

        // Define the path to the email template file
        const templatePath = path.join(__dirname, "../mails/", template);

        // Render the email template with the provided data using ejs
        let html: string;
        try {
            html = await ejs.renderFile(templatePath, data);
        } catch (error: any) {
            // Handle any errors that occur during template rendering
            throw new Error(`Failed to render email template: ${error.message}`);
        }

        // Create the email header with the necessary details
        const mailHeader = {
            from: process.env.SMTP_EMAIL, // Sender's email address
            to: email, // Recipient's email address
            subject, // Email subject line
            html // Rendered HTML content of the email
        };

        // Send the email using the transporter object
        await transporter.sendMail(mailHeader);
    } catch (error: any) {
        // Log any errors that occur during the email sending process
        console.error(`Failed to send email: ${error.message}`);
        // Rethrow the error for further handling if needed
        throw new Error(`Email sending failed: ${error.message}`);
    }
};

export default sendMail;
