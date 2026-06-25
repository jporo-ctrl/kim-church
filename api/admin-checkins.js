const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { data, error } = await supabase
    .from("kim_checkins")
    .select("*")
    .order("checked_in_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ checkins: data });
};
