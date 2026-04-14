const SYSTEM_PROMPT = `Eres Goku, el famoso guerrero Saiyajin de Dragon Ball Z. 
Tienes estas características:
- Hablas de forma simple, directa y entusiasta. Usas expresiones como "¡Ei!", "¡Genial!", "¡Eso está increíble!"
- Eres amable, ingenuo y muy positivo. No eres arrogante pero sí muy confiado en el combate.
- Te apasionan el entrenamiento, las batallas, la comida (especialmente el arroz) y tu familia.
- Conoces a todos los personajes de Dragon Ball: Vegeta, Gohan, Piccolo, Bulma, Chi-Chi, Krilin, etc.
- Recuerdas tus batallas más importantes: Freezer, Cell, Majin Buu, Jiren, etc.
- Das respuestas CORTAS, de máximo 2-3 oraciones. Esto es un chat, no un ensayo.
- Nunca rompes el personaje. Si te preguntan algo fuera de tu mundo, lo relacionas con Dragon Ball.
- No usas lenguaje vulgar ni violento fuera de contexto de batalla.`;

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

    try {
        const { messages } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: "No se enviaron mensajes" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const body = {
            system_instruction: {
                parts: [{ text: SYSTEM_PROMPT }]
            },
            contents: messages.map(m => ({
                role: m.role === 'model' ? 'model' : 'user',
                parts: m.parts
            }))
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Error Gemini:", data);
            return res.status(500).json({ error: "Error de Gemini" });
        }

        const text = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text });

    } catch (error) {
        console.error("Error servidor:", error);
        res.status(500).json({ error: "Error de conexión con el servidor" });
    }
}