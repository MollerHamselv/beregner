// api/collect.js
// Serverless backend på Vercel. SAFE_MODE gør, at intet sendes videre, før du er klar.
const SAFE_MODE = false;  // ← sæt til false, når du vil aktivere "rigtig" videresendelse

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // Minimal validering/sanitering — tilpas til dine felter
    const clean = {
      employees: clampInt(body.employees, 1, 100000),
      industry:  String(body.industry || '').slice(0, 60),
      salary:    clampNum(body.salary, 0, 1e7),
      stressPct: clampNum(body.stressPct, 0, 100),
      consent:   !!body.consent,
      _hp:       body._hp || ''   // honeypot
    };

    // Kræv samtykke (GDPR)
    if (!clean.consent) {
      return res.status(400).json({ ok: false, error: 'Consent required' });
    }
    // Honeypot: hvis udfyldt → sandsynlig bot → "lykke-ok" uden handling
    if (clean._hp !== '') {
      return res.status(200).json({ ok: true });
    }

    // SAFE MODE: svar "ok" og log payload, men send intet videre endnu
    if (SAFE_MODE || !process.env.GS_WEBAPP_URL) {
      console.log('[collect] payload (safe mode):', clean);
      return res.status(200).json({ ok: true, safe: true });
    }

    // Rigtig videresendelse (når SAFE_MODE = false og env var er sat)
    const upstream = await fetch(process.env.GS_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(clean)
    });
    if (!upstream.ok) {
      console.error('Upstream error', upstream.status, await upstream.text().catch(()=>''));      
      return res.status(502).json({ ok: false, error: 'Upstream failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('collect error', err);
    return res.status(400).json({ ok: false, error: 'Bad Request' });
  }
}

function clampNum(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.min(Math.max(x, min), max);
}
function clampInt(n, min, max) {
  return Math.round(clampNum(n, min, max));
}
