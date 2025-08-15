import node_fs from 'node:fs/promises';
import node_path from 'node:path';
export async function DeleteFile(path) {
  await node_fs.unlink(path);
}
export async function ReadFile(path) {
  return await node_fs.readFile(path, { encoding: 'utf8' });
}
export async function WriteFile(path, text) {
  await node_fs.writeFile(path, text, { encoding: 'utf8' });
}
export async function CreateDirectory(path, isFile = false) {
  if (isFile === true) {
    await node_fs.mkdir(node_path.dirname(path), { recursive: true });
  } else {
    await node_fs.mkdir(path, { recursive: true });
  }
}
export async function DeleteDirectory(path) {
  await node_fs.rm(path, { recursive: true, force: true });
}
