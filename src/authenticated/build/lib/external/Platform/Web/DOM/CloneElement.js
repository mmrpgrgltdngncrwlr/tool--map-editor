export function CloneElement(
  element,
  deep = false,
  error = (element) => {
    `Failed to clone element. ${element}`;
  },
) {
  const clone = element.cloneNode(deep);
  if (clone instanceof element.constructor) {
    return clone;
  }
  throw error(element);
}
