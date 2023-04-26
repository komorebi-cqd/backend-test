import express from 'express';
import { getUsers, deleteUserById, updateUserById, getUserById } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    } catch (error) {
        res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.sendStatus(400);
        }
        const deletedUser =await deleteUserById(id);
        return res.json(deletedUser);
    } catch (error) {
        res.sendStatus(400);
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        console.log(id,username,'删除：：：：：')
        if (!id || !username) {
            return res.sendStatus(400);
        };
        console.log(id,username,'删除：：：：：')

        const user = await getUserById(id);
        console.log(id,username,'删除：：：：：',user)

        if (!user) {
            return  res.sendStatus(400);
        };

        user.username = username;

        await user.save();

        return res.status(200).json(user).end();

    } catch (error) {
        res.sendStatus(400);
    }
}