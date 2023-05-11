import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { MongoClient } from "mongodb";

export const mongodbRouter = createTRPCRouter({
  connect: publicProcedure.input(z.object({
    connectionString: z.string(),
    databaseName: z.string(),
    collectionName: z.string(),
  })).query(async ({input: {connectionString, collectionName, databaseName}}) => {
    console.log(connectionString);

    const client = new MongoClient(connectionString);
    try {

    await client.connect();
    } catch (error) {
      console.log(error);
    }
    console.log('Connected successfully to server');
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);
    console.log(collection);

    const findResult = await collection.find({}).toArray();
    console.log('Found documents =>', findResult);
    return findResult;
  }),
});

export type mongodbRouter = typeof mongodbRouter;
