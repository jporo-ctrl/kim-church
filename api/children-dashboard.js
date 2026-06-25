const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
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
};
