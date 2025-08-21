// src/lib/ericchase/Core_Console_Error.ts
function Core_Console_Error(...items) {
  console['error'](...items);
}

// src/lib/ericchase/WebPlatform_DOM_ReadyState_Callback.ts
async function Async_WebPlatform_DOM_ReadyState_Callback(config) {
  async function DOMContentLoaded() {
    removeEventListener('DOMContentLoaded', DOMContentLoaded);
    await config.DOMContentLoaded?.();
  }
  async function load() {
    removeEventListener('load', load);
    await config.load?.();
  }
  switch (document.readyState) {
    case 'loading':
      if (config.DOMContentLoaded !== undefined) {
        addEventListener('DOMContentLoaded', DOMContentLoaded);
      }
      if (config.load !== undefined) {
        addEventListener('load', load);
      }
      break;
    case 'interactive':
      await config.DOMContentLoaded?.();
      if (config.load !== undefined) {
        addEventListener('load', load);
      }
      break;
    case 'complete':
      await config.DOMContentLoaded?.();
      await config.load?.();
      break;
  }
}

// src/lib/ericchase/WebPlatform_Node_Reference_Class.ts
class Class_WebPlatform_Node_Reference_Class {
  node;
  constructor(node) {
    this.node = node;
  }
  as(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
    throw new TypeError(`Reference node ${this.node} is not ${constructor_ref}`);
  }
  is(constructor_ref) {
    return this.node instanceof constructor_ref;
  }
  passAs(constructor_ref, fn) {
    if (this.node instanceof constructor_ref) {
      fn(this.node);
    }
  }
  tryAs(constructor_ref) {
    if (this.node instanceof constructor_ref) {
      return this.node;
    }
  }
  get classList() {
    return this.as(HTMLElement).classList;
  }
  get className() {
    return this.as(HTMLElement).className;
  }
  get style() {
    return this.as(HTMLElement).style;
  }
  getAttribute(qualifiedName) {
    return this.as(HTMLElement).getAttribute(qualifiedName);
  }
  setAttribute(qualifiedName, value) {
    this.as(HTMLElement).setAttribute(qualifiedName, value);
  }
  getStyleProperty(property) {
    return this.as(HTMLElement).style.getPropertyValue(property);
  }
  setStyleProperty(property, value, priority) {
    this.as(HTMLElement).style.setProperty(property, value, priority);
  }
}
function WebPlatform_Node_Reference_Class(node) {
  return new Class_WebPlatform_Node_Reference_Class(node);
}
function WebPlatform_Node_QuerySelector(selector) {
  return WebPlatform_Node_Reference_Class(document.querySelector(selector));
}

// src/lib/ClientMutex.ts
var DATABASE_NAME = 'ClientMutex';
var STORE_NAME = 'lock';
async function Async_AcquireClientMutex() {
  const database = await new Promise((resolve, reject) => {
    const open_request = indexedDB.open(DATABASE_NAME, 1);
    open_request.onupgradeneeded = () => {
      return open_request.result.createObjectStore(STORE_NAME);
    };
    open_request.onsuccess = () => {
      if (open_request.result instanceof IDBDatabase) {
        resolve(open_request.result);
      } else {
        reject(new Error(`Failed to open the "${DATABASE_NAME}" IndexedDB database.`));
      }
    };
    open_request.onerror = () => {
      return reject(open_request.error);
    };
  });
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(Date.now(), STORE_NAME);
    transaction.oncomplete = () => {
      return resolve({
        release: () => {
          return new Promise((resolve2, reject2) => {
            const transaction2 = database.transaction(STORE_NAME, 'readwrite');
            transaction2.objectStore(STORE_NAME).delete(STORE_NAME);
            transaction2.oncomplete = () => {
              return resolve2();
            };
            transaction2.onerror = () => {
              return reject2(transaction2.error ?? new Error(`Failed to acquire the "${DATABASE_NAME}" lock.`));
            };
          });
        },
      });
    };
    transaction.onerror = () => {
      return reject(transaction.error ?? new Error(`Failed to acquire the "${DATABASE_NAME}" lock.`));
    };
  });
}

// src/lib/TokenAPI.ts
async function Async_MutexFetch(request_fn, response_cb) {
  const { release } = await Async_AcquireClientMutex();
  await response_cb(await request_fn());
  await release();
}
async function Async_UnpairAllClientsFromServer() {
  return await fetch(`${window.location.origin}/api/authentication/unpair`, {
    method: 'POST',
  });
}

// src/authenticated/index.module.ts
var button_unpair = WebPlatform_Node_Reference_Class(document.getElementById('unpair')).as(HTMLButtonElement);
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
  } catch (error) {
    Core_Console_Error(error);
  }
}
var mapWidth = 8;
var mapHeight = 8;
var tileSize = 32;
var canvas = WebPlatform_Node_QuerySelector('#editorCanvas').as(HTMLCanvasElement);
canvas.width = mapWidth * tileSize;
canvas.height = mapHeight * tileSize;
var ctx = canvas.getContext('2d');

class Tile {}
var grid = new Map();
for (let x = 0; x < mapWidth; x++) {
  for (let y = 0; y < mapHeight; y++) {
    grid.set(`${x * tileSize},${y * tileSize}`, null);
  }
}
var dirtImage = new Image();
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
  panel;
  isDragging = false;
  offsetX = 0;
  offsetY = 0;
  static topZIndex = 1000;
  constructor(width, height) {
    this.panel = document.createElement('div');
    this.panel.className = 'floatingPanel';
    this.panel.style.width = `${width}px`;
    this.panel.style.height = `${height}px`;
    this.enableDragging();
    document.body.appendChild(this.panel);
  }
  enableDragging() {
    this.panel.addEventListener('mousedown', (e) => {
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
}
var panel = new FloatingPanel(300, 200);
var panel2 = new FloatingPanel(300, 200);
