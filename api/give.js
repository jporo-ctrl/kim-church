const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { amount, frequency, full_name, email, phone, tier } = req.body;
  if (!amount || !full_name || !email) return res.status(400).json({ error: 'Amount, name and email are required' });
  const amountCents = Math.round(parseFloat(amount) * 100);
  if (amountCents < 100) return res.status(400).json({ error: 'Minimum gift is $1' });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents, currency: 'usd',
      metadata: { full_name, email, phone: phone || '', frequency: frequency || 'one-time', tier: tier || '' }
    });
    await supabase.from('kim_givers').insert({
      full_name: full_name.trim(), email: email.trim(), phone: phone?.trim() || null,
      amount: parseFloat(amount), frequency: frequency || 'one-time', tier: tier || null,
      stripe_payment_intent: paymentIntent.id, status: 'pending', created_at: new Date().toISOString()
    });
    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('give error:', err);
    return res.status(500).json({ error: err.message });
  }
};
