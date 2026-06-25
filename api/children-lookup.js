const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data, error } = await supabase
    .from('kim_children_checkin')
    .select('*')
    .eq('pickup_code', code.toUpperCase().trim())
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json({ record: data[0] });
};
