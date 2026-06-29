const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { full_name, phone, email, how_heard, bringing_others, others_count } = req.body;
  if (!full_name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error: dbError } = await supabase.from('kim_vision_guests').insert({
      full_name: full_name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      how_heard: how_heard?.trim() || null,
      event: 'builders_gathering',
      event_date: '2026-07-25',
      registered_at: new Date().toISOString()
    });
    if (dbError) throw dbError;

    const firstName = full_name.trim().split(' ')[0];

    const now = new Date();
    const cstTime = now.toLocaleString('en-US', {
      timeZone: 'America/Chicago',
      weekday: 'short', year: 'numeric', month: 'short',
      day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    const guestLine = bringing_others === 'yes' && others_count
      ? `${others_count} additional guest(s)`
      : 'None indicated';

    const logoBlock = `<div style="background:#0D0D0D;padding:24px;text-align:center;">
      <img src="https://kim.church/kim-logo-email.png" alt="Kingdom Insights Ministries" style="height:60px;">
    </div>`;

    // Email confirmation to guest
    if (email) {
      try {
        await resend.emails.send({
          from: 'Kingdom Insights Ministries <info@kim.church>',
          to: email.trim(),
          subject: 'You\'re registered — The Builders Gathering',
          html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A1613;background:#ffffff;">
            ${logoBlock}
            <div style="padding:32px 24px;">
              <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C8922A;margin-bottom:20px;">Kingdom Insights Ministries</p>
              <h1 style="font-size:32px;font-weight:600;line-height:1.2;margin-bottom:16px;">You're registered, ${firstName}.</h1>
              <p style="font-size:16px;line-height:1.8;color:#6B6560;">We're expecting you at <strong style="color:#1A1613;">The Builders Gathering</strong> — this is where vision becomes building. Come ready to lay foundations.</p>
              <div style="margin:28px 0;padding:24px;background:#FBF4E8;border-left:3px solid #C8922A;">
                <p style="font-size:14px;color:#1A1613;margin:0 0 8px;"><strong>Saturday, July 25, 2026</strong></p>
                <p style="font-size:14px;color:#6B6560;margin:0 0 4px;">6:00 – 8:00 PM CST</p>
                <p style="font-size:14px;color:#6B6560;margin:0;">Compass Center · 4201 Pool Rd, Grapevine TX 76051</p>
              </div>
              <p style="font-size:15px;line-height:1.8;color:#6B6560;">Bring someone with you. There is a place here for everyone who is called to build.</p>
              <div style="margin:28px 0;padding:20px;background:#0D0D0D;">
                <p style="font-size:13px;font-style:italic;color:rgba(245,237,216,0.6);margin:0 0 8px;">"Unless the Lord builds the house, the builders labor in vain."</p>
                <p style="font-size:11px;letter-spacing:0.15em;color:#C8922A;margin:0;">PSALM 127:1</p>
              </div>
              <p style="font-size:13px;color:#6B6560;margin-top:24px;">— Apostle Joshua & Kingdom Insights Ministries<br>kim.church</p>
            </div>
          </div>`
        });
      } catch (emailErr) {
        console.warn('Guest email failed:', emailErr.message);
      }
    }

    // Admin notification
    try {
      await resend.emails.send({
        from: 'KIM Registration <info@kim.church>',
        to: 'info@kim.church',
        subject: `New Builders Gathering RSVP: ${full_name}`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
          <h2 style="color:#C8922A;">New Builders Gathering RSVP</h2>
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;width:130px;">Name</td><td style="font-weight:600;">${full_name}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Phone</td><td>${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Email</td><td>${email || 'Not provided'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">How heard</td><td>${how_heard || 'Not specified'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Bringing guests</td><td>${guestLine}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Registered</td><td>${cstTime} CST</td></tr>
          </table>
        </div>`
      });
    } catch (adminErr) {
      console.warn('Admin email failed:', adminErr.message);
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('builders-register error:', err);
    return res.status(500).json({ error: err.message });
  }
};
