exports.handler = async (event, context) => {
  // Extract date from query params
  const { date } = event.queryStringParameters;
  
  if (!date) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'date' parameter." }),
    };
  }

  // Parse date request
  const requestDate = new Date(date);
  const dayOfWeek = requestDate.getUTCDay();

  // For weekends (0 = Sunday, 6 = Saturday), return empty availability
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return {
      statusCode: 200,
      body: JSON.stringify({ slots: [] }),
    };
  }

  // Fake availability from 8:00 AM to 4:00 PM for Jeremy Pringle
  // Simulate some randomized fully booked slots based on date for realism
  const seed = requestDate.getDate();
  const allSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:30 PM",
    "01:30 PM",
    "02:30 PM",
    "03:30 PM"
  ];
  
  // Deterministically remove a random slot based on the date to make it look "real"
  const availableSlots = allSlots.filter((slot, index) => {
     // E.g., if index % seed == 1, then the slot is booked. Simple fake logic.
     return index % 3 !== (seed % 3);
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // Allow local testing
    },
    body: JSON.stringify({
      date,
      slots: availableSlots,
    }),
  };
};
