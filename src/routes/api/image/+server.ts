import { Storage } from '@google-cloud/storage';
const bucketName = 'aiu-family-media';
import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';

export const GET: RequestHandler = async (event) => {
  try {
    const fileName = event.url.searchParams.get("filename");
    // Creates a client
    const storage = new Storage();
    // Uploads a local file to the bucket
    const [file] = await storage.bucket(bucketName).file(fileName).download();

    // resize the image and convert it to avif
    const resizedImage = await sharp(file)
      .resize(200, 200)
      .avif()
      .toBuffer();
    // return the resized image
    return new Response(resizedImage, {
      headers: {
        "Content-Type": "image/avif"
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