import { fail } from '@sveltejs/kit';
import { Storage } from '@google-cloud/storage';
const bucketName = 'aiu-family-media';

export const actions = {
  upload: async (event) => {
    try {

      const formData = await event.request.formData();

      formData.forEach(async (photo: any, key: string) => {
        // console.log("form item", { key, photo });

        if (
          !(photo as File).name ||
          (photo as File).name === 'undefined'
        ) {
          return fail(400, {
            error: true,
            message: 'You must provide a file to upload'
          });
        }

        // Write the file to the static folder
        await loadFileTestFile(photo as File);
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

async function loadFileTestFile(file: File) {
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

