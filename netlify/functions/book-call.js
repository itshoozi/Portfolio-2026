const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, phone, location, date, time, message } = data;

    // SMTP Credentials - Best to set these in Netlify Env Vars
    const smtpHost = "mail.spacemail.com";
    const smtpPort = 465;
    const smtpUser = "hey@jeremypringle.com";
    // We try to get the password from Env Vars first, fallback to provided one for immediate fix
    const smtpPass = process.env.SMTP_PASSWORD || "33b1A42a-eb26-4D22-be3e-abCA855B96B3";

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: true, // Use SSL
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Helper to generate a simple ICS file
    const generateICS = (name, date, time, location) => {
      const start = new Date(`${date} ${time}, 2026`).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const end = new Date(new Date(`${date} ${time}, 2026`).getTime() + 15*60000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Jeremy Pringle//Booking//EN',
        'BEGIN:VEVENT',
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:Jeremy Pringle x ${name}`,
        `DESCRIPTION:Discussion about: ${message || 'New project collaboration'}`,
        `LOCATION:${location === 'virtual' ? 'Google Meet (Link will be sent)' : 'In Person (Rochester, MN)'}`,
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
    };

    const icsContent = generateICS(name, date, time, location);

    // 1. Send notification to Jeremy (You)
    await transporter.sendMail({
      from: `"Portfolio Booking" <${smtpUser}>`,
      to: smtpUser,
      subject: `New Booking: ${name} (${date} at ${time})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #0066cc;">New Call Booking</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Type:</strong> ${location === 'virtual' ? 'Virtual Call' : 'In Person'}</p>
          <p><strong>Date & Time:</strong> ${date} at ${time}</p>
          <p><strong>Notes:</strong> ${message || 'None'}</p>
        </div>
      `,
    });

    // 2. Send confirmation + Calendar Invite to the user
    await transporter.sendMail({
      from: `"Jeremy Pringle" <${smtpUser}>`,
      to: email,
      replyTo: smtpUser,
      subject: `Confirmed: Jeremy Pringle x ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; line-height: 1.6;">
          <p>Hey ${name.split(' ')[0]},</p>
          <p>Thanks for booking some time with me! I've attached a calendar invite to this email for your convenience.</p>
          <p><strong>Meeting Details:</strong></p>
          <ul>
            <li><strong>Type:</strong> ${location === 'virtual' ? 'Virtual Call' : 'In-Person Meeting'}</li>
            <li><strong>When:</strong> ${date} at ${time}</li>
          </ul>
          <p>I'll be reaching out shortly to confirm the final details. If you need to reschedule, just reply to this email.</p>
          <p>See you then,<br><strong>Jeremy Pringle</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: 'invite.ics',
          content: icsContent,
          contentType: 'text/calendar',
        },
      ],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Booking confirmed with calendar invite", data }),
    };
  } catch (error) {
    console.error("Booking Error: ", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Booking Failed", details: error.message }) 
    };
  }
};
