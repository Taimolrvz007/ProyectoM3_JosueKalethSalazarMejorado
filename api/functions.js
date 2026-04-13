import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: "Método no permitido" });

    // Vercel leerá esto desde sus variables de entorno
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const { messages } = req.body;
        
        // Mantenemos el historial para no perder el contexto [cite: 14, 78, 118]
        const chat = model.startChat({
            history: messages.slice(0, -1),
        });

        const lastMessage = messages[messages.length - 1].parts[0].text;
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        
        res.status(200).json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ error: "Error de conexión con el servidor" });
    }
}