import { ctx } from './ctx.js';

/*
 * Función para calcular el ángulo y la distancia entre dos puntos
 */
function calculateAngle(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const angle = Math.atan2(dy, dx);
  const distance = Math.sqrt(dx * dx + dy * dy);

  return {
    angle,
    distance,
  };
}

/*
 * Función para calcular la intersección entre dos líneas
 */
function getLineIntersection(p1, p2, p3, p4) {
  const s1_x = p2.x - p1.x;
  const s1_y = p2.y - p1.y;
  const s2_x = p4.x - p3.x;
  const s2_y = p4.y - p3.y;

  const s = (-s1_y * (p1.x - p3.x) + s1_x * (p1.y - p3.y)) / (-s2_x * s1_y + s1_x * s2_y);
  const t = (s2_x * (p1.y - p3.y) - s2_y * (p1.x - p3.x)) / (-s2_x * s1_y + s1_x * s2_y);

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    return {
      x: p1.x + t * s1_x,
      y: p1.y + t * s1_y,
    };
  }

  return null;
}

/**
 * Calculates the endpoints of a line given two points and their respective radii.
 */
function calculateLineEndpoints(p1, p2) {
  const lineWidth = ctx.lineWidth;

  const { angle } = calculateAngle(p1.x, p1.y, p2.x, p2.y);
  const offset = (radius, lineWidth) => (radius ? radius + lineWidth / 2 : 1);

  const startX = p1.x + Math.cos(angle) * offset(10, lineWidth);
  const startY = p1.y + Math.sin(angle) * offset(10, lineWidth);

  const endX = p2.x - Math.cos(angle) * offset(10, lineWidth);
  const endY = p2.y - Math.sin(angle) * offset(10, lineWidth);

  return { startX, startY, endX, endY };
}

/*
 * Función para pintar una línea desde un punto a otro
 */
function paintLine(p1, p2) {
  const { startX, startY, endX, endY } = calculateLineEndpoints(p1, p2);

  ctx.beginPath();
  ctx.setLineDash([1, 4]);
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.closePath();
}

/*
 * Función para pintar un circulo
 */
function paintCircle(point, radius = 4, color = 'orange') {
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}

/**
 * Draws guide lines and a circle at the endpoint on the canvas.
 */
function paintGuideLines(p1, p2, position) {
  ctx.beginPath();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';

  const { startX, startY, endX, endY } = calculateLineEndpoints(p1, p2);
  const L1 = position === 'START' ? { x: startX, y: startY } : { ...p1 };
  const L2 = position === 'FINAL' ? { x: endX, y: endY } : { ...p2 };

  ctx.lineTo(L1.x, L1.y);
  ctx.lineTo(L2.x, L2.y);

  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.arc(p2.x, p2.y, 10, 0, Math.PI * 2, 1);
  ctx.stroke();
  ctx.closePath();
}

/**
 * Scales a polygon by a given number of pixels.
 */
function scalePolygon(vP = [], pixels, increase = false) {
  const cX = (vP[0].x + vP[2].x) / 2;
  const cY = (vP[0].y + vP[2].y) / 2;

  const newPoints = vP.map(point => {
    let nX = point.x;
    let nY = point.y;

    if (increase) {
      point.x < cX ? (nX = point.x - pixels) : (nX = point.x + pixels);
      point.y < cY ? (nY = point.y - pixels) : (nY = point.y + pixels);
    } else {
      point.x < cX ? (nX = point.x + pixels) : (nX = point.x - pixels);
      point.y < cY ? (nY = point.y + pixels) : (nY = point.y - pixels);
    }

    return { x: nX, y: nY };
  });

  return newPoints;
}

/**
 * Gets the mouse position relative to the canvas.

 */
function getMousePos(event) {
  const $canvas = document.querySelector('#canvas');
  const rect = $canvas.getBoundingClientRect();

  return {
    mouseX: event.clientX - rect.left,
    mouseY: event.clientY - rect.top,
  };
}

export { calculateAngle, getLineIntersection, getMousePos, paintCircle, paintGuideLines, paintLine, scalePolygon };
