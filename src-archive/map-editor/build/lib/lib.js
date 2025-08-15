export function $use(value, fn) {
  return fn(value);
}
export function $ifexists(value, fn) {
  if (value !== null && value !== undefined) fn(value);
}
export function $exists(value) {
  return value !== null && value !== undefined;
}
