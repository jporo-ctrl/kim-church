// Restricted pass-through for the check-in pages. Uses the service key so the
// public (anon) table policies can be removed. Only the exact calls the pages
// make are allowed: no open reads, no filters other than phone / family / date.
const TABLES = ['kim_families', 'kim_children', 'kim_children_checkin'];
const PHONE = /^eq\.\d{10}$/;
const DATE = /^eq\.\d{4}-\d{2}-\d{2}$/;
const ID = /^eq\.[0-9a-fA-F-]{1,40}$/;

function bad(res, msg) { return res.status(400).json({ error: msg }); }

function keysOnly(sp, allowed) {
  const keys = Array.from(sp.keys());
  return keys.every(function (k) { return allowed.indexOf(k) >= 0; }) && keys.length === allowed.length;
}

module.exports = async function handler(req, res) {
  const raw = req.query && req.query.path;
  if (typeof raw !== 'string' || raw.indexOf('/rest/v1/') !== 0) return bad(res, 'Bad path');
  const rest = raw.slice('/rest/v1/'.length);
  const qi = rest.indexOf('?');
  const table = qi >= 0 ? rest.slice(0, qi) : rest;
  const qs = qi >= 0 ? rest.slice(qi + 1) : '';
  if (TABLES.indexOf(table) < 0) return bad(res, 'Not allowed');
  const sp = new URLSearchParams(qs);
  const method = req.method;
  let body;
  let prefer = 'return=minimal';

  if (method === 'GET') {
    if (sp.get('select') !== '*') return bad(res, 'Not allowed');
    if (table === 'kim_families') {
      if (!keysOnly(sp, ['parent_phone', 'select']) || !PHONE.test(sp.get('parent_phone'))) return bad(res, 'Not allowed');
    } else if (table === 'kim_children') {
      if (!keysOnly(sp, ['family_id', 'select', 'order']) || !ID.test(sp.get('family_id')) || sp.get('order') !== 'created_at.asc') return bad(res, 'Not allowed');
    } else {
      if (!keysOnly(sp, ['parent_phone', 'event_date', 'select', 'order']) || !PHONE.test(sp.get('parent_phone')) || !DATE.test(sp.get('event_date')) || sp.get('order') !== 'checked_in_at.asc') return bad(res, 'Not allowed');
    }
  } else if (method === 'POST') {
    if (qs) return bad(res, 'Not allowed');
    const p = req.headers['x-prefer'];
    if (p === 'return=representation' || p === 'return=minimal') prefer = p;
    let b = req.body;
    if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { return bad(res, 'Bad body'); } }
    if (!b || typeof b !== 'object') return bad(res, 'Bad body');
    if (Array.isArray(b) && b.length > 20) return bad(res, 'Too many rows');
    body = JSON.stringify(b);
    if (body.length > 20000) return bad(res, 'Too large');
  } else if (method === 'DELETE') {
    if (table !== 'kim_children' || !keysOnly(sp, ['id']) || !ID.test(sp.get('id'))) return bad(res, 'Not allowed');
  } else {
    return bad(res, 'Not allowed');
  }

  try {
    const key = process.env.SUPABASE_SERVICE_KEY;
    const headers = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' };
    if (method === 'POST') headers.Prefer = prefer;
    const up = await fetch(process.env.SUPABASE_URL + '/rest/v1/' + rest, { method: method, headers: headers, body: body });
    const text = await up.text();
    res.status(up.status);
    res.setHeader('Content-Type', up.headers.get('content-type') || 'application/json');
    return res.send(text);
  } catch (e) {
    return res.status(502).json({ error: 'Upstream error' });
  }
};
