import { Router } from 'express';
import Snowflake from '../utils/Snowflake.js';
import IDGenerator from '../utils/IDGenerator.js';

/**
 * Router for authentication
 * @param {import("../../types/IDatabase").default} db
 */
export default function AuthRouter(db) {
    const router = Router();

    router.post('/login', async (req, res) => {
        const data = req.body;

        if (!data || typeof data !== 'object' || !data.name || !data.pass) {
            return res.json({
                error: 'Invalid name or password was provided',
            });
        }

        const user = (await db.users.valueArray()).find((user) => user.name === data.name);

        if (!user) {
            return res.json({
                error: 'Invalid name was provided',
            });
        }

        if (data.pass !== user.password) {
            return res.json({
                error: 'Invalid password was provided',
            });
        }

        return res.json({
            token: user.token,
        });
    });

    router.post('/register', async (req, res) => {
        const data = req.body;

        if (!data || typeof data !== 'object' || !data.name || !data.pass) {
            return res.json({
                error: 'Invalid name or password was provided',
            });
        }

        if (typeof data.name !== 'string') {
            return res.json({
                error: 'Invalid name was provided',
            });
        }

        if (data.name.length < 3) {
            return res.json({
                error: 'This name too short',
            });
        }

        if (data.name.length > 24) {
            return res.json({
                error: 'This name too long',
            });
        }

        const user = (await db.users.valueArray()).find((user) => user.name === data.name);

        if (user) {
            return res.json({
                error: 'This name is already taken',
            });
        }

        if (typeof data.pass !== 'string') {
            return res.json({
                error: 'Invalid password was provided',
            });
        }

        if (data.pass.length < 8) {
            return res.json({
                error: 'This password too short',
            });
        }

        if (data.pass.length > 48) {
            return res.json({
                error: 'This password too long',
            });
        }

        const resolved = {
            id: Snowflake.generate(),
            name: data.name,
            password: data.pass,
            createdTimestamp: Date.now(),
            token: IDGenerator(48),
        };

        await db.users.set(resolved.id, resolved);

        return res.json(resolved);
    });

    return router;
}
