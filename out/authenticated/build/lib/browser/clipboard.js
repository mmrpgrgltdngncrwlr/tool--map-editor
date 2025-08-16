export async function setClipboard(data) {
  if (window?.navigator?.clipboard) {
    try {
      await navigator.clipboard.writeText(data);
      return true;
    } catch (ignore) {}
  }
  return false;
}
export async function getClipboard() {
  if (window?.navigator?.clipboard) {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (ignore) {}
  }
  return '';
}
