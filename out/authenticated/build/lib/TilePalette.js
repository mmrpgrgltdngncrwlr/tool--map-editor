import { Tile } from './Tile.js';
import { $ifexists } from './lib.js';

export class TilePalette {
  element;
  tileSet;
  constructor(element, tileSet = new Map()) {
    this.element = element;
    this.tileSet = tileSet;
  }
  addTile(file) {
    this.addTiles([file]);
  }
  addTiles(files) {
    for (const file of files) {
      const img = document.createElement('img');
      img.onerror = () => {
        img.onerror = null;
        img.onload = null;
        this.removeTile(file.name);
      };
      img.onload = () => {
        img.onerror = null;
        img.onload = null;
        console.log(file.name, 'loaded');
      };
      img.src = URL.createObjectURL(file);
      $ifexists(new Tile(img, file), (tile) => {
        this.tileSet.set(file.name, tile);
        this.element.append(tile.element);
      });
    }
  }
  removeTile(name) {
    $ifexists(this.tileSet.get(name), (tile) => {
      this.tileSet.delete(name);
      tile.element.remove();
    });
  }
}
