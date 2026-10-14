const { pool, query } = require('../config/db');

async function syncMappings() {
  const acts = await query('SELECT id, name FROM activities');
  const tags = await query('SELECT id, name FROM interest_tags');

  const mappings = [
    { act: 'Hiking & Nature Trails', tag: 'Hiking & Nature Trails' },
    { act: 'Hiking & Nature Trails', tag: 'Jogging & Running' },
    { act: 'Lake & River Kayaking', tag: 'Outdoor Swimming' },
    { act: 'Outdoor Cycling & Biking', tag: 'Cycling & Biking' },
    { act: 'Outdoor Cycling & Biking', tag: 'Tennis & Racquet Sports' },
    { act: 'Landscape Photography & Sightseeing', tag: 'Photography & Sightseeing' },
    { act: 'Open-Air Park Picnic & Relaxation', tag: 'Picnics & Relaxation' },
    { act: 'Paragliding & Aerial Sports', tag: 'Hiking & Nature Trails' },
    { act: 'Museum & Art Gallery Visit', tag: 'Museums & Cultural Galleries' },
    { act: 'Artisan Cafe & Bookstore Reading', tag: 'Cafes & Reading' },
    { act: 'Artisan Cafe & Bookstore Reading', tag: 'Board Games & Gaming' },
    { act: 'Indoor Rock Climbing & Fitness Gym', tag: 'Indoor Gym & Fitness' },
    { act: 'Cinema, Theater & Concerts', tag: 'Cinema & Theater' },
  ];

  let added = 0;
  for (const m of mappings) {
    const act = acts.rows.find((a) => a.name === m.act);
    const tag = tags.rows.find((t) => t.name === m.tag);
    if (act && tag) {
      const res = await query(
        `INSERT INTO activity_interest_tags (activity_id, interest_tag_id)
         SELECT $1::uuid, $2::uuid
         WHERE NOT EXISTS (
           SELECT 1 FROM activity_interest_tags WHERE activity_id = $1::uuid AND interest_tag_id = $2::uuid
         )`,
        [act.id, tag.id]
      );
      if (res.rowCount > 0) added++;
    }
  }

  const check = await query('SELECT COUNT(*) FROM activity_interest_tags');
  console.log(`✅ Synced mappings: added ${added} new links. Total links: ${check.rows[0].count}`);
  await pool.end();
}

syncMappings().catch((err) => {
  console.error('Error syncing mappings:', err);
  process.exit(1);
});
