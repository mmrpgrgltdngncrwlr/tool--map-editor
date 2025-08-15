export function OpenFile(path) {
  return Bun.file(path);
}
export async function ReadFile(file) {
  return await file.text();
}
export async function WriteFile(path, text) {
  await Bun.write(path, text);
}
export async function CopyFile(path_src, path_dest, verify = true) {
  if (path_src === path_dest) {
    return false;
  }
  const src = OpenFile(path_src);
  await Bun.write(path_dest, src);
  const dest = OpenFile(path_dest);
  if (verify === true) {
    return (await src.text()) === (await dest.text());
  }
  return true;
}
