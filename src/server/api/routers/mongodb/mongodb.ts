import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { MongoClient } from 'mongodb';

const getClient = async (connectionString: string) => {
    const client = new MongoClient(connectionString);
    const connection = await client.connect();

    return connection;
};

const getDatabase = async (connectionString: string, databaseName: string) => {
    const client = await getClient(connectionString);

    if (!client) {
        throw new Error('No client');
    }

    return client.db(databaseName);
};

export const mongodbRouter = createTRPCRouter({
    getDatabaseList: publicProcedure.input(z.string()).query(async ({ input: connectionString }) => {
        try {
            const client = await getClient(connectionString);
            return client.db().admin().listDatabases();
        } catch (error) {
            console.log(error);
        }
    }),

    getCollectionList: publicProcedure
        .input(
            z.object({
                connectionString: z.string(),
                databaseName: z.string(),
            })
        )
        .query(async ({ input: { connectionString, databaseName } }) => {
            try {
                const db = await getDatabase(connectionString, databaseName);

                return db.listCollections().toArray();
            } catch (error) {
                console.log(error);
            }
        }),

    getDatabaseResults: publicProcedure
        .input(
            z.object({
                connectionString: z.string(),
                databaseName: z.string(),
                collectionName: z.string(),
            })
        )
        .query(async ({ input: { connectionString, collectionName, databaseName } }) => {
            try {
                const db = await getDatabase(connectionString, databaseName);
                const collection = db.collection(collectionName);

                return collection.find().toArray();
            } catch (error) {
                console.log(error);
            }
        }),

    getSpecificDatabaseResults: publicProcedure
        .input(
            z.object({
                connectionString: z.string(),
                databaseName: z.string(),
                collectionName: z.string(),
                filterName: z.string().optional(),
                filterValue: z.string().optional(),
            })
        )
        .mutation(async ({ input: { connectionString, collectionName, databaseName, filterName, filterValue } }) => {
            try {
                const db = await getDatabase(connectionString, databaseName);
                const collection = db.collection(collectionName);
                return collection.find({ [filterName]: filterValue }).toArray();
            } catch (error) {
                console.log(error);
            }
        }),
});

export type mongodbRouter = typeof mongodbRouter;
