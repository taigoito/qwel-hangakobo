/**
 * Artwork
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Artwork {

  constructor() {
    this._elem = document.getElementById('artwork');
    if (!this._elem) return;

    this._fetch();

  }


  async _fetch() {
    const res = await fetch('/data/themes/hangakobo/js/artworks.json');
    const items = await res.json();

    this._setArtwork(items);

  }


  _setArtwork(items) {
    const r = 99; // サンプル[私の住むまち] 
    const img = this._elem.querySelector('img');
    const caption = this._elem.querySelector('figcaption');

    const src = `/data/uploads/${items[r].name}s.png`;
    img.setAttribute('src', src);
    caption.textContent = items[r].title;

  }

}
