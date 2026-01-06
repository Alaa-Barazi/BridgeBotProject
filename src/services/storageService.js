import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const storage = getStorage();

export async function uploadFileToPath(path, file) {
  const r = ref(storage, path);
  await uploadBytes(r, file);
  return await getDownloadURL(r);
}

export async function deleteFileByPath(path) {
  const r = ref(storage, path);
  await deleteObject(r);
}
