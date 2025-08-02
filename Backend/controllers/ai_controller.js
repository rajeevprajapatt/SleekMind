import * as ai from "../services/ai_service.js";

export const generateResult = async (req, res) => {
    try {
        const { prompt } = req.query;
        const result = await ai.generateResult(prompt);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error.message });   
    }
}