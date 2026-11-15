// Zeetemp - Vercel serverless proxy for the MTempMail API (avoids CORS problems)
module.exports = async (req, res) => {
  try {
    const p = String(req.query.p || '');
    if (!/^(domains|emails|messages)\//.test(p) || p.includes('..')) {
      return res.status(400).json({ status: false, error: 'bad path' });
    }
    const isPost = req.method === 'POST';
    const r = await fetch('https://mtempmail.com/api/' + p, {
      method: isPost ? 'POST' : 'GET',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: isPost ? JSON.stringify(req.body || {}) : undefined,
    });
    const text = await r.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(r.status).send(text);
  } catch (e) {
    return res.status(502).json({ status: false, error: String(e) });
  }
};
