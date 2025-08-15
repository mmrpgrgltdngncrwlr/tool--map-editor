let get_FileSystemEntries_from_DataTransferItems = function (dataTransferItemList) {
  return [...dataTransferItemList]
    .filter((item) => item.kind === 'file')
    .map(getAsEntry)
    .filter($exists);
};
import { getAsEntry } from '../external-api-guards/browser.js';
import { $exists } from '../lib.js';
export async function fromDragTransfer(dataTransfer) {
  const fileSystemEntryList = get_FileSystemEntries_from_DataTransferItems(dataTransfer.items);
  const fileList = await get_Files_from_FileSystemEntries(fileSystemEntryList);
  return fileList.length > 0 ? fileList : [...dataTransfer.files];
}
export function fromFileList(fileList) {
  return [...fileList];
}
async function get_Files_from_FileSystemEntries(fileSystemEntryList) {
  const fileEntryJobs = [];
  while (fileSystemEntryList.length > 0) {
    const directoryEntryList = [];
    const fileEntryList = [];
    for (const fileSystemEntry of fileSystemEntryList) {
      if (fileSystemEntry.isDirectory) directoryEntryList.push(fileSystemEntry);
      if (fileSystemEntry.isFile) fileEntryList.push(fileSystemEntry);
    }
    fileSystemEntryList = [];
    try {
      const promiseSettledResults = await Promise.allSettled(directoryEntryList.map(get_FileSystemEntries_from_DirectoryEntry));
      for (const result of promiseSettledResults) {
        if (result.status === 'fulfilled') {
          fileSystemEntryList.push(...result.value);
        }
      }
    } catch (ignore) {}
    for (const fileEntry of fileEntryList) {
      fileEntryJobs.push(
        new Promise((resolve, reject) => {
          fileEntry.file(
            (file) => resolve(file),
            (err) => reject(err),
          );
        }),
      );
    }
  }
  const fileList = [];
  try {
    const promiseSettledResults = await Promise.allSettled(fileEntryJobs);
    for (const result of promiseSettledResults) {
      if (result.status === 'fulfilled') {
        fileList.push(result.value);
      }
    }
  } catch (ignore) {}
  return fileList;
}
async function get_FileSystemEntries_from_DirectoryEntry(directoryEntry) {
  const fileSystemEntryList = [];
  const directoryReader = directoryEntry.createReader();
  let done = false;
  while (done === false) {
    await new Promise((resolve, reject) => {
      directoryReader.readEntries(
        (entries) => {
          if (entries.length === 0) done = true;
          else fileSystemEntryList.push(...entries);
          return resolve();
        },
        () => {
          done = true;
          return reject();
        },
      );
    });
  }
  return fileSystemEntryList;
}
