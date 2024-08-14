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

        const transporter: Transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            service: process.env.SERVICE,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const { email, subject, template, data } = options
        // const { email, subject, htmls } = options



        // get the path to the email template
        // await ejs.renderFile(path.join(__dirname, "../mails/activation-email.ejs"), data)
        const templatePath = path.join(__dirname, "../mails/", template)


        // Render email template with ejs
        let html: string;
        try {
            html = await ejs.renderFile(templatePath, data);
            // html: htmls
            // console.log("html in sendmail =>", htmls);

        } catch (error: any) {
            throw new Error(`Failed to render email template: ${error.message}`);
        }


        // Header to send to user email
        const mailHeader = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject,
            html
        }

        // send the mail
        await transporter.sendMail(mailHeader)
    } catch (error: any) {

        console.error(`Failed to send email: ${error.message}`);
        throw new Error(`Email sending failed: ${error.message}`);
    }
};


export default sendMail