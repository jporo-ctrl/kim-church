const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const {
    form_type, first_name, last_name, email, phone,
    position, message, subject, prayer_request,
    category, anonymous, followup
  } = req.body;

  if (!form_type || !first_name) return res.status(400).json({ error: 'Missing required fields' });

  const fullName = `${first_name} ${last_name || ''}`.trim();
  const now = new Date().toLocaleString('en-US', {
    timeZone: 'America/Chicago', weekday: 'short', year: 'numeric',
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
  });

  const logoBlock = `<div style="background:#0D0D0D;padding:24px;text-align:center;">
    <img src="https://kim.church/kim-logo-email.png" alt="Kingdom Insights Ministries" style="height:60px;">
  </div>`;

  const eyebrow = `<p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C8922A;margin-bottom:16px;">Kingdom Insights Ministries</p>`;

  const signature = `<p style="font-size:13px;color:#6B6560;margin-top:24px;">— Apostle Joshua & Kingdom Insights Ministries<br>kim.church</p>`;

  try {

    // ── VOLUNTEER / JOIN THE TEAM ──────────────────────────────────────────
    if (form_type === 'serve') {

      await resend.emails.send({
        from: 'KIM Serve Team <serve@kim.church>',
        to: 'serve@kim.church',
        subject: `New Volunteer Application: ${fullName}`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
          <h2 style="color:#C8922A;">New Volunteer Application</h2>
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;width:130px;">Name</td><td style="font-weight:600;">${fullName}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Phone</td><td>${phone || 'Not provided'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Email</td><td>${email || 'Not provided'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Position</td><td>${position || 'Not specified'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Message</td><td>${message || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Submitted</td><td>${now} CST</td></tr>
          </table>
        </div>`
      });

      if (email) {
        await resend.emails.send({
          from: 'Kingdom Insights Ministries <serve@kim.church>',
          to: email.trim(),
          subject: 'We received your volunteer application',
          html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A1613;background:#ffffff;">
            ${logoBlock}
            <div style="padding:32px 24px;">
              ${eyebrow}
              <h1 style="font-size:28px;font-weight:600;margin-bottom:16px;">Thank you, ${first_name}.</h1>
              <p style="font-size:15px;line-height:1.8;color:#6B6560;">Your application to serve on the <strong style="color:#1A1613;">${position || 'KIM Team'}</strong> has been received. Someone from our team will be in touch with you personally.</p>
              <div style="margin:28px 0;padding:20px;background:#FBF4E8;border-left:3px solid #C8922A;">
                <p style="font-size:14px;color:#1A1613;margin:0;">Every gift has a place here. We're glad you said yes.</p>
              </div>
              ${signature}
            </div>
          </div>`
        });
      }
    }

    // ── PRAYER REQUEST ─────────────────────────────────────────────────────
    else if (form_type === 'prayer') {
      if (!prayer_request) return res.status(400).json({ error: 'Prayer request is required' });

      const isAnonymous = anonymous === true || anonymous === 'true' || anonymous === 'on';
      const wantsFollowup = followup === true || followup === 'true' || followup === 'on';

      await resend.emails.send({
        from: 'KIM Prayer Team <prayer@kim.church>',
        to: 'prayer@kim.church',
        subject: `Prayer Request: ${isAnonymous ? 'Anonymous' : fullName}`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
          <h2 style="color:#C8922A;">New Prayer Request</h2>
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;width:130px;">Name</td><td style="font-weight:600;">${isAnonymous ? 'Anonymous' : fullName}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Email</td><td>${email || 'Not provided'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Category</td><td>${category || 'Not specified'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Anonymous</td><td>${isAnonymous ? 'Yes — leadership only' : 'No'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Follow up</td><td>${wantsFollowup ? 'Yes — please reach out' : 'No'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Submitted</td><td>${now} CST</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#f9f9f9;border-left:3px solid #C8922A;">
            <p style="font-size:14px;color:#333;margin:0;line-height:1.7;">${prayer_request}</p>
          </div>
        </div>`
      });

      if (email) {
        await resend.emails.send({
          from: 'Kingdom Insights Ministries <prayer@kim.church>',
          to: email.trim(),
          subject: 'We are praying with you',
          html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A1613;background:#ffffff;">
            ${logoBlock}
            <div style="padding:32px 24px;">
              ${eyebrow}
              <h1 style="font-size:28px;font-weight:600;margin-bottom:16px;">We received your request, ${first_name}.</h1>
              <p style="font-size:15px;line-height:1.8;color:#6B6560;">Your prayer request has been shared with our leadership and intercessory prayer team. You are not carrying this alone — we are standing with you in faith.</p>
              <div style="margin:28px 0;padding:20px;background:#FBF4E8;border-left:3px solid #C8922A;">
                <p style="font-size:14px;color:#1A1613;margin:0;font-style:italic;">"The effective, fervent prayer of a righteous man avails much." — James 5:16</p>
              </div>
              ${wantsFollowup ? '<p style="font-size:14px;color:#6B6560;margin-bottom:16px;">Someone from our team will follow up with you personally.</p>' : ''}
              ${signature}
            </div>
          </div>`
        });
      }
    }

    // ── GENERAL INQUIRY ────────────────────────────────────────────────────
    else if (form_type === 'general') {
      if (!email || !message) return res.status(400).json({ error: 'Email and message are required' });

      await resend.emails.send({
        from: 'KIM Info <info@kim.church>',
        to: 'info@kim.church',
        subject: `General Inquiry: ${subject || 'No subject'} — ${fullName}`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
          <h2 style="color:#C8922A;">General Inquiry</h2>
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;width:130px;">Name</td><td style="font-weight:600;">${fullName}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Email</td><td>${email}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Subject</td><td>${subject || 'Not provided'}</td></tr>
            <tr><td style="padding:8px 0;color:#666;">Submitted</td><td>${now} CST</td></tr>
          </table>
          <div style="margin-top:20px;padding:16px;background:#f9f9f9;border-left:3px solid #C8922A;">
            <p style="font-size:14px;color:#333;margin:0;line-height:1.7;">${message}</p>
          </div>
        </div>`
      });

      await resend.emails.send({
        from: 'Kingdom Insights Ministries <info@kim.church>',
        to: email.trim(),
        subject: 'We got your message',
        html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A1613;background:#ffffff;">
          ${logoBlock}
          <div style="padding:32px 24px;">
            ${eyebrow}
            <h1 style="font-size:28px;font-weight:600;margin-bottom:16px;">Thanks for reaching out, ${first_name}.</h1>
            <p style="font-size:15px;line-height:1.8;color:#6B6560;">We received your message and someone from the KIM team will get back to you within 24–48 hours.</p>
            <div style="margin:28px 0;padding:20px;background:#FBF4E8;border-left:3px solid #C8922A;">
              <p style="font-size:14px;color:#1A1613;margin:0;">There is a place here for you. We're glad you're here.</p>
            </div>
            ${signature}
          </div>
        </div>`
      });
    }

    else {
      return res.status(400).json({ error: 'Invalid form type' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('contact error:', err);
    return res.status(500).json({ error: err.message });
  }
};
