// api/admin/cleanup.js
// Admin endpoint til GDPR compliance data cleanup
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Simpel autentificering
  const adminKey = req.headers['x-admin-key'] || req.query.key;
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { action, days, entryId } = req.body;

    if (action === 'delete-old') {
      // Slet data ældre end X dage (GDPR compliance)
      const cutoffDays = parseInt(days) || 365; // Default: 1 år
      const cutoffTimestamp = Date.now() - (cutoffDays * 24 * 60 * 60 * 1000);
      
      const entryKeys = await kv.keys('entry:*');
      let deletedCount = 0;
      
      for (const key of entryKeys) {
        const entry = await kv.get(key);
        if (entry && entry.timestamp && entry.timestamp < cutoffTimestamp) {
          await kv.del(key);
          deletedCount++;
        }
      }

      return res.status(200).json({
        ok: true,
        action: 'delete-old',
        cutoffDays,
        deletedCount
      });
    }

    if (action === 'delete-entry' && entryId) {
      // Slet specifik entry
      const exists = await kv.get(entryId);
      if (exists) {
        await kv.del(entryId);
        // Opdater statistikker
        await kv.decr('stats:total_entries');
        if (exists.industry) {
          await kv.decr(`stats:industry:${exists.industry}`);
        }
        
        return res.status(200).json({
          ok: true,
          action: 'delete-entry',
          entryId,
          deleted: true
        });
      } else {
        return res.status(404).json({
          ok: false,
          error: 'Entry not found'
        });
      }
    }

    if (action === 'anonymize-old') {
      // Anonymiser data ældre end X dage (behold statistikker, fjern personlige data)
      const cutoffDays = parseInt(days) || 90; // Default: 3 måneder
      const cutoffTimestamp = Date.now() - (cutoffDays * 24 * 60 * 60 * 1000);
      
      const entryKeys = await kv.keys('entry:*');
      let anonymizedCount = 0;
      
      for (const key of entryKeys) {
        const entry = await kv.get(key);
        if (entry && entry.timestamp && entry.timestamp < cutoffTimestamp) {
          // Behold kun statistisk relevante data
          const anonymized = {
            employees: entry.employees,
            industry: entry.industry,
            salary: entry.salary,
            stressPct: entry.stressPct,
            timestamp: entry.timestamp,
            anonymized: true,
            originalTimestamp: entry.created
          };
          
          await kv.set(key, anonymized);
          anonymizedCount++;
        }
      }

      return res.status(200).json({
        ok: true,
        action: 'anonymize-old',
        cutoffDays,
        anonymizedCount
      });
    }

    return res.status(400).json({
      error: 'Invalid action. Use: delete-old, delete-entry, or anonymize-old'
    });

  } catch (error) {
    console.error('[admin/cleanup] Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
