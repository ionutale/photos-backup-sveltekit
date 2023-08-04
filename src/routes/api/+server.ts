// Imports the Google Cloud client library
import { Storage } from '@google-cloud/storage';
import type { RequestHandler } from '@sveltejs/kit';

// const bucketName = 'aiu-family-media';
const bucketName = 'aiu-family-media-temp';

async function loadFileTestFile() {
  // Creates a client
  const storage = new Storage();
  // Uploads a local file to the bucket
  await storage.bucket(bucketName).upload('./README.md', {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
  });

};

loadFileTestFile().catch(console.error);

export const GET: RequestHandler = async (event) => {
  
  return new Response('Hello world!');
}