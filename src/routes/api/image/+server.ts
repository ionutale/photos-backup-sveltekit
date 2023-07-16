import { Storage } from '@google-cloud/storage';
const bucketName = 'aiu-family-media';
import type { RequestHandler } from '@sveltejs/kit';


export const GET: RequestHandler = async (event) => {
  try {
    const fileName = event.url.searchParams.get("filename");
    // Creates a client
    const storage = new Storage();
    // Uploads a local file to the bucket
    const [file] = await storage.bucket(bucketName).file(fileName).download();
    return new Response(file, {
      headers: {
        "Content-Type": "image/jpeg"
      }
    });
  } catch (e: any) {
    console.error("error requesting the image from google cloud storage", e.message);
    // throw e;
    return new Response(e.message, {
      status: 500
    });
  }
}