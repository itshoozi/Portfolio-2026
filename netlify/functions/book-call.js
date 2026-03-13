exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, phone, location, date, time } = data;

    // To make this fully functional, add 'RESEND_API_KEY' to your Netlify Environment Variables.
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      // 1. Send notification to Jeremy (You)
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "booking@jeremypringle.com", // This requires a verified domain in Resend
          to: "hey@jeremypringle.com",
          subject: `New Booking: ${name} (${date} at ${time})`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2 style="color: #0066cc;">New Call Booking</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Type:</strong> ${location === 'virtual' ? 'Virtual Call' : 'In Person (Coffee / Office)'}</p>
              <p><strong>Date & Time:</strong> ${date} at ${time}</p>
            </div>
          `
        })
      });

      // 2. Send confirmation to the user
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Jeremy Pringle <booking@jeremypringle.com>",
          reply_to: "hey@jeremypringle.com",
          to: email,
          subject: `Booking Confirmed: Let's chat!`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <p>Hey ${name.split(' ')[0]},</p>
              <p>Thanks for booking some time with me!</p>
              <p>I have you down for a <strong>${location === 'virtual' ? 'Virtual Call' : 'In-Person Meeting'}</strong> on <strong>${date} at ${time}</strong>.</p>
              <p>I'll be reaching out shortly to confirm the details. If you have any specific requests or need to change anything before then, just reply directly to this email.</p>
              <p>Talk soon,<br>Jeremy Pringle</p>
            </div>
          `
        })
      });
    } else {
      console.log('No RESEND_API_KEY detected. Simulating successful booking email process.');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Booking processed successfully", data }),
    };
  } catch (error) {
    console.error("Booking Error: ", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Booking Failed" }) };
  }
};
