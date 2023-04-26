import { isAuthd, isOwner } from './../middlewares/index';
import express from 'express';
import { getAllUsers, deleteUser, updateUser } from '../controllers/users'

export default (router: express.Router) => {
    router.get('/users', isAuthd, getAllUsers);
    router.delete('/users/:id', isAuthd, isOwner, deleteUser);
    router.patch('/users/:id', isAuthd, isOwner, updateUser);

}