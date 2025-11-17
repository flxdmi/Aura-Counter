const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const body = JSON.parse(event.body || '{}');
  const testo = (body.text || '').trim();
  if (!testo) return { statusCode: 400, body: JSON.stringify({ error: 'Missing text' }) };

  const resp = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      input: [
        `Assegna un numero Aura a questo testo fra -1000000 e 1000000, multiplo di 100. Solo il numero: "${testo.replace(/"/g,'\\"')}"`
      ]
    })
  });

  const data = await resp.json();
  const raw = data.output_text || '0';
  const match = raw.match(/-?\d+/);
  const aura = match ? parseInt(match[0], 10) : 0;
  const finalAura = Math.max(-1000000, Math.min(1000000, Math.round(aura / 100) * 100));

  return { statusCode: 200, body: JSON.stringify({ aura: finalAura }) };
};
