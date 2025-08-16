export function getAsEntry(item) {
  if ('getAsEntry' in item && typeof item.getAsEntry === 'function') {
    return item.getAsEntry();
  }
  if ('webkitGetAsEntry' in item && typeof item.webkitGetAsEntry === 'function') {
    return item.webkitGetAsEntry();
  }
  return null;
}
