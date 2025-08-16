export function ToRelativePx(px, root = document.documentElement) {
  const fontSizePx = Number.parseInt(getComputedStyle(root).fontSize);
  return (fontSizePx / 16) * px;
}
