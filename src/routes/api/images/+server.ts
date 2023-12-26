import { clamp, getFormatFromExtension } from '$lib/params-validation';
import { Storage } from '@google-cloud/storage';
import type { RequestHandler } from '@sveltejs/kit';
import sharp from 'sharp';

const bucketName = 'photos-backup-sveltekit';
const cacheBucketName = `${bucketName}-cache`;

type Options = {
  width: number;
  height: number;
  format: 'avif' | 'webp' | 'png' | 'jpeg';
  quality: number;
  cropX: number;
  cropY: number;
}

export const GET: RequestHandler = async (event) => {
  try {
    
    const fileName = event.url.searchParams.get("filename") || "default.jpg";

    const options: Options = {
      width: clamp(Number(event.url.searchParams.get("w")), 0, 20000),
      height : clamp(Number(event.url.searchParams.get("h")), 0, 20000),
      format: getFormatFromExtension(event.url.searchParams.get("fm") ?? ''),
      quality: clamp(Number(event.url.searchParams.get("q")) || 75, 0, 100),
      cropX: clamp(Number(event.url.searchParams.get("cx")) || 0, 0, 20000),
      cropY: clamp(Number(event.url.searchParams.get("cy")) || 0, 0, 20000),
    }


    // Creates a client
    const { cacheFile, contentType } = await getPhoto(fileName, options);
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

export const DELETE: RequestHandler = async (event) => {
  try {
    const fileName = event.url.searchParams.get("filename") || "default.jpg";
    const db = event.locals.db;

    // Creates a client
    const storage = new Storage();
    await storage.bucket(bucketName).file(fileName).delete().catch((e) => {
      console.error('file not found in bucket:', e.message);
    })

    console.log("deleting from db", fileName);
    await db.collection("photos").deleteOne({
      name: fileName
    }).catch((e: any) => {
      console.error('file not found in db:', e.message);
    })

    return new Response("Deleted", {
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

async function convertPhoto(file: Buffer, options: Options) {

  const sharpBuffer = sharp(file);
  const imageWidth = (await sharpBuffer.metadata()).width ?? 1;
  const imageHeight = (await sharpBuffer.metadata()).height ?? 1;

  const ratio = imageWidth / imageHeight;

  const resizedWidth = clamp(options.width, 1, imageWidth);
  const resizedHeight = clamp(options.height, 1, imageHeight);

  const cropX = clamp(options.cropX, 0, imageWidth);
  const cropY = clamp(options.cropY, 0, imageHeight);

  // if the options specify a crop, crop the image
  if (cropX > 0 || cropY > 0) {
    sharpBuffer.extract({
      left: cropX,
      top: cropY,
      width: resizedWidth,
      height: resizedHeight,
    });
  }


  // if the image is not square, resize it to fit the requested width or height
  sharpBuffer.resize(resizedWidth, resizedHeight);

  // sharpBuffer[options.format]({ quality: options.quality, force: true });
  // return sharpBuffer.toBuffer();
  switch (options.format) {
    case "avif":
      return sharpBuffer
        .avif({ quality: options.quality, force: true })
        .toBuffer();
    case "webp":
      return sharpBuffer
        .webp({ quality: options.quality, force: true })
        .toBuffer();
    case "png":
      return sharpBuffer
        .png({ quality: options.quality, force: true })
        .toBuffer();
    // ignored because typescript is a bitch
    // also everything needs to default to jpg
    // case "jpg":
    //   return sharpBuffer
    //     .jpeg({ quality: quality, force: true })
    //     .toBuffer();

    default:
      return sharpBuffer
        .jpeg({ quality: options.quality, force: true })
        .toBuffer();
  }
}

async function getPhoto(fileName: string, options: Options) {
  const storage = new Storage();
  const processedFileName = `${fileName}-${Object.entries(options)}`
  // download the processed cached image if exists
  const [cacheFile] = await storage.bucket(cacheBucketName).file(processedFileName).download().catch((e) => {
    console.error(e.message);
    return [null];
  });
  if (cacheFile) {
    // return the cached image
    return {
      cacheFile,
      contentType: `image/${options.format}`
    }
  }

  // Downloads the master image from bucket
  const [file] = await storage.bucket(bucketName).file(fileName).download();
  // resize the image and convert it to the requested format
  const resizedImage = await convertPhoto(file, options);

  // save the resized image to the cache bucket
  await storage.bucket(cacheBucketName).file(processedFileName).save(resizedImage).catch((e) => {
    console.error("error saving the image to the cache bucket", e);
  })

  return {
    cacheFile: resizedImage,
    contentType: `image/${options.format}`
  }
}