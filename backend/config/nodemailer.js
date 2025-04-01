import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: "8929f7001@smtp-brevo.com",
        pass: "FxbpIwEDAzPN3BK8"
    }
});

export default transporter;