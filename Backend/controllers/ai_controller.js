import * as ai from "../services/ai_service.js";

export const generateResult = async (req, res) => {
    const maxRetries = 5;
    let delay = 1000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const { prompt } = req.query;
            const result = await ai.generateResult(prompt);
            return res.send(result);
        } catch (err) {
            if (err.status === 503 && attempt < maxRetries) {
                console.log(`Gemini overloaded, retrying in ${delay}ms...`);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2;
            } else {
                throw err;
            }
        }
    }
}