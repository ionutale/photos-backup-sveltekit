import type { PageServerLoad } from './$types';
import type { ObjectId } from "mongodb";

export interface Photo {
  _id?: ObjectId | string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}


export const load: PageServerLoad = async ({ locals }) => {

  const db = locals.db;
  const collection = db.collection("photos");
  const photos = await collection.find({}).toArray() as Photo[];

  return {
    photos: photos.map((photo: Photo) => {
      return {
        ...photo,
        _id: photo?._id?.toString() || "no-id"
      }
    })
  };
};
