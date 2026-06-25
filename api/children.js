const { createClient } = require('@supabase/supabase-js');

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
      .order('created_at', { ascending: false })
      .limit(1);
    if (error) return res.status(500).json({ error: error.message });
    if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json({ record: data[0] });
  }

  // Dashboard - active children
  if (action === 'dashboard') {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const { data, error } = await supabase
      .from('kim_children_checkin')
      .select('*')
      .eq('status', 'checked_in')
      .gte('created_at', todayStart.toISOString())
      .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ records: data || [] });
  }

  // Mark picked up
  if (action === 'pickup' && req.method === 'POST') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'No id provided' });
    const { error } = await supabase
      .from('kim_children_checkin')
      .update({ status: 'picked_up', picked_up_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: 'Invalid action' });
};
