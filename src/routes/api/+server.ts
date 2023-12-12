// Imports the Google Cloud client library
import { Storage } from '@google-cloud/storage';
import type { RequestHandler } from '@sveltejs/kit';
import type { Photo } from '../+page.server';

const bucketName = 'photos-backup-sveltekit';

async function loadFileTestFile() {
	// Creates a client
	const storage = new Storage();
	// Uploads a local file to the bucket
	await storage.bucket(bucketName).upload('./README.md', {
		// Support for HTTP requests made with `Accept-Encoding: gzip`
		gzip: true
	});
}

loadFileTestFile().catch(console.error);

export const GET: RequestHandler = async (event) => {
	const user = JSON.parse(event.cookies.get('user') || '{}');
	const db = event.locals.db;
	const collection = db.collection('photos');
	const photos = (await collection
		.find({
			uid: user?.uid || 'no-uid'
		})
		.toArray()) as Photo[];

	const mappedPhotos = photos.map((photo: Photo) => {
		return {
			...photo,
			_id: photo?._id?.toString() || 'no-id'
		};
	});

  return new Response(JSON.stringify(mappedPhotos), {
    headers: {
      'Content-Type': 'application/json'
    },
    status: 200
  });
};
