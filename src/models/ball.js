import { ctx } from '../utils';

class Ball {
  constructor({ x = undefined, y = undefined, radius = 20, color = 'rgba(255, 255, 255, 0.5)', isInside = true } = {}) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    this.isInside = isInside;
    this.isDragging = false;
    this.targetEdgeIndex = 0;

    this.bounds = {};
  }

  setPositionBall() {
    if (this.x !== undefined && this.y !== undefined) return;

    const { xMin, xMax, yMin, yMax } = this.bounds;

    const midY = (yMin + yMax) / 2;
    const midX = (xMin + xMax) / 2;

    const pL = { x: (xMin + midX) / 2, y: midY };
    const pR = { x: (midX + xMax) / 2, y: midY };

    this.x = this.isInside ? pL.x : pR.x;
    this.y = this.isInside ? pL.y : pR.y;
  }

  setBounds(bounds) {
    this.bounds = bounds;
    this.setPositionBall();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  move(mouseX, mouseY, offsetX, offsetY) {
    const { xMin, xMax, yMin, yMax } = this.bounds;

    const newX = mouseX - offsetX;
    const newY = mouseY - offsetY;

    const radius = this.isInside ? this.radius : -this.radius;

    this.x = Math.max(xMin + radius, Math.min(newX, xMax - radius));
    this.y = Math.max(yMin + radius, Math.min(newY, yMax - radius));
  }
}

export { Ball };
