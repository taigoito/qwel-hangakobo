/**
 * Gallery
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

import Slider from './_slider.js';

export default class Gallery {

  constructor(elem) {
    this._elem = document.getElementById('gallery');
    if (!this._elem) return;
    this._inner = this._elem.querySelector('.slider__inner');
    if (!this._inner) return;

    this._fetch();
    
  }


  async _fetch() {
    const res = await fetch('/data/themes/hangakobo/js/artworks.json');
    const items = await res.json();

    this._setGallery(items);

  }


  _setGallery(items) {
    // テンプレート取得
    const template = document.getElementById('sliderTemplate');

    // アイテム抽出
    const selected = [];
    items.forEach((item) => {
      if (item.showOnGallery) selected.unshift(item);
    });

    // アイテム生成
    selected.forEach((item) => {
      const figure = template.content.cloneNode(true);
      const img = figure.querySelector('img');
      const caption = figure.querySelector('figcaption');
      const src = `/data/uploads/${item.name}s.png`;

      img.setAttribute('src', src);
      caption.textContent = item.title;
      this._inner.appendChild(figure);

    });

    new Slider();
    
  }
  

  // ナビゲーション(.gallery__prev, .gallery__next, .gallery__nav)を設置
  _setupNavs() {
    // .gallery__prev
    this._prev = document.createElement('a');
    this._prev.classList.add('gallery__prev');
    this._prev.setAttribute('href', '#');
    const prevIcon = document.createElement('span');
    prevIcon.dataset.icon = 'ei-chevron-left';
    prevIcon.dataset.size = 'l';
    this._prev.appendChild(prevIcon);

    // .gallery__next
    this._next = document.createElement('a');
    this._next.classList.add('gallery__next');
    this._next.setAttribute('href', '#');
    const nextIcon = document.createElement('span');
    nextIcon.dataset.icon = 'ei-chevron-right';
    nextIcon.dataset.size = 'l';
    this._next.appendChild(nextIcon);

    // .gallery__nav
    //this._nav = document.createElement('ul');
    //this._nav.classList.add('gallery__nav');

    // .gallery__navItem
    //for (let i = 0; i < this._itemsCount; i++) {
    //  const li = document.createElement('li');
    //  li.classList.add('gallery__navItem');
    //  li.dataset.targetIndex = i; // data-target-indexを挿入
    //  this._nav.appendChild(li);
    //}

    this._elem.appendChild(this._prev);
    this._elem.appendChild(this._next);
    //this._elem.after(this._nav);

  }


  // アイテムが7個未満の場合に予備を連ねておく
  _setupItems() {
    while (this._items.length < 7) {
      for (let i = 0; i < this._itemsCount; i++) {
        const clone = this._items[i].cloneNode(true);
        this._inner.appendChild(clone);
      }
    }

  }


  // アイテムのアクティブ状態を管理
  _setActiveTarget() {
    // スライダー内アイテム
    if (this._inner.querySelector('.--current')) {
      this._inner.querySelector('.--current').classList.remove('--current');
    }
    this._items[this._currentIndex].classList.add('--current');
    // ナビゲーション
    if (this._nav.querySelector('.--current')) {
      this._nav.querySelector('.--current').classList.remove('--current');
    }
    this._navItems = this._nav.children;
    this._navItems[this._currentIndex % this._itemsCount].classList.add('--current');

  }


  _handleEvents() {
    // タッチデバイスの判定
    const touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
    
    // 状態
    this._x = 0;
    this._y = 0;
    this._isDragging = false;
    this._delta = 0;

    // ドラグおよびホイール操作
    if (!this._isHeader) {
      if (touchSupported) {
        this._inner.addEventListener('touchstart', (event) => {
          this._x = event.touches[0].clientX;
          this._y = event.touches[0].clientY;
          this._isDragging = true;
          this._myStartHandler();
        });

        this._inner.addEventListener('touchmove', (event) => {
          this._x = event.touches[0].clientX;
          this._y = event.touches[0].clientY;
          this._myMoveHandler();
        });

        this._inner.addEventListener('touchend', () => {
          this._myEndHandler();
          this._isDragging = false;
        });

        // touchcancelは、myEnd扱い
        this._inner.addEventListener('touchcancel', () => {
          this._myEndHandler();
          this._isDragging = false;
        });
      }

      this._inner.addEventListener('mousedown', (event) => {
        this._x = event.clientX;
        this._y = event.clientY;
        this._isDragging = true;
        this._myStartHandler();
        event.preventDefault();
      });

      this._inner.addEventListener('mousemove', (event) => {
        this._x = event.clientX;
        this._y = event.clientY;
        this._myMoveHandler();
        event.preventDefault();
      });

      this._inner.addEventListener('mouseup', () => {
        this._myEndHandler();
        this._isDragging = false;
      });

      // ポインターが外れたときは、myEnd扱い
      this._inner.addEventListener('mouseleave', () => {
        this._myEndHandler();
        this._isDragging = false;
      });

      // ホイール操作
      this._inner.addEventListener('wheel', (event) => {
        this._delta = event.deltaY;
        this._myWheelHandler();
        event.preventDefault();
      });
    }

    // img > a リンク無効化
    this._inner.querySelectorAll('.post__image > a').forEach((elem) => {
      elem.addEventListener('click', (event) => {
        event.preventDefault();
      });
    });

    // ナビゲーション操作
    this._nav.addEventListener('click', (event) => {
      const target = event.target;
      if (target.dataset.targetIndex) {
        this.move(target.dataset.targetIndex - this._currentIndex % this._itemsCount);
        this.stopInterval();
      }
    });

    // 前ボタン
    this._prev.addEventListener('click', (event) => {
      if (!this.isAnimated) this.move(-1);
      this.stopInterval();
      event.preventDefault();
    });

    // 次ボタン
    this._next.addEventListener('click', (event) => {
      if (!this.isAnimated) this.move(1);
      this.stopInterval();
      event.preventDefault();
    });

    // リサイズ
    window.addEventListener('resize', () => {
      this._windowResizeHandler();
    });

  }


  _myStartHandler() {
    // 配列をリセット
    this._dragDistance = [this._x];
    // 自動再生を止める
    this.stopInterval();

  }


  _myMoveHandler() {
    if (this._isDragging && !this.isAnimated) {
      // 配列にx座標をpushする
      this._dragDistance.push(this._x);
      const len = this._dragDistance.length;
      let distance = 0;
      // インラインスタイルを書き換える
      for (let i = 0; i < len; i++) {
        if (i > 0) {
          distance = this._dragDistance[i] - this._dragDistance[i - 1];
          this._inner.style.transform = `translateX(${this._distance + distance}px)`;
        }
      }
      this._distance += distance;
    }

  }


  _myEndHandler() {
    // フリック操作
    if (this._isDragging) {
      // 移動距離
      const distance = this._dragDistance[0] - this._dragDistance[this._dragDistance.length - 1];
      if (Math.abs(distance) > 10) { // 僅かな移動距離で、move()を頻発させない
        const len = this._items.length;
        let size = 0;
        // 移動距離とアイテムの幅から、どれだけmove()させるか計測
        if (distance < 0) {
          const w1 = this._items[(this._currentIndex - 3 + len) % len].clientWidth;
          const w2 = this._items[(this._currentIndex - 2+ len) % len].clientWidth;
          if (w1 / 3 < Math.abs(distance)) size--;
          if ((w1 * 2 + w2) / 3 < Math.abs(distance)) size--;
        } else {
          const w1 = this._items[(this._currentIndex - 4+ len) % len].clientWidth;
          const w2 = this._items[(this._currentIndex - 5+ len) % len].clientWidth;
          if (w1 / 3 < Math.abs(distance)) size++;
          if ((w1 * 2 + w2) / 3 < Math.abs(distance)) size++;
        }
        this.move(size, this._duration / 2); // 既に引っ張ってきているので、半分の時間
      }
    }

  }


  _myWheelHandler() {
    const delta = this._delta;
    if (delta < 0 && !this.isAnimated) this.move(-1);
    if (delta > 0 && !this.isAnimated) this.move(1);
    this.stopInterval();

  }


  _windowResizeHandler() {
    // 再計算
    this._inner.style.width = `${this._getInnerWidth()}px`;
    this._distance = this._getAdjustedDistance(this._currentIndex);
    this._inner.style.transform = `translateX(${this._distance}px)`;

  }


  _getInnerWidth() {
    const len = this._items.length;
    return this._elem.clientHeight / this._aspectRatio * len + this._gap * (len - 1);

  }


  _getAdjustedDistance(index) {
    const len = this._items.length;
    let result = window.innerWidth / 2;
    result -= this._items[index % len].clientWidth / 2;
    for (let i = 0; i > -3; i--) {
      let j = (index + i - 1 + len) % len;
      result -= this._items[j].clientWidth;
      result -= this._gap;
    }
    return result;

  }


  _moving(timeCurrent) {
    if (!this._timeStart) {
      this._timeStart = timeCurrent;
    }

    const timeElapsed = timeCurrent - this._timeStart;
    const next = this._easing(timeElapsed, this._start, this._flickDistance, this._currentDuration);
    this._inner.style.transform = `translateX(${next}px)`;

    timeElapsed < this._currentDuration
      ? window.requestAnimationFrame(this._moving.bind(this))
      : this._moved();

  }


  _moved() {
    this._inner.style.transform = `translateX(${this._start + this._flickDistance}px)`;
    this.timeStart = false;
    this.isAnimated = false;
    this._setActiveTarget();
    this._windowResizeHandler();

  }


  _easing(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;

  }

}
