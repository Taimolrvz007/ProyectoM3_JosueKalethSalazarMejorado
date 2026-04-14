import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        systemInstruction: SYSTEM_PROMPT
    });

    try {
        const { messages } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: "No se enviaron mensajes" });
        }

        const chat = model.startChat({
            history: messages.slice(0, -1),
        });

        const lastMessage = messages[messages.length - 1].parts[0].text;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;

        res.status(200).json({ text: response.text() });
    } catch (error) {
        console.error("Error Gemini:", error);
        res.status(500).json({ error: "Error de conexión con el servidor" });
    }
}