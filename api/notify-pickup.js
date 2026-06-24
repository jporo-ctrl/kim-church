// api/notify-pickup.js
// Sends SMS to today's registered attendants when a child is checked out

const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { childName, parentName, parentPhone, pickupCode, eventDate } = req.body;

  if (!childName || !parentName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    // Get all attendants registered for today
    const today = eventDate || new Date().toISOString().split('T')[0];
    const { data: attendants, error } = await supabase
      .from('kim_attendants')
      .select('name, phone')
      .eq('event_date', today);

    if (error) throw error;

    if (!attendants || attendants.length === 0) {
      console.log('No attendants registered for today');
      return res.status(200).json({ message: 'No attendants found', sent: 0 });
    }

    const message = `🚨 KIM Children's Ministry\n\n${parentName} is picking up ${childName}.\nCode: ${pickupCode}\nParent phone: ${parentPhone}\n\nPlease verify and release.`;

    // Send SMS to each attendant
    const sends = attendants.map(att =>
      twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: att.phone.startsWith('+') ? att.phone : `+1${att.phone.replace(/\D/g, '')}`
      })
    );

    await Promise.all(sends);

    return res.status(200).json({ message: 'Notifications sent', sent: attendants.length });

  } catch (err) {
    console.error('notify-pickup error:', err);
    return res.status(500).json({ error: err.message });
  }
};
