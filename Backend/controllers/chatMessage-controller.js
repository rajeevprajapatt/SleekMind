import User from "../models/user.js";
import ChatMessage from "../models/chat-message.js";
import * as messageService from "../services/message-service.js";

export const getAllChatMessages = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const allMessages = await messageService.allProjectMessages(projectId);
        return res.status(201).json(allMessages);

    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
}
export const getMessage = async (req, res) => {
    const { fileId, fileName, content } = req.body;


    try {
        const msg = await ChatMessage.findOneAndUpdate(
            { fileId },
            {
                $set: { [`message.fileTree.${fileName}.content`]: content }
            },
            { new: true } 
        );
        console.log("message aaya", msg);
        console.log("yha tak chal gya")
        if (!msg) {
            return res.status(404).json({ error: "File not found in fileTree" });
        }
        console.log("hello get message");
        return res.status(200).json(msg);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
