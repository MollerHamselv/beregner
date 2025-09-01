// api/admin/export.js
// Admin endpoint til at eksportere alle data
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Simpel autentificering
  const adminKey = req.headers['x-admin-key'] || req.query.key;
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const format = req.query.format || 'json';
    
    // Hent alle entries
    const entryKeys = await kv.keys('entry:*');
    const allEntries = [];
    
    for (const key of entryKeys) {
      const entry = await kv.get(key);
      if (entry) {
        allEntries.push({ id: key, ...entry });
      }
    }

    // Sorter efter timestamp (nyeste først)
    allEntries.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    if (format === 'csv') {
      // CSV export
      const csvHeaders = ['ID', 'Timestamp', 'Created', 'Employees', 'Industry', 'Salary', 'StressPct', 'Consent', 'IP', 'UserAgent'];
      const csvRows = allEntries.map(entry => [
        entry.id,
        entry.timestamp || '',
        entry.created || '',
        entry.employees || '',
        entry.industry || '',
        entry.salary || '',
        entry.stressPct || '',
        entry.consent || '',
        entry.ip || '',
        `"${(entry.userAgent || '').replace(/"/g, '""')}"` // Escape quotes
      ]);

      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="beregner-data-${new Date().toISOString().split('T')[0]}.csv"`);
      return res.status(200).send(csvContent);
    }

    // JSON export (default)
    res.status(200).json({
      ok: true,
      exported: new Date().toISOString(),
      count: allEntries.length,
      data: allEntries
    });

  } catch (error) {
    console.error('[admin/export] Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
