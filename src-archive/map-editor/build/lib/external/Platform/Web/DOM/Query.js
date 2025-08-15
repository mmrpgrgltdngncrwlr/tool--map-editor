const tagNameToElementReferenceMap = new Map();
export function GetElementReference(tagName) {
  const ref = tagNameToElementReferenceMap.get(tagName) || document.createElement(tagName).constructor;
  if (!tagNameToElementReferenceMap.has(tagName)) {
    tagNameToElementReferenceMap.set(tagName, ref);
  }
  return ref;
}
export function $(tagName, selector, root = document.documentElement) {
  const element = root.querySelector(selector);
  if (element instanceof GetElementReference(tagName)) {
    return element;
  }
  throw `Query: \`${selector}\`. Element not of type: \`${tagName}\`. ${element}`;
}
export function $$(tagName, selector, root = document.documentElement) {
  const elements = [...root.querySelectorAll(selector)];
  for (const element of elements) {
    if (!(element instanceof GetElementReference(tagName))) {
      throw `Query: \`${selector}\`. Element not of type: \`${tagName}\`. ${element}`;
    }
  }
  return elements;
}
export function $$$(tagName, selector, root = document.documentElement) {
  const elements = $$(tagName, selector, root);
  if ('matches' in root && Matches(tagName, selector, root)) {
    elements.push(root);
  }
  return elements;
}
export function QuerySelectorEx(selector, root = document.documentElement) {
  const elements = [...root.querySelectorAll(selector)];
  if (root.matches?.(selector)) {
    elements.push(root);
  }
  return elements;
}
export function Matches(tagName, selector, element) {
  return element instanceof GetElementReference(tagName) && element.matches(selector);
}
