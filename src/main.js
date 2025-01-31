import { Ball, Polygon } from './models';
import { getMousePos } from './utils/utils.js';

const $ = el => document.querySelector(el);
const $canvas = $('#canvas');
const ctx = $canvas.getContext('2d');

const points = [
  { x: 100, y: 100 },
  { x: 300, y: 100 },
  { x: 500, y: 100 },
  { x: 500, y: 300 },
  { x: 300, y: 300 },
  { x: 100, y: 300 },
];

const mainBall = new Ball();
const outsideBall = new Ball({ isInside: false });

const polygon = new Polygon(points, mainBall, outsideBall);
polygon.draw();

/*
 * Event listeners
 */
$canvas.addEventListener('mousedown', mouseDown);
$canvas.addEventListener('mousemove', mouseMove);
$canvas.addEventListener('mouseup', mouseUp);

let offsetX = 0;
let offsetY = 0;

function mouseDown(e) {
  const { mouseX, mouseY } = getMousePos(e);

  [mainBall, outsideBall].forEach(ball => {
    const dx = mouseX - ball.x;
    const dy = mouseY - ball.y;

    if (Math.sqrt(dx * dx + dy * dy) <= ball.radius) {
      ball.isDragging = true;
      offsetX = dx;
      offsetY = dy;
    }
  });
}

function mouseMove(e) {
  const { mouseX, mouseY } = getMousePos(e);

  [mainBall, outsideBall].forEach(ball => {
    if (ball.isDragging) {
      ball.move(mouseX, mouseY, offsetX, offsetY);
      ctx.clearRect(0, 0, $canvas.width, $canvas.height);
      polygon.draw();
    }
  });
}

function mouseUp() {
  [mainBall, outsideBall].forEach(ball => (ball.isDragging = false));
}
