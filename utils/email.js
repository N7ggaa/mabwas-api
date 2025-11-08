import nodemailer from 'nodemailer';

// TODO: Replace with a real email service
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'maddison53@ethereal.email',
        pass: 'jn7jnAPss4f63QBp6D'
    }
});

export default transporter;