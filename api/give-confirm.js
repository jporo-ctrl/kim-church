const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { paymentIntentId, full_name, email, amount, frequency, tier } = req.body;
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await supabase.from('kim_givers').update({ status: 'completed' }).eq('stripe_payment_intent', paymentIntentId);
    const firstName = full_name.trim().split(' ')[0];
    const amountFmt = parseFloat(amount).toFixed(2);
    const freqLabel = frequency === 'monthly' ? 'monthly' : 'one-time';
    await resend.emails.send({
      from: 'Kingdom Insights Ministries <giving@kim.church>',
      to: email,
      subject: 'Thank you for your gift to KIM',
      html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A1613;"><div style="background:#0D0D0D;padding:24px;text-align:center;margin-bottom:32px;">
  <img src="https://kim.church/kim-logo-email.png" alt="Kingdom Insights Ministries" style="height:60px;">
</div><div style="padding:0 24px 24px;"><p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C8922A;margin-bottom:24px;">Kingdom Insights Ministries</p><h1 style="font-size:32px;font-weight:600;line-height:1.2;margin-bottom:16px;">Thank you, ${firstName}.</h1><p style="font-size:16px;line-height:1.8;color:#6B6560;">Your gift of <strong style="color:#1A1613;">$${amountFmt}</strong> (${freqLabel}) has been received. You are writing your name into the foundation of something God is building.</p><div style="margin:32px 0;padding:24px;background:#FBF4E8;border-left:3px solid #C8922A;"><p style="font-size:14px;font-style:italic;color:#6B6560;line-height:1.7;margin:0;">"Each of you should give what you have decided in your heart to give — not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7</p></div><p style="font-size:15px;line-height:1.8;color:#6B6560;">Apostle Joshua and the KIM team will be praying over every partner by name.</p><p style="font-size:13px;color:#6B6560;margin-top:32px;">— Kingdom Insights Ministries<br>kim.church</p></div>`
    });
    await resend.emails.send({
      from: 'KIM Giving <giving@kim.church>',
      to: 'joshuaporo@gmail.com',
      subject: `New gift: $${amountFmt} from ${full_name}`,
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;"><h2 style="color:#C8922A;">New Gift Received</h2><table style="width:100%;font-size:14px;"><tr><td style="padding:8px 0;color:#666;">Name</td><td style="padding:8px 0;font-weight:600;">${full_name}</td></tr><tr><td style="padding:8px 0;color:#666;">Email</td><td>${email}</td></tr><tr><td style="padding:8px 0;color:#666;">Amount</td><td style="font-weight:600;">$${amountFmt} (${freqLabel})</td></tr><tr><td style="padding:8px 0;color:#666;">Tier</td><td>${tier || 'Not selected'}</td></tr></table></div>`
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('give-confirm error:', err);
    return res.status(500).json({ error: err.message });
  }
};
