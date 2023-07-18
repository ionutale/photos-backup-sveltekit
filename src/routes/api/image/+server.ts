import { Storage } from '@google-cloud/storage';
const bucketName = 'aiu-family-media';
const chacheBucketName = 'aiu-family-media-cache';

import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';

export const GET: RequestHandler = async (event) => {
  try {
    const fileName = event.url.searchParams.get("filename") || "default.jpg";
    const width = Number(event.url.searchParams.get("w")) || 200;
    const height = Number(event.url.searchParams.get("h")) || 200;
    const format = event.url.searchParams.get("fm") || "jpg";
    const quality = Number(event.url.searchParams.get("q")) || 75;
    // Creates a client
    const { cacheFile, contentType } = await getPhoto(fileName, width, height, format, quality);
    // return the resized image
    return new Response(cacheFile, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
      status: 200
    });
  } catch (e: any) {
    console.error(e);
    // throw e;
    return new Response(e.message, {
      status: 500
    });
  }
}

function convertPhoto(file: Buffer, width: number, height: number, format: string, quality: number) {

  const sharpBuffer = sharp(file);

  if (width > 0 && height > 0) {
    sharpBuffer.resize(width, height);
  } else if (width > 0) {
    sharpBuffer.resize(width);
  } else if (height > 0) {
    sharpBuffer.resize(null, height);
  }

  switch (format) {
    case "avif":
      return sharpBuffer
        .avif({ quality: quality, force: true })
        .toBuffer();
    case "webp":
      return sharpBuffer
        .webp({ quality: quality, force: true })
        .toBuffer();
    case "jpg":
      return sharpBuffer
        .jpeg({ quality: quality, force: true })
        .toBuffer();
    case "png":
      return sharpBuffer
        .png({ quality: quality, force: true })
        .toBuffer();

    default:
      return sharpBuffer
        .jpeg({ quality: quality, force: true })
        .toBuffer();
  }
}

async function getPhoto(fileName: string, width: number, height: number, format: string, quality: number) {
  const storage = new Storage();
  const processedFileName = `${fileName}-${width}-${height}-${format}-${quality}`;

  const [cacheFile] = await storage.bucket(chacheBucketName).file(processedFileName).download().catch((e) => {
    console.error("error requesting the image from the cache bucket", e);
    return [null];
  });
  if (cacheFile) {
    // return the cached image
    return {
      cacheFile,
      contentType: `image/${format}`
    }
  }

  // Uploads a local file to the bucket
  const [file] = await storage.bucket(bucketName).file(fileName).download();
  // resize the image and convert it to avif
  const resizedImage = await convertPhoto(file, width, height, format, quality);

  // save the resized image to the cache bucket
  await storage.bucket(chacheBucketName).file(processedFileName).save(resizedImage).catch((e) => {
    console.error("error saving the image to the cache bucket", e);
  })

  return {
    cacheFile: resizedImage,
    contentType: `image/${format}`
  }
}