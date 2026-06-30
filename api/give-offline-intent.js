const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { full_name, email, amount, queued_at } = req.body;
  if (!email || !amount) return res.status(400).json({ error: 'Email and amount required' });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const firstName = (full_name || '').split(' ')[0] || 'Friend';
  const giveLink = `https://kim.church/give`;

  const queuedTime = queued_at
    ? new Date(queued_at).toLocaleString('en-US', { timeZone: 'America/Chicago', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
    : 'recently';

  try {
    await resend.emails.send({
      from: 'Kingdom Insights Ministries <give@kim.church>',
      to: email.trim(),
      subject: 'Complete your gift to Kingdom Insights Ministries',
      html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A1613;background:#ffffff;">
        <div style="background:#0D0D0D;padding:24px;text-align:center;">
          <img src="https://kim.church/kim-logo-email.png" alt="Kingdom Insights Ministries" style="height:60px;">
        </div>
        <div style="padding:32px 24px;">
          <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C8922A;margin-bottom:16px;">Kingdom Insights Ministries</p>
          <h1 style="font-size:28px;font-weight:600;line-height:1.2;margin-bottom:16px;">Complete your gift, ${firstName}.</h1>
          <p style="font-size:15px;line-height:1.8;color:#6B6560;">You intended to give <strong style="color:#1A1613;">$${parseFloat(amount).toFixed(2)}</strong> to Kingdom Insights Ministries on ${queuedTime}, but you were offline at the time. Your generosity has not been forgotten.</p>
          <div style="margin:28px 0;padding:24px;background:#FBF4E8;border-left:3px solid #C8922A;">
            <p style="font-size:14px;color:#1A1613;margin:0 0 16px;font-weight:500;">Click below to complete your gift securely:</p>
            <a href="${giveLink}" style="display:inline-block;padding:14px 32px;background:#C8922A;color:#0D0D0D;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;letter-spacing:0.08em;text-decoration:none;">Give $${parseFloat(amount).toFixed(2)} Now →</a>
          </div>
          <p style="font-size:14px;line-height:1.8;color:#6B6560;">Or visit <a href="${giveLink}" style="color:#C8922A;">kim.church/give</a> to complete your gift at any time.</p>
          <p style="font-size:13px;color:#6B6560;margin-top:24px;">Thank you for your faithfulness. Every gift writes your name into the foundation of this ministry.</p>
          <p style="font-size:13px;color:#6B6560;margin-top:16px;">— Apostle Joshua & Kingdom Insights Ministries<br>kim.church</p>
        </div>
      </div>`
    });

    // Also notify admin
    await resend.emails.send({
      from: 'KIM Giving <give@kim.church>',
      to: 'give@kim.church',
      subject: `Offline giving intent synced: ${full_name} — $${parseFloat(amount).toFixed(2)}`,
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
        <h2 style="color:#C8922A;">Offline Giving Intent Synced</h2>
        <table style="width:100%;font-size:14px;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#666;width:130px;">Name</td><td style="font-weight:600;">${full_name || 'Not provided'}</td></tr>
          <tr><td style="padding:8px 0;color:#666;">Email</td><td>${email}</td></tr>
          <tr><td style="padding:8px 0;color:#666;">Amount</td><td style="font-weight:600;">$${parseFloat(amount).toFixed(2)}</td></tr>
          <tr><td style="padding:8px 0;color:#666;">Intended at</td><td>${queuedTime}</td></tr>
          <tr><td style="padding:8px 0;color:#666;">Status</td><td>Payment link sent — awaiting completion</td></tr>
        </table>
      </div>`
    });

    return res.status(200).json({ success: true });
  } catch(err) {
    console.error('give-offline-intent error:', err);
    return res.status(500).json({ error: err.message });
  }
};
