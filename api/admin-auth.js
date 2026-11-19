module.exports = async function handler(req, res) {
  var p = process.env.ADMIN_PASSWORD;
  if (!p || req.headers['x-admin-password'] !== p) {
    await new Promise(function (r) { setTimeout(r, 800); });
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return res.status(200).json({ ok: true });
};
