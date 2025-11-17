async function valutaAura(testo) {
  const resp = await fetch('/.netlify/functions/aura', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: testo })
  });
  const data = await resp.json();
  return data.aura;
}

document.getElementById('valutaBtn').addEventListener('click', async () => {
  const testo = document.getElementById('avvenimento').value;
  const aura = await valutaAura(testo);
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = aura + ' Punti AURA';
  resultDiv.style.color = aura >= 0 ? '#00ff88' : '#ff5555';
});