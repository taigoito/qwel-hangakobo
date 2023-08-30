/**
 * Clock
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Clock {
  constructor(elem) {
    this._elem = elem || document.getElementById('clock');
    if (!this._elem) return;

    this._base = document.getElementById('clockBase');
    this._main = document.getElementById('clockMain');
    this._balloon = document.getElementById('clockBalloon');

    this._setBalloon();
    this._handleEvents();
    this._windowResizeHandler();

    setInterval(() => this.tick(), 1000);

  }


  tick() {
    const now = new Date();
    this._drawClock(now);
    this._changeTimeText(now);

  }


  _drawClock(time) {
    const ctx =  this._main.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, 240, 240);
    const hour = time.getHours() % 12;
    const min = time.getMinutes();
    const sec = time.getSeconds();
    const radH = (Math.PI * 2) / 12 * (hour + min / 60);
    const radM = (Math.PI * 2) / 60 * min;
    const radS = (Math.PI * 2) / 60 * sec;
    this._drawHand(radH, 36, 8, '#444');
    this._drawHand(radM, 48, 4, '#444');
    this._drawHand(radS, 50, 2, '#f2e4af');
    const centralGradient = ctx.createLinearGradient(117, 117, 123, 123);
    centralGradient.addColorStop(0, '#ed9');
    centralGradient.addColorStop(0.4, '#fdfaf0');
    centralGradient.addColorStop(0.6, '#fdfaf0');
    centralGradient.addColorStop(1.0, '#ed9');
    ctx.fillStyle = '#444';
    ctx.beginPath();
    ctx.arc(120, 120, 8, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = centralGradient;
    ctx.beginPath();
    ctx.arc(120, 120, 6, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

  }


  _drawHand(rotation, length, width, color) {
    const ctx =  this._main.getContext('2d');
    ctx.save();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.shadowColor = 'rgba(0, 0, 0, .3)';
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;
    ctx.translate(120, 120);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.restore();

  }


  _changeTimeText(time) {
    let meridian = time.getHours > 12;
    meridian = meridian != null ? '午後' : '午前';
    const hour = time.getHours() % 12;
    const min = time.getMinutes();
    const sec = time.getSeconds();
    const timeText = `${meridian}${hour}時${min}分${sec}秒`;
    this._balloonText.textContent = timeText;

  }


  _setBalloon() {
    this._balloonImage = document.createElement('canvas');
    this._balloonImage.id = 'balloonImage';
    this._balloonImage.width = 240;
    this._balloonImage.height = 240;
    this._balloon.appendChild(this._balloonImage);

    this._balloonText = document.createElement('p');
    this._balloonText.id = 'currentTime';
    this._balloon.appendChild(this._balloonText);
    this._drawBalloon();

  }


  _drawBalloon() {
    const ctx = this._balloonImage.getContext('2d');
    ctx.clearRect(0, 0, 240, 240);
    ctx.fillStyle = '#fff';
    ctx.save();
    ctx.translate(120, 234);
    ctx.rotate(-Math.PI / 180 * 30);
    ctx.scale(0.5, 1);
    ctx.beginPath();
    ctx.arc(0, -60, 60, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.translate(120, 234);
    ctx.scale(0.5, 1);
    ctx.beginPath();
    ctx.arc(0, -60, 60, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.scale(4, 3);
    ctx.beginPath();
    ctx.arc(30, 30, 30, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

  }


  _handleEvents() {
    window.addEventListener('resize', () => {
      this._windowResizeHandler();
    });

  }


  _windowResizeHandler() {
    const clockWidth = this._base.clientWidth / 2;
    console.log()
    this._main.style.width = `${clockWidth}px`;
    this._main.style.height = `${clockWidth}px`;

    this._balloonImage.style.width = `${this._balloon.clientWidth}px`;
    this._balloonImage.style.height = `${this._balloon.clientHeight}px`;
    
  }

}
