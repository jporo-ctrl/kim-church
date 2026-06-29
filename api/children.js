const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const action = req.query.action;

  // Lookup by code
  if (action === 'lookup') {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: 'No code provided' });
    const { data, error } = await supabase
      .from('kim_children_checkin')
      .select('*')
      .eq('pickup_code', code.toUpperCase().trim())
      .order('checked_in_at', { ascending: false })
      .limit(1);
    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ record: data[0] });
  }

  // Dashboard - active children
  if (action === 'dashboard') {
    const { data, error } = await supabase
      .from('kim_children_checkin')
      .select('*')
      .eq('status', 'checked_in')
      .order('checked_in_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ records: data || [] });
  }

  // Mark picked up
  if (action === 'pickup' && req.method === 'POST') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'No id provided' });

    // Get record first for email
    const { data: records } = await supabase
      .from('kim_children_checkin')
      .select('*')
      .eq('id', id)
      .limit(1);

    const pickedUpAt = new Date().toISOString();
    const { error } = await supabase
      .from('kim_children_checkin')
      .update({ status: 'picked_up', picked_up_at: pickedUpAt })
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });

    // Send email to parent if email exists
    if (records && records[0] && records[0].parent_email) {
      try {
        const rec = records[0];
        const resend = new Resend(process.env.RESEND_API_KEY);
        const timeStr = new Date(pickedUpAt).toLocaleTimeString('en-US', {
          timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit', hour12: true
        });
        await resend.emails.send({
          from: 'Kingdom Insights Ministries <info@kim.church>',
          to: rec.parent_email,
          subject: rec.child_name + ' has been picked up',
          html: '<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A1613;background-color:#ffffff;"><div style="text-align:center;padding:24px 0 16px;"><img src="https://kim.church/kim-logo-email.png" alt="Kingdom Insights Ministries" style="height:70px;"></div><div style="padding:0 24px 24px;">' +
            '<p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C8922A;margin-bottom:24px;">Kingdom Insights Ministries</p>' +
            '<h1 style="font-size:28px;font-weight:600;margin-bottom:16px;">' + rec.child_name + ' has been picked up</h1>' +
            '<p style="font-size:16px;line-height:1.8;color:#6B6560;">This is to confirm that <strong style="color:#1A1613;">' + rec.child_name + '</strong> was released to <strong style="color:#1A1613;">' + rec.parent_name + '</strong> at <strong style="color:#1A1613;">' + timeStr + ' CST</strong>.</p>' +
            '<p style="font-size:14px;color:#6B6560;margin-top:24px;">If you did not authorize this pickup, please contact us immediately at jporo@kim.church.</p>' +
            '<p style="font-size:13px;color:#6B6560;margin-top:32px;">— Kingdom Insights Ministries<br>kim.church</p>' +
            '</div>'
        });
      } catch (e) { console.warn('Parent email failed:', e.message); }
    }

    return res.status(200).json({ success: true });
  }

  // Log attendant sign-in
  if (action === 'attendant-signin' && req.method === 'POST') {
    const { name } = req.body;
    await supabase.from('kim_attendant_sessions').insert({
      attendant_name: name || 'Attendant',
      event_date: new Date().toISOString().split('T')[0]
    });
    return res.status(200).json({ success: true });
  }

  // Get attendant sessions for a given date — defaults to today
  if (action === 'attendants') {
    const today = new Date().toISOString().split('T')[0];
    const queryDate = req.query.date || today;
    const { data, error } = await supabase
      .from('kim_attendant_sessions')
      .select('*')
      .eq('event_date', queryDate)
      .order('signed_in_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ attendants: data || [], date: queryDate });
  }

  // All children for a given date (for admin) — defaults to today
  if (action === 'dashboard-all') {
    const today = new Date().toISOString().split('T')[0];
    const queryDate = req.query.date || today;
    const { data, error } = await supabase
      .from('kim_children_checkin')
      .select('*')
      .eq('event_date', queryDate)
      .order('checked_in_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ records: data || [], date: queryDate });
  }

  // Suspend/reinstate attendant
  if (action === 'suspend-attendant' && req.method === 'POST') {
    if (req.headers['x-admin-password'] !== 'KIM2026!') return res.status(401).json({ error: 'Unauthorized' });
    const { id, suspend } = req.body;
    const { error } = await supabase
      .from('kim_attendant_sessions')
      .update({ suspended: suspend })
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  // Get all attendants (admin)
  if (action === 'all-attendants') {
    if (req.headers['x-admin-password'] !== 'KIM2026!') return res.status(401).json({ error: 'Unauthorized' });
    const { data, error } = await supabase
      .from('kim_attendants')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ attendants: data || [] });
  }

  // Add attendant
  if (action === 'add-attendant' && req.method === 'POST') {
    if (req.headers['x-admin-password'] !== 'KIM2026!') return res.status(401).json({ error: 'Unauthorized' });
    const { name, pin } = req.body;
    const { error } = await supabase.from('kim_attendants').insert({ name, pin, active: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  // Remove attendant
  if (action === 'remove-attendant' && req.method === 'POST') {
    if (req.headers['x-admin-password'] !== 'KIM2026!') return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.body;
    const { error } = await supabase.from('kim_attendants').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  // Toggle attendant active
  if (action === 'toggle-attendant' && req.method === 'POST') {
    if (req.headers['x-admin-password'] !== 'KIM2026!') return res.status(401).json({ error: 'Unauthorized' });
    const { id, active } = req.body;
    const { error } = await supabase.from('kim_attendants').update({ active }).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  // Verify attendant PIN
  if (action === 'verify-pin' && req.method === 'POST') {
    const { pin } = req.body;
    const { data, error } = await supabase
      .from('kim_attendants')
      .select('*')
      .eq('pin', pin)
      .eq('active', true)
      .limit(1);
    if (error || !data || !data.length) return res.status(401).json({ error: 'Invalid PIN' });
    return res.status(200).json({ success: true, name: data[0].name });
  }

  return res.status(400).json({ error: 'Invalid action' });
};
