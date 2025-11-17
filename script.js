// ====================================================================
// script.js - LOGICA AGGIORNATA PER COSTRUIRE IL PROMPT DI SISTEMA
// ====================================================================

// Il prompt di sistema ESTESO e FISSO, che contiene tutte le istruzioni per l'AI
const PROMPT_SISTEMA_AURA = `
    Sei un sistema ultra-avanzato progettato per calcolare un punteggio chiamato “Punti Aura”. 
    Il tuo compito è analizzare la frase in italiano che segue, spesso contenente slang, ironia, abbreviazioni e riferimenti giovanili. 
    Devi comprendere il significato profondo e l'intento reale, valutando l'impatto sociale, emotivo, personale e contestuale dell’evento descritto. Non devi limitarti a riconoscere singole parole (slang moderni come: palo, ghostato, floppato, cringe, power move, tilt, sculo assurdo, bomba, gasante, leggenda), ma devi comprendere la frase come un essere umano molto sveglio.
    
    Devi trasformare questa valutazione in un singolo numero chiamato “Punti Aura”.
    Il punteggio DEVE essere SEMPRE un intero compreso tra –1.000.000 e +1.000.000, ed è sempre espresso in multipli di 100.
    Rispondi ESCLUSIVAMENTE con il numero, senza aggiungere testo, spiegazioni, simboli o emoji.
`;

async function valutaAura(testoUtente) {
    // 1. Costruisci l'array di messaggi nel formato richiesto da OpenAI
    const messages = [
        { role: "system", content: PROMPT_SISTEMA_AURA }, // Le istruzioni fisse
        { role: "user", content: testoUtente } // La frase dell'utente
    ];

    // Chiama la funzione Netlify (il tuo endpoint è /aura)
    const resp = await fetch('/.netlify/functions/aura', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages }) // Invia l'array messages completo
    });
    
    if (!resp.ok) {
        throw new Error(`Errore HTTP: ${resp.status}. Controlla i log della funzione Netlify.`);
    }

    const data = await resp.json();
    
    // Controlla la risposta di OpenAI (la struttura completa)
    if (data.choices && data.choices[0] && data.choices[0].message) {
        let rawAura = data.choices[0].message.content.trim();
        
        // Estrai solo il numero per sicurezza, ignorando eventuali parole aggiuntive dall'AI
        const match = rawAura.match(/(-?\d+)/); 
        if (match) {
            return parseInt(match[0], 10);
        }
        
        throw new Error(`Output AI non numerico: "${rawAura}"`); 
    } else if (data.error) {
        throw new Error(`Errore API: ${data.error.message || JSON.stringify(data.error)}`);
    } else {
        throw new Error("Risposta API inattesa.");
    }
}

document.getElementById('valutaBtn').addEventListener('click', async () => {
    const testo = document.getElementById('avvenimento').value;
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Analisi in corso...';
    resultDiv.style.color = '#fff';

    try {
        const aura = await valutaAura(testo);
        resultDiv.textContent = aura + ' Punti AURA';
        resultDiv.style.color = aura >= 0 ? '#00ff88' : '#ff5555';
    } catch (error) {
        resultDiv.textContent = `ERRORE: ${error.message}`;
        resultDiv.style.color = '#ff5555';
        console.error("Errore Frontend:", error);
    }
});
