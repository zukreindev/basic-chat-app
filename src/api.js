import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';

/**
 *
 * @param {import("../types/IDatabase").default} db
 */
export default function api(db) {
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use('/users', usersRouter(db));
    app.use('/auth', authRouter(db));

    app.get('/', (req, res) => {
        return res.send('OK');
    });

    app.get('*', (req, res) => {
        return res.json({ error: 'Invalid route.' });
    });

    return app;
}
