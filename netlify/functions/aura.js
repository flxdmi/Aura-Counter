// ====================================================================
// netlify/functions/aura.js - LOGICA BACKEND AGGIORNATA
// ====================================================================

// Funzione Handler per Netlify che gestisce la richiesta
exports.handler = async (event) => {
    try {
        // La funzione Node.js richiede l'API key dalle variabili d'ambiente
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
             console.error("OPENAI_API_KEY non trovata nelle variabili d'ambiente.");
             return {
                statusCode: 500,
                body: JSON.stringify({ error: "Chiave API non configurata." }),
            };
        }

        // Il corpo dell'evento JSON contiene l'array 'messages' dal frontend
        const { messages } = JSON.parse(event.body);

        if (!messages) {
             return {
                statusCode: 400,
                body: JSON.stringify({ error: "Campo 'messages' mancante nella richiesta." }),
            };
        }

        // Chiamata all'API di OpenAI
        const request = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}` // Utilizzo della chiave
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Modello scelto
                messages: messages,   // Passaggio dell'array messages completo
                temperature: 0.2      // Temperatura bassa per risposte più precise e numeriche
            })
        });

        // Controlla se la risposta API è fallita (es. chiave scaduta)
        if (!request.ok) {
            const errorData = await request.json();
            console.error("Errore API OpenAI:", errorData);
            return {
                statusCode: request.status,
                body: JSON.stringify({ error: "Errore durante la comunicazione con OpenAI.", details: errorData }),
            };
        }

        const data = await request.json();

        // Restituisce la risposta grezza di OpenAI al frontend
        return {
             statusCode: 200,
             body: JSON.stringify(data)
        };

    } catch (err) {
        console.error("Errore interno del serverless function:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Errore interno del serverless function", details: err.message }),
        };
    }
};
