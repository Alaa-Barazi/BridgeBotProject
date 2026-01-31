/**
 * storageService (Firebase Storage)
 *
 * Thin wrapper around Firebase Storage for uploading and deleting files.
 * Used mainly for week materials and project documents that are stored
 * as files rather than base64 blobs in RTDB.
 *
 * Responsibilities:
 * - Upload a file to a specific storage path
 * - Return a public download URL after upload
 * - Delete a file by its storage path
 *
 * Notes:
 * - Caller is responsible for choosing a safe and unique storage path
 * - Authentication and Storage Rules must allow the operation
 * - This service does NOT handle metadata or database records
 */

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
