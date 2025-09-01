// api/admin/code-viewer.js
// Admin endpoint til at vise kildekode
import { readFileSync } from 'fs';
import { join } from 'path';

export default async function handler(req, res) {
  // Autentificering
  const adminKey = req.headers['x-admin-key'] || req.query.key;
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { file } = req.query;
    
    // Liste over tilladte filer at vise
    const allowedFiles = {
      'collect': 'api/collect.js',
      'stats': 'api/admin/stats.js',
      'export': 'api/admin/export.js',
      'cleanup': 'api/admin/cleanup.js',
      'code-viewer': 'api/admin/code-viewer.js',
      'package': 'package.json',
      'frontend-script': 'script.js',
      'frontend-style': 'style.css',
      'admin-dashboard': 'admin.html'
    };

    if (!file) {
      // Returner liste over tilgængelige filer
      return res.status(200).json({
        ok: true,
        files: Object.keys(allowedFiles).map(key => ({
          key,
          name: allowedFiles[key],
          description: getFileDescription(key)
        }))
      });
    }

    if (!allowedFiles[file]) {
      return res.status(404).json({ error: 'File not found or not allowed' });
    }

    // Læs fil indhold (simuleret for Vercel environment)
    const fileContent = getFileContent(file);
    
    res.status(200).json({
      ok: true,
      file: allowedFiles[file],
      content: fileContent,
      language: getLanguage(allowedFiles[file]),
      description: getFileDescription(file)
    });

  } catch (error) {
    console.error('[admin/code-viewer] Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

function getFileDescription(fileKey) {
  const descriptions = {
    'collect': 'Hovedendpoint til dataindsamling - modtager POST data fra frontend',
    'stats': 'Admin statistik endpoint - viser dashboard data',
    'export': 'Data eksport endpoint - JSON/CSV download',
    'cleanup': 'GDPR compliance endpoint - slet/anonymiser data',
    'code-viewer': 'Kode viewer endpoint - viser kildekode (denne fil)',
    'package': 'NPM dependencies og projekt konfiguration',
    'frontend-script': 'Frontend JavaScript - beregner logik og API calls',
    'frontend-style': 'Frontend CSS - styling og layout',
    'admin-dashboard': 'Admin dashboard HTML - denne side'
  };
  return descriptions[fileKey] || 'Ukent fil';
}

function getLanguage(filePath) {
  if (filePath.endsWith('.js')) return 'javascript';
  if (filePath.endsWith('.json')) return 'json';
  if (filePath.endsWith('.css')) return 'css';
  if (filePath.endsWith('.html')) return 'html';
  return 'text';
}

function getFileContent(fileKey) {
  // Returnér den faktiske kode fra dine filer
  const contents = {
    'collect': `// api/collect.js - Din nuværende collect endpoint
// Serverless backend med lokal datalagring (ingen Google Sheets)
const SAFE_MODE = false;
const USE_GOOGLE_SHEETS = false;
const USE_LOCAL_STORAGE = true;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }
  
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    // Validering af input data
    const clean = {
      employees: clampInt(body.employees, 1, 100000),
      industry: String(body.industry || '').slice(0, 60),
      salary: clampNum(body.salary, 0, 1e7),
      stressPct: clampNum(body.stressPct, 0, 100),
      consent: !!body.consent,
      _hp: body._hp || ''
    };

    // GDPR samtykke krav
    if (!clean.consent) {
      return res.status(400).json({ ok: false, error: 'Consent required' });
    }
    
    // Anti-spam honeypot
    if (clean._hp !== '') {
      return res.status(200).json({ ok: true });
    }

    // Data processing
    const timestamp = Date.now();
    const entryId = 'entry_' + timestamp + '_' + Math.random().toString(36).substr(2, 9);
    
    const dataEntry = {
      ...clean,
      id: entryId,
      timestamp,
      ip: req.headers['x-forwarded-for'] || 'unknown',
      created: new Date().toISOString()
    };
    
    console.log('[collect] New entry:', JSON.stringify(dataEntry));
    return res.status(200).json({ ok: true, id: entryId });

  } catch (err) {
    console.error('[collect] Error:', err);
    return res.status(400).json({ ok: false, error: 'Bad Request' });
  }
}`,

    'stats': `// api/admin/stats.js - Dashboard statistikker
export default async function handler(req, res) {
  const adminKey = req.headers['x-admin-key'] || req.query.key;
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const stats = {
    totalEntries: 1247,
    industries: {
      'IT & Teknologi': 342,
      'Sundhed & Pleje': 198,
      'Finans & Bank': 156,
      'Offentlig sektor': 134
    },
    avgSalary: 487650,
    avgStress: 58
  };

  res.status(200).json({ ok: true, stats });
}`,

    'package': `{
  "name": "beregner",
  "version": "1.0.0",
  "description": "Avanceret lønberegner med admin dashboard",
  "dependencies": {
    "@vercel/edge-config": "^0.4.1"
  },
  "scripts": {
    "dev": "vercel dev",
    "deploy": "vercel --prod"
  }
}`
  };

  return contents[fileKey] || '// Fil ikke tilgængelig';
}
