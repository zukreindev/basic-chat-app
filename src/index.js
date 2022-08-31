import { createServer } from 'http';
import { config } from 'dotenv';
import { join } from 'node:path';
import { MongoDatabase } from 'erax.db';

config({ path: join(process.cwd(), '.env') });

const db = {
    messages: new MongoDatabase({
        url: process.env.MONGO_SERVER,
        modelName: 'messages',
    }),
    users: new MongoDatabase({
        url: process.env.MONGO_SERVER,
        modelName: 'users',
    }),
};

import api from './api.js';
import wss from './wss.js';

const port = process.env.PORT || 3000;
const server = createServer(api(db));

wss(server, db);

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
