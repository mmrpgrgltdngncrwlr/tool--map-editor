import { FloatingPanel } from '../lib/components/floating-panel.module.js';
import { WebPlatform_Node_QuerySelector, WebPlatform_Node_Reference_Class } from '../lib/ericchase/WebPlatform_Node_Reference_Class.js';
import { WebPlatform_Node_QuerySelectorAll } from '../lib/ericchase/WebPlatform_NodeList_Reference_Class.js';
import { Async_UnpairAndReload } from '../lib/TokenAPI.js';

const button_unpair = WebPlatform_Node_Reference_Class(document.getElementById('unpair')).as(HTMLButtonElement);
button_unpair.addEventListener('click', Async_UnpairAndReload);

const mapWidth = 8; // tiles
const mapHeight = 8; // tiles
const tileSize = 32; // pixels

const canvas = WebPlatform_Node_QuerySelector('#editorCanvas').as(HTMLCanvasElement);
canvas.width = mapWidth * tileSize;
canvas.height = mapHeight * tileSize;

const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

class Tile {}

const grid = new Map<string, Tile | null>();
for (let x = 0; x < mapWidth; x++) {
  for (let y = 0; y < mapHeight; y++) {
    grid.set(`${x * tileSize},${y * tileSize}`, null);
  }
}

let dirtImage = new Image();
dirtImage.src = './assets/4d5bbuxo.bmp';

canvas.onclick = (ev) => {
  let snappedX = Math.floor(ev.offsetX / tileSize) * tileSize;
  let snappedY = Math.floor(ev.offsetY / tileSize) * tileSize;
  const posKey = `${snappedX},${snappedY}`;
  let cell = grid.get(posKey);
  if (!cell) {
    grid.set(posKey, new Tile());
    ctx.drawImage(dirtImage, snappedX, snappedY, tileSize, tileSize);
  } else {
    grid.set(posKey, null);
    ctx.clearRect(snappedX, snappedY, tileSize, tileSize);
  }
};

for (const div_panel of WebPlatform_Node_QuerySelectorAll('div.floating-panel').as(HTMLDivElement)) {
  new FloatingPanel(div_panel);
}
