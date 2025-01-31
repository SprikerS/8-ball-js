import { computeReflectionPoints, ctx, paintGuideLines, scalePolygon } from '../utils';

class Polygon {
  constructor(points, mainBall, outsideBall) {
    this.points = points;
    this.mainBall = mainBall;
    this.outsideBall = outsideBall;
    this.maxReflections = 3;

    this.bounds = this.getBounds();
    this.mainBall.setBounds(this.bounds);
    this.outsideBall.setBounds(this.bounds);
  }

  getBounds() {
    return {
      xMin: Math.min(...this.points.map(point => point.x)),
      xMax: Math.max(...this.points.map(point => point.x)),
      yMin: Math.min(...this.points.map(point => point.y)),
      yMax: Math.max(...this.points.map(point => point.y)),
      vtxs: [this.points[0], this.points[2], this.points[3], this.points[5]],
    };
  }

  path() {
    const [firstPoint, ...restPoints] = this.points;
    ctx.moveTo(firstPoint.x, firstPoint.y);
    restPoints.forEach(({ x, y }) => ctx.lineTo(x, y));
  }

  drawPolygon() {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.path();
    ctx.closePath();
    ctx.stroke();

    this.points.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  clip() {
    ctx.beginPath();
    this.path();
    ctx.closePath();
    ctx.clip();
  }

  drawLineGuide() {
    const radius = this.mainBall.radius;
    const newPoints = scalePolygon(this.bounds.vtxs, radius);

    const reflections = computeReflectionPoints(this.mainBall, this.outsideBall, newPoints, this.maxReflections);
    reflections.forEach((point, i) => {
      const { p1, p2 } = point;
      const type = i === 0 ? 'START' : i === reflections.length - 1 ? 'FINAL' : null;
      paintGuideLines(p1, p2, radius, type);
    });
  }

  drawnShape() {
    this.points.forEach(({ x, y }) => {
      const dx = this.mainBall.x - x;
      const dy = this.mainBall.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const edgeX = this.mainBall.x - (dx / distance) * this.mainBall.radius;
      const edgeY = this.mainBall.y - (dy / distance) * this.mainBall.radius;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(edgeX, edgeY);
      ctx.stroke();
      ctx.closePath();
    });
  }

  draw() {
    this.drawPolygon();
    this.mainBall.draw();
    this.outsideBall.draw();
    this.drawLineGuide();
    this.drawnShape();
  }
}

export { Polygon };
