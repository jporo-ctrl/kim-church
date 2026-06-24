const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { full_name, phone, email, how_heard } = req.body;
  if (!full_name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    const { error: dbError } = await supabase.from('kim_vision_guests').insert({
      full_name: full_name.trim(), phone: phone.trim(),
      email: email?.trim() || null, how_heard: how_heard?.trim() || null,
      event: 'vision_night', event_date: '2026-06-27',
      registered_at: new Date().toISOString()
    });
    if (dbError) throw dbError;

    const cleanPhone = phone.replace(/\D/g, '');
    const toPhone = cleanPhone.startsWith('1') ? '+' + cleanPhone : '+1' + cleanPhone;
    const firstName = full_name.trim().split(' ')[0];

    await twilioClient.messages.create({
      body: 'Hey ' + firstName + '! You\'re registered for KIM Vision Night \uD83D\uDE4C\n\n\uD83D\uDCC5 Friday, June 27\n\u23F0 6\u20138 PM\n\uD83D\uDCCD Compass Center\n   4201 Pool Rd, Grapevine, TX\n\nCome ready \u2014 something is being born. We\'ll see you there.\n\n\u2014 Apostle Joshua & Kingdom Insights Ministries',
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toPhone
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('vision-register error:', err);
    return res.status(500).json({ error: err.message });
  }
};
