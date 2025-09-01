// api/collect.js
// Serverless backend med lokal datalagring (ingen Google Sheets)
const SAFE_MODE = false;
const USE_GOOGLE_SHEETS = false;  // ← Nu deaktiveret
const USE_LOCAL_STORAGE = true;  // ← Kun lokal lagring

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // Minimal validering/sanitering
    const clean = {
      employees: clampInt(body.employees, 1, 100000),
      industry:  String(body.industry || '').slice(0, 60),
      salary:    clampNum(body.salary, 0, 1e7),
      stressPct: clampNum(body.stressPct, 0, 100),
      consent:   !!body.consent,
      _hp:       body._hp || ''
    };

    // Kræv samtykke (GDPR)
    if (!clean.consent) {
      return res.status(400).json({ ok: false, error: 'Consent required' });
    }
    
    // Honeypot check
    if (clean._hp !== '') {
      return res.status(200).json({ ok: true });
    }

    if (SAFE_MODE) {
      console.log('[collect] SAFE MODE - data:', clean);
      return res.status(200).json({ ok: true, safe: true });
    }

    // Gem data til Edge Config eller simpel JSON fil
    const timestamp = Date.now();
    const entryId = `entry_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
    
    const dataEntry = {
      ...clean,
      id: entryId,
      timestamp,
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown',
      userAgent: req.headers['user-agent'] || '',
      created: new Date().toISOString()
    };
    
    // Log data (Vercel Functions logger)
    console.log('[collect] New entry:', JSON.stringify(dataEntry));
    
    // I fremtiden kan vi gemme til Vercel KV eller Edge Config her
    // For nu logger vi bare dataen, som kan læses fra Vercel logs
    
    return res.status(200).json({ ok: true, id: entryId });

  } catch (err) {
    console.error('[collect] Error:', err);
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
