import { fail } from '@sveltejs/kit';
import { Storage } from '@google-cloud/storage';
const bucketName = 'aiu-family-media';
import type { Db } from "mongodb";
import type { RequestEvent } from '../$types.js';

export const actions = {
  upload: async (event: RequestEvent) => {
    try {
      // console.log("uploading file, event", event);

      const formData = await event.request.formData();

      const files = formData.getAll('file');
      const username = formData.get('username');
      const uid = formData.get('uid');

      files.forEach(async (file: any) => {
        console.log({ file });
        if (
          !(file as File).name ||
          (file as File).name === 'undefined'
        ) {
          return fail(400, {
            error: true,
            message: 'You must provide a file to upload'
          });
        }

        // Write the file to the static folder
        await uploadPhoto(file as File);
        await saveFileMetadaDataToDb(event.locals.db, file as File, { username, uid });
      });

      return {
        success: true
      };
    } catch (error: any) {
      console.error(error);
      return fail(500, {
        error: true,
        message: error?.message || 'An unknown error occurred'
      });
    }
  }
};

async function uploadPhoto(file: File) {
  try {
    // Creates a client
    const storage = new Storage();
    // Uploads a local file to the bucket
    const fileContents = await file.arrayBuffer();
    const newBuffer = Buffer.from(fileContents);
    await storage.bucket(bucketName).file(file.name).save(
      newBuffer,
      {}).catch(console.error);
    console.log("file uploaded", file.name);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

async function saveFileMetadaDataToDb(db: Db, file: File, otherData?: any) {
  try {
    const result = await db.collection("photos").insertOne({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      webkitRelativePath: file.webkitRelativePath,
      ...otherData
    });
    console.log("file metadata saved to db", result);
  } catch (e) {
    console.error(e);
    throw e;
  }
}