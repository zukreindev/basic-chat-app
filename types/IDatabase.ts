import type { MongoDatabase } from 'erax.db';

import IUser from './IUser';
import IMessage from './IMessage';

export default interface IDatabase {
    messages: MongoDatabase<IMessage>;
    users: MongoDatabase<IUser>;
}
