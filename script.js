const wheel = document.getElementById('wheel');
const resultText = document.getElementById('result');
const spinBtn = document.getElementById('spin-btn');

// List of prizes
const prizes = ["$100", "$200", "$300", "$400", "$500", "$1000", "Vacation", "Car", "Free Gift", "Gift Card"];

// Create wheel drawing
const ctx = wheel.getContext('2d');
const segments = prizes.length;
const angle = 2 * Math.PI / segments;
const radius = wheel.width / 2;
const startAngle = 0;

// Function to draw the wheel
function drawWheel() {
  ctx.clearRect(0, 0, wheel.width, wheel.height);
  // ctx.translate(radius, radius);
  ctx.rotate(-startAngle); // Rotate the wheel to the starting position

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

// Function to spin the wheel
function spinWheel() {
  const randomAngle = Math.random() * 2 * Math.PI + 2 * Math.PI * 3; // Random rotation angle
  const spinDuration = 3000; // Duration of the spin in ms

  let startTime;

  function animateSpin(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const rotation = (randomAngle * progress) / spinDuration;

    ctx.clearRect(0, 0, wheel.width, wheel.height);
    ctx.translate(radius, radius);
    ctx.rotate(rotation);

    drawWheel();

    if (progress < spinDuration) {
      requestAnimationFrame(animateSpin);
    } else {
      const prizeIndex = Math.floor((rotation % (2 * Math.PI)) / angle);
      resultText.innerText = `You won: ${prizes[prizeIndex]}`;
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transformations
  }

  requestAnimationFrame(animateSpin);
}

// Initialize the wheel
drawWheel();

// Spin button event listener
spinBtn.addEventListener('click', spinWheel);
