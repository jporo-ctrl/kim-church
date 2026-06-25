const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');
const { Resend } = require('resend');
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers['x-admin-password'] !== 'KIM2026!') return res.status(401).json({ error: 'Unauthorized' });
  const { type, body, subject, event } = req.body;
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  try {
    let query = supabase.from('kim_checkins').select('*');
    if (event) query = query.eq('event', event);
    const { data: checkins, error } = await query;
    if (error) throw error;
    let sent = 0;
    if (type === 'sms') {
      const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      for (const g of checkins.filter(g => g.phone)) {
        try {
          const clean = g.phone.replace(/\D/g, '');
          const to = clean.startsWith('1') ? '+' + clean : '+1' + clean;
          await twilioClient.messages.create({ body, from: process.env.TWILIO_PHONE_NUMBER, to });
          sent++;
        } catch (e) { console.warn('SMS failed:', e.message); }
      }
    } else {
      const resend = new Resend(process.env.RESEND_API_KEY);
      for (const g of checkins.filter(g => g.email)) {
        try {
          await resend.emails.send({
            from: 'Kingdom Insights Ministries <info@kim.church>',
            to: g.email,
            subject,
            html: '<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#1A1613;"><p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C8922A;margin-bottom:24px;">Kingdom Insights Ministries</p><div style="font-size:16px;line-height:1.8;color:#6B6560;">' + body.replace(/\n/g, '<br>') + '</div><p style="font-size:13px;color:#6B6560;margin-top:32px;">— Apostle Joshua & Kingdom Insights Ministries<br>kim.church</p></div>'
          });
          sent++;
        } catch (e) { console.warn('Email failed:', e.message); }
      }
    }
    return res.status(200).json({ success: true, sent });
  } catch (err) { return res.status(500).json({ error: err.message }); }
};
