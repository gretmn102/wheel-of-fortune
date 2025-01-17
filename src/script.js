// @ts-check

const wheel = /** @type {HTMLCanvasElement} */ (
  document.getElementById('wheel')
);
const resultText = /** @type {HTMLElement} */ (
  document.getElementById('result')
);
const spinBtn =  /** @type {HTMLElement} */ (
  document.getElementById('spin-btn')
);

// List of prizes
const prizes = [
  "суставы",
  "поясница",
  "колени",
  "зуб",
  "голова",
  "шея",
  "спина",
  "ВСЁ СРАЗУ",
];

// Create wheel drawing
const ctx = wheel.getContext('2d');
if (!ctx) {
  throw new Error("Canvas 2d not supported");
}
const segments = prizes.length;
const angle = 2 * Math.PI / segments;
const radius = wheel.width / 2;

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
function drawTriangle(ctx, x, y, w, h) {
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, h);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} startAngle
 */
function drawWheel(ctx, startAngle) {
  ctx.clearRect(0, 0, wheel.width, wheel.height);
  ctx.translate(radius, radius);
  ctx.rotate(startAngle);

  for (let i = 0; i < segments; i++) {
    const angleStart = angle * i;
    const angleEnd = angle * (i + 1);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, angleStart, angleEnd);
    ctx.fillStyle = i % 2 === 0 ? "#ff747e" : "#ffa2a9"; // Alternate colors
    ctx.fill();
    ctx.stroke();

    // Draw prize text
    ctx.save();
    ctx.rotate(angleStart + angle / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#d03944";
    ctx.font = "400 20px 'Rubik Wet Paint'";
    ctx.fillText(prizes[i], radius / 2 + 15, 0, 300);
    ctx.restore();
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations

  const [w, h] = [30, 20];

  drawTriangle(ctx, radius + radius - w, radius - h / 2, w, h)
}

/**
 * @param {number} x
 */
function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}

/**
 * @param {CanvasRenderingContext2D} ctx
 */
function spinWheel(ctx) {
  const randomAngle = Math.random() * 2 * Math.PI + 2 * Math.PI * 3; // Random rotation angle
  const spinDuration = 3000; // Duration of the spin in ms

  let startTime;

  function animateSpin(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const rotation = randomAngle * easeOutQuad(progress / spinDuration);

    drawWheel(ctx, rotation);

    if (progress < spinDuration) {
      requestAnimationFrame(animateSpin);
    } else {
      const prizeIndex = (segments - 1) - Math.floor((rotation % (2 * Math.PI)) / angle);
      resultText.innerText = `You won: ${prizes[prizeIndex]}`;
    }
  }

  requestAnimationFrame(animateSpin);
}

// Initialize the wheel
drawWheel(ctx, 0);

// Spin button event listener
spinBtn.addEventListener('click', () => void spinWheel(ctx));
