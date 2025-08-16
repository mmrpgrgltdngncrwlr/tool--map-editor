let resize = function () {
  inTileSize.resize();
  inGridColumns.resize();
  inGridRows.resize();
  tilemap.resize(Number.parseInt(inGridColumns.getText()), Number.parseInt(inGridRows.getText()), Number.parseInt(inTileSize.getText()));
};
import { TilePalette } from './lib/TilePalette.js';
import { fromDragTransfer, fromFileList } from './lib/browser/FileList.js';
import { preventDefault } from './lib/browser/events.js';
import { $ } from './lib/external/Platform/Web/DOM/Query.js';
const dMap = $('div', '#tile-palette');
const bUpload = $('button', '#upload-images-button');
const iUpload = $('input', '#upload-images-input');
const dTilePalette = $('div', '#tile-palette');
const tilePalette = new TilePalette(dTilePalette);
document.body.addEventListener('drop', async function (ev) {
  ev.preventDefault();
  if (ev.dataTransfer !== null) {
    tilePalette.addTiles(await fromDragTransfer(ev.dataTransfer));
  }
  console.log(tilePalette);
});
document.body.addEventListener('dragover', preventDefault);
iUpload.addEventListener('change', function (ev) {
  if (iUpload.files !== null) {
    tilePalette.addTiles(fromFileList(iUpload.files));
  }
  console.log(tilePalette);
});

class TileMap {
  element;
  tileList;
  constructor(element, tileList = []) {
    this.element = element;
    this.tileList = tileList;
  }
  resize(colsize, rowsize, tilesize) {
    const tileCount = colsize * rowsize;
    while (this.tileList.length < tileCount) {
      const img = document.createElement('img');
      this.tileList.push(img);
      img.src = './assets/ezfu3qsf.bmp';
    }
    while (this.element.childElementCount < rowsize) {
      this.addRow();
    }
    while (this.element.childElementCount > rowsize) {
      this.deleteRow();
    }
    let index = 0;
    for (let r = 0; r < rowsize; ++r) {
      for (let c = 0; c < colsize; ++c) {
        this.element.children[r].append(this.tileList[index]);
        this.tileList[index].width = tilesize;
        this.tileList[index].height = tilesize;
        ++index;
      }
    }
    while (index < this.tileList.length) {
      this.tileList[index].remove();
      ++index;
    }
  }
  addRow() {
    const div = document.createElement('DIV');
    div.classList.add('row');
    this.element.append(div);
  }
  deleteRow() {
    this.element.lastChild?.remove();
  }
}
const tilemap = new TileMap(dMap);
const inTileSize = document.querySelector('#tile-size');
const inGridColumns = document.querySelector('#grid-columns');
const inGridRows = document.querySelector('#grid-rows');
inTileSize.setText('32');
inGridColumns.setText('1');
inGridRows.setText('1');
resize();
const dSettings = $('div', '#settings');
dSettings.addEventListener('change', resize);
