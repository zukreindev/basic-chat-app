import { WebSocketServer } from 'ws';
import IDGenerator from './utils/IDGenerator.js';
import Snowflake from './utils/Snowflake.js';

/**
 *
 * @param {import("http").Server} server
 * @param {import("../types/IDatabase").default} db
 */
export default function wss(server, db) {
    /**
     *
     * @param {string} token
     */
    async function findUserByToken(token) {
        return (await db.users.valueArray()).find((user) => user.token === token);
    }

    const wss = new WebSocketServer({ server });

    wss.on('connection', (socket) => {
        socket.id = IDGenerator(192);

        socket.send(
            JSON.stringify({
                op: 1,
            }),
        );

        socket.onmessage = async ({ data }) => {
            const { op, d, t } = JSON.parse(data);

            switch (op) {
                case 2:
                    const user = await findUserByToken(d.token);

                    if (!user) {
                        socket.close(4002);
                    } else {
                        socket.token = d.token;
                        socket.user = user;

                        wss.clients.forEach((client) => {
                            if (client.id !== socket.id && client.token === socket.token) {
                                return client.close(4004);
                            }
                        });

                        const messages = await db.messages.valueArray();
                        const resolved = [];

                        for (const message of messages) {
                            const author = await db.users.get(message.author);

                            if (author) {
                                resolved.push({
                                    ...message,
                                    author: author.name,
                                    authorId: author.id,
                                    system: false,
                                });
                            }
                        }

                        socket.send(
                            JSON.stringify({
                                op: 3,
                                d: {
                                    user,
                                    messages: resolved,
                                    online: wss.clients.size,
                                },
                            }),
                        );

                        wss.clients.forEach((client) => {
                            client.send(
                                JSON.stringify({
                                    op: 4,
                                    t: 'USER_JOIN',
                                    d: { online: wss.clients.size, user: socket.user.name },
                                }),
                            );
                        });
                    }

                    break;
                case 5:
                    switch (t) {
                        case 'CREATE_MESSAGE':
                            if (d.content) {
                                const resolved = {
                                    id: Snowflake.generate(),
                                    content: d.content,
                                    author: socket.user.id,
                                    createdTimestamp: Date.now(),
                                };

                                await db.messages.set(resolved.id, resolved);

                                wss.clients.forEach((client) => {
                                    client.send(
                                        JSON.stringify({
                                            op: 4,
                                            t: 'CREATE_MESSAGE',
                                            d: {
                                                ...resolved,
                                                authorId: socket.user.id,
                                                system: false,
                                                author: socket.user.name,
                                            },
                                        }),
                                    );
                                });
                            }
                            break;
                    }

                    break;
                default:
                    socket.close(4001);
                    break;
            }
        };

        socket.onclose = () => {
            if (socket.user) {
                wss.clients.forEach((client) => {
                    client.send(
                        JSON.stringify({
                            op: 4,
                            t: 'USER_LEAVE',
                            d: { online: wss.clients.size, user: socket.user.name },
                        }),
                    );
                });
            }

            socket.terminate();
        };
    });
}
