const { createClient } = require('@supabase/supabase-js');
module.exports = async function handler(req, res) {
  if (req.headers['x-admin-password'] !== 'KIM2026!') return res.status(401).json({ error: 'Unauthorized' });
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  try {
    const { data, error } = await supabase.from('kim_givers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return res.status(200).json({ givers: data });
  } catch (err) { return res.status(500).json({ error: err.message }); }
};
