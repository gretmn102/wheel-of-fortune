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
const prizes = ["$100", "$200", "$300", "$400", "$500", "$1000", "Vacation", "Car", "Free Gift", "Gift Card"];

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
    ctx.fillStyle = i % 2 === 0 ? "#FFDD00" : "#FF5733"; // Alternate colors
    ctx.fill();
    ctx.stroke();

    // Draw prize text
    ctx.save();
    ctx.rotate(angleStart + angle / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    ctx.font = "bold 18px Arial";
    ctx.fillText(prizes[i], radius - 50, 0);
    ctx.restore();
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
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
    const rotation = (randomAngle * progress) / spinDuration;

    drawWheel(ctx, rotation);

    if (progress < spinDuration) {
      requestAnimationFrame(animateSpin);
    } else {
      const prizeIndex = Math.floor((rotation % (2 * Math.PI)) / angle);
      resultText.innerText = `You won: ${prizes[prizeIndex]}`;
    }
  }

  requestAnimationFrame(animateSpin);
}

// Initialize the wheel
drawWheel(ctx, 0);

// Spin button event listener
spinBtn.addEventListener('click', () => void spinWheel(ctx));
