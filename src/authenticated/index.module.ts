import { Core_Console_Error } from '../lib/ericchase/Core_Console_Error.js';
import { Async_WebPlatform_DOM_ReadyState_Callback } from '../lib/ericchase/WebPlatform_DOM_ReadyState_Callback.js';
import { WebPlatform_Node_QuerySelector, WebPlatform_Node_Reference_Class } from '../lib/ericchase/WebPlatform_Node_Reference_Class.js';
import { Async_MutexFetch, Async_UnpairAllClientsFromServer } from '../lib/TokenAPI.js';

const button_unpair = WebPlatform_Node_Reference_Class(document.getElementById('unpair')).as(HTMLButtonElement);

await Async_WebPlatform_DOM_ReadyState_Callback({
  async load() {
    button_unpair.addEventListener('click', async_unpair);
  },
});

async function async_unpair() {
  try {
    await Async_MutexFetch(
      () => Async_UnpairAllClientsFromServer(),
      async (response) => {
        switch (response.status) {
          case 200:
            window.location.href = '/';
            break;
          default:
            Core_Console_Error(await response.text());
        }
      },
    );
  } catch (error: any) {
    Core_Console_Error(error);
  }
}

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

class FloatingPanel {
  panel: HTMLDivElement;
  header: HTMLDivElement;
  minimizeButton: HTMLButtonElement;
  content: HTMLDivElement;

  isDragging = false;
  offsetX: number = 0;
  offsetY: number = 0;

  static topZIndex = 1000;

  constructor(width: number, height: number, title = '') {
    this.panel = document.createElement('div');
    this.panel.className = 'floatingPanel';

    this.panel.style.width = `${width}px`;
    this.panel.style.height = `${height}px`;

    this.header = document.createElement('div');
    this.header.className = 'panelHeader';
    this.header.style.width = `${width}px`;
    this.header.textContent = title;

    this.minimizeButton = document.createElement('button');
    this.minimizeButton.textContent = '-';
    this.minimizeButton.onclick = () => this.minimize();
    this.header.appendChild(this.minimizeButton);
    this.panel.appendChild(this.header);

    this.content = document.createElement('div');
    this.content.className = 'panelContent';
    this.content.style.height = `${height - 20}px`;
    this.content.textContent = 'Panel content';
    this.panel.appendChild(this.content);

    this.enableDragging();

    document.body.appendChild(this.panel);
  }

  enableDragging() {
    this.header.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.offsetX = e.clientX - this.panel.offsetLeft;
      this.offsetY = e.clientY - this.panel.offsetTop;

      this.panel.style.zIndex = (FloatingPanel.topZIndex++).toString();
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.panel.style.left = `${e.clientX - this.offsetX}px`;
        this.panel.style.top = `${e.clientY - this.offsetY}px`;
      }
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
  }

  minimize() {
    if (this.content.style.display === 'none') {
      this.content.style.display = 'block';
      this.panel.style.height = `${this.panel.offsetHeight + this.content.offsetHeight}px`;
      this.minimizeButton.textContent = '-';
    } else {
      this.content.style.display = 'none';
      this.panel.style.height = '20px';
      this.minimizeButton.textContent = '+';
    }
  }
}

const panel = new FloatingPanel(300, 200, 'panel one');
const panel2 = new FloatingPanel(200, 300, 'panel two');
