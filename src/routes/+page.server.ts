import { fail } from '@sveltejs/kit';
import { Storage } from '@google-cloud/storage';
const bucketName = 'aiu-family-media';

export const actions = {
  upload: async (event) => {
    const formData = Object.fromEntries(await event.request.formData());

    if (
      !(formData.photos as File).name ||
      (formData.photos as File).name === 'undefined'
    ) {
      return fail(400, {
        error: true,
        message: 'You must provide a file to upload'
      });
    }

    const { photos } = formData as { photos: File };

    // Write the file to the static folder
    await loadFileTestFile(photos);

    return {
      success: true
    };
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
  } catch (e) {
    console.error(e);
    throw e;
  }
};

