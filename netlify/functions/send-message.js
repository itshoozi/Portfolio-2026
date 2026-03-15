const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, phone, message } = data;

    const smtpHost = "mail.spacemail.com";
    const smtpPort = 465;
    const smtpUser = "hey@jeremypringle.com";
    const smtpPass = process.env.SMTP_PASSWORD;

    if (!smtpPass) {
      throw new Error("SMTP_PASSWORD environment variable is not set");
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // 1. Send notification to Jeremy (You)
    await transporter.sendMail({
      from: `"Portfolio Inquiry" <${smtpUser}>`,
      to: smtpUser,
      subject: `New Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0066cc;">New Portfolio Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            ${message}
          </div>
        </div>
      `,
    });

    // 2. Send automated receipt to the user
    await transporter.sendMail({
      from: `"Jeremy Pringle" <${smtpUser}>`,
      to: email,
      replyTo: smtpUser,
      subject: `Got your message!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
          <p>Hi ${name.split(' ')[0]},</p>
          <p>Thanks for reaching out! This is just an automated confirmation to let you know I've received your inquiry.</p>
          <p>I usually respond within 24 hours. Looking forward to chatting!</p>
          <p>Best,<br><strong>Jeremy Pringle</strong></p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Message sent successfully" }),
    };
  } catch (error) {
    console.error("Message Error: ", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Failed to send message", details: error.message }) 
    };
  }
};
