import { Router } from 'express';

/**
 * Router for app users
 * @param {import("../../types/IDatabase").default} db
 */
export default function UsersRouter(db) {
    const router = Router();

    router.get('/:id?', async (req, res) => {
        const token = req.headers.authorization;

        if (!req.params.id && !token) {
            return res.json({
                error: 'Invalid id was provided',
            });
        }

        let user;

        if (token) {
            user = (await db.users.valueArray()).find((user) => user.token === token);
        } else {
            user = await db.users.get(req.params.id);

            user &&= {
                id: user.id,
                name: user.name,
                createdAt: user.createdAt,
            };
        }

        user ??= {
            error: 'User not found',
        };

        res.json(user);
    });

    return router;
}
