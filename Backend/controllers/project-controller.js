import projectModel from '../models/project-model.js';
import * as projectService from '../services/project-service.js'
import User from "../models/user.js";
import { validationResult } from 'express-validator';

export const createProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;
        const loggedInUser = await User.findOne({ email: req.user.email });

        const userId = loggedInUser._id;

        console.log(userId);

        const newProject = await projectService.createProject({ name, userId });

        res.status(201).json(newProject);
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}

export const getAllProject = async (req, res) => {
    try {
        const loggedInUser = await User.findOne({
            email: req.user.email
        })

        const allProjects = await projectService.getAllProjectByUserId({ userId: loggedInUser._id })

        return res.status(200).json({ projects: allProjects })
    } catch (error) {
        console.log(err);
        res.status(400).json({ error: err.message })
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { projectId, users } = req.body;
        const loggedInUser = await User.findOne({
            email: req.user.email
        })

        const project = await projectService.addUsersToProjects({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({ project })

    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message })
    }
}

