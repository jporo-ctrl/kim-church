const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');
const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { full_name, phone, email, how_heard } = req.body;
  if (!full_name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error: dbError } = await supabase.from('kim_vision_guests').insert({
      full_name: full_name.trim(), phone: phone.trim(),
      email: email?.trim() || null, how_heard: how_heard?.trim() || null,
      event: 'vision_night', event_date: '2026-06-27',
      registered_at: new Date().toISOString()
    });
    if (dbError) throw dbError;

    const firstName = full_name.trim().split(' ')[0];

    // SMS confirmation
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const toPhone = cleanPhone.startsWith('1') ? '+' + cleanPhone : '+1' + cleanPhone;
      await twilioClient.messages.create({
        body: 'Hey ' + firstName + '! You\'re registered for KIM Vision Night\n\nSaturday, June 27 | 6-8 PM\nCompass Center, 4201 Pool Rd, Grapevine TX\n\nCome ready - something is being born.\n- Apostle Joshua & KIM',
        from: process.env.TWILIO_PHONE_NUMBER,
        to: toPhone
      });
    } catch (smsErr) {
      console.warn('SMS failed:', smsErr.message);
    }

    // Email confirmation to guest
    if (email) {
      try {
        await resend.emails.send({
          from: 'Kingdom Insights Ministries <info@kim.church>',
          to: email.trim(),
          subject: 'You\'re registered for Vision Night',
          html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1A1613;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C8922A;margin-bottom:24px;">Kingdom Insights Ministries</p>
            <h1 style="font-size:32px;font-weight:600;line-height:1.2;margin-bottom:16px;">You're registered, ${firstName}.</h1>
            <p style="font-size:16px;line-height:1.8;color:#6B6560;">We're expecting you at <strong style="color:#1A1613;">Vision Night</strong> — come ready, because something is being born.</p>
            <div style="margin:32px 0;padding:24px;background:#FBF4E8;border-left:3px solid #C8922A;">
              <p style="font-size:14px;color:#1A1613;margin:0 0 8px;"><strong>Saturday, June 27, 2026</strong></p>
              <p style="font-size:14px;color:#6B6560;margin:0 0 4px;">6:00 - 8:00 PM</p>
              <p style="font-size:14px;color:#6B6560;margin:0;">Compass Center · 4201 Pool Rd, Grapevine TX</p>
            </div>
            <p style="font-size:15px;line-height:1.8;color:#6B6560;">Bring someone with you. There is a place here for everyone.</p>
            <p style="font-size:13px;color:#6B6560;margin-top:32px;">— Apostle Joshua & Kingdom Insights Ministries<br>kim.church</p>
          </div>`
        });
      } catch (emailErr) {
        console.warn('Email failed:', emailErr.message);
      }
    }

    // Admin notification
    try {
      await resend.emails.send({
        from: 'KIM Registration <info@kim.church>',
        to: 'joshuaporo@gmail.com',
        subject: 'New Vision Night registration: ' + full_name,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
          <h2 style="color:#C8922A;">New Vision Night Guest</h2>
          <table style="width:100%;font-size:14px;">
            <tr><td style="padding:8px 0;color:#666;">Name</td><td style="font-weight:600;">${full_name}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Phone</td><td>${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Email</td><td>${email || 'Not provided'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">How heard</td><td>${how_heard || 'Not specified'}</td></tr>
          </table>
        </div>`
      });
    } catch (adminErr) {
      console.warn('Admin email failed:', adminErr.message);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('vision-register error:', err);
    return res.status(500).json({ error: err.message });
  }
};
