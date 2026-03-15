import User from "../models/user.js";
import ChatMessage from "../models/chat-message.js";
import * as messageService from "../services/message-service.js";

export const getAllChatMessages = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        console.log("Fetching messages for projectId:", projectId);

        const allMessages = await messageService.allProjectMessages(projectId);
        return res.status(201).json(allMessages);

    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
} 

export const getFileTree = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const fileTree = await ChatMessage.findOne({ _id: projectId });
        if (!fileTree) {
            return res.status(404).json({ error: "File tree not found" });
        }
        return res.status(200).json(fileTree.message.fileTree);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
}

export const getMessage = async (req, res) => {
    const { fileId } = req.query;

    console.log("Received request for getMessage with fileId:", fileId);

    if (!fileId) {
        return res.status(400).json({ error: "File ID is required" });
    }

    const message = await ChatMessage.findOne({ "message._id": fileId });
    if (!message) {
        return res.status(404).json({ error: "File not found" });
    }
    console.log("Found message for fileId:", fileId, "Message:", message);
    res.status(200).json({ content: "This is the content of the file with ID: " + fileId });
}


