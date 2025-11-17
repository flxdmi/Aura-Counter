export default async (req, context) => {
  try {
    const { messages } = await req.json();

    if (!messages) {
      return new Response(
        JSON.stringify({ error: "messages non presenti" }),
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    const request = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages
      })
    });

    const data = await request.json();
    return Response.json(data);

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Errore interno", details: err.message }),
      { status: 500 }
    );
  }
};
