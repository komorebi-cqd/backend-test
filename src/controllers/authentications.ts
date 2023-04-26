import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { random, authentication } from '../helpers/index';

export const login = async (req: express.Request, res: express.Response) => {
    console.log(req.body)
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            return res.sendStatus(400)
        };

        console.log(user, 'user::::::')

        const expectedHash = authentication(user.authentication.salt, password);  //重新加密对比
        if (expectedHash !== user.authentication.password) {
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('BACKEND-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

        return res.status(200).json(user);

    } catch (error) {
        return res.sendStatus(400);
    }
}


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.sendStatus(400);
        }
        const salt = random();

        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password), //保存salt 进行加密  上面登录时通过password和此处保存的salt加密进行对比来进行验证
            }
        });

        return res.status(200).json(user).end();

    } catch (error) {
        return res.sendStatus(400);
    }
}

