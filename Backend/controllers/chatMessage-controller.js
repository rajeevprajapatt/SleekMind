import User from "../models/user.js";
import ChatMessage from "../models/chat-message.js";
import * as messageService from "../services/message-service.js";

export const getAllChatMessages = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const allMessages = await messageService.allProjectMessages(projectId);
        // console.log(projectId);
        return res.status(201).json(allMessages);

    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
}