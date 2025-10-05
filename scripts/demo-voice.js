const fs = require('fs');
const fetch = require('node-fetch');

async function run() {
  const url = 'http://localhost:3000/api/voice';
  const payload = {
    weather: { tempC: 18, precipitation: 0, condition: 'partly cloudy' },
    events: [{ title: 'Team meeting', dressCode: 'business-casual' }],
    items: [
      { id: '1', kind: 'shirt', color: 'navy', style: 'casual', warmth: 0 },
      { id: '2', kind: 'pants', color: 'khaki', style: 'business-casual', warmth: 0 }
    ]
  };

  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  if (!res.ok) {
    console.error('Server error', await res.text());
    process.exit(1);
  }

  const buffer = await res.buffer();
  fs.writeFileSync('./outfit.mp3', buffer);
  console.log('Saved outfit.mp3');
}

run().catch(e => { console.error(e); process.exit(1); });
