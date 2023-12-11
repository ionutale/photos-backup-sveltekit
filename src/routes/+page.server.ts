import type { PageServerLoad } from './$types';
import type { ObjectId } from "mongodb";

export interface Photo {
  _id?: ObjectId | string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export const load: PageServerLoad = async ({ locals, cookies }) => {

  const user = JSON.parse(cookies.get('user') || "{}");
  const db = locals.db;
  const collection = db.collection("photos");
  const photos = await collection.find({
    uid: user?.uid || "no-uid"
  }).toArray() as Photo[];

  return {
    photos: photos.map((photo: Photo) => {
      return {
        ...photo,
        _id: photo?._id?.toString() || "no-id"
      }
    })
  };
};
