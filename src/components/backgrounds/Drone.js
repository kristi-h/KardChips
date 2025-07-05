export function initDrone(canvas, ctx) {
  const vehicleImg = new Image();
  vehicleImg.src = "/drone2.png";

  const trailHistory = [];

  const vehicle = {
    x: canvas.width,
    y: 100,
    width: 120,
    height: 90,
    dx: -2,
    dy: 1.2,
    alive: true,
    img: vehicleImg,
    directionTimer: 0,
  };

  function updateMovement() {
    vehicle.x += vehicle.dx;
    vehicle.y += vehicle.dy;

    if (vehicle.y < 0 || vehicle.y + vehicle.height > canvas.height) {
      vehicle.dy *= -1;
    }

    if (vehicle.x + vehicle.width < 0) vehicle.x = canvas.width;
    if (vehicle.x > canvas.width) vehicle.x = -vehicle.width;

    vehicle.directionTimer--;
    if (vehicle.directionTimer <= 0) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2;
      vehicle.dx = Math.cos(angle) * speed;
      vehicle.dy = Math.sin(angle) * speed;
      vehicle.directionTimer = 100 + Math.random() * 100;
    }
  }

  function drawThruster() {
    const flameX = vehicle.x + vehicle.width / 2;
    const flameY = vehicle.y + vehicle.height;
    const radius = 10 + Math.random() * 5;
    const gradient = ctx.createRadialGradient(
      flameX,
      flameY,
      0,
      flameX,
      flameY,
      radius
    );
    gradient.addColorStop(0, "rgba(255, 100, 0, 0.8)");
    gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(flameX, flameY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawEngineFlicker() {
    const centerX = vehicle.x + vehicle.width / 2;
    const centerY = vehicle.y + vehicle.height / 2;
    const radius = 12 + Math.random() * 6;
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, "rgba(0,255,255,0.5)");
    gradient.addColorStop(1, "rgba(0,255,255,0)");
    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawTrail() {
    trailHistory.push({ x: vehicle.x, y: vehicle.y });
    if (trailHistory.length > 10) trailHistory.shift();

    trailHistory.forEach((pos, index) => {
      const opacity = (index + 1) / trailHistory.length;
      ctx.globalAlpha = opacity * 0.4;
      ctx.drawImage(vehicle.img, pos.x, pos.y, vehicle.width, vehicle.height);
    });
    ctx.globalAlpha = 1;
  }

  function draw() {
    if (!vehicle.alive) return;
    updateMovement();
    drawTrail();
    drawThruster();
    drawEngineFlicker();
    ctx.drawImage(
      vehicle.img,
      vehicle.x,
      vehicle.y,
      vehicle.width,
      vehicle.height
    );
  }

  return { vehicle, draw };
}
