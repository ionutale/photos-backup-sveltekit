import type { Handle } from '@sveltejs/kit';
import { MONGO_URI } from '$env/static/private'
import { MongoClient } from "mongodb";
import type { Db } from "mongodb"

// Connection URI
const uri = MONGO_URI
const client = new MongoClient(uri!);

async function establishConnection(): Promise<Db> {
  try {
    console.log("Connecting to the db", uri);
    await client.connect();
    return client.db("photos-app");
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.db = await establishConnection();
  return await resolve(event);
};