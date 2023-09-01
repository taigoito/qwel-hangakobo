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
    const selected = [];
    items.forEach((item) => {
      if (item.showOnFront) selected.push(item);
    });

    const len = selected.length;
    const r = Math.floor(Math.random() * len);
    const img = this._elem.querySelector('img');
    const caption = this._elem.querySelector('figcaption');
    const src = `/data/uploads/${selected[r].name}s.png`;

    img.setAttribute('src', src);
    caption.textContent = selected[r].title;

  }

}
