export function initDrone(canvas) {
  const img = new Image();
  img.src = "/drone2.png";

  const speed = 2.5;

  function randomDirection() {
    const angle = Math.random() * 2 * Math.PI;
    return {
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
    };
  }

  const direction = randomDirection();

  const vehicle = {
    x: canvas.width,
    y: 100 + Math.random() * (canvas.height / 2),
    width: 120,
    height: 90,
    dx: direction.dx,
    dy: direction.dy,
    alive: true,
    img,
    speed,
  };

  setInterval(() => {
    const newDir = randomDirection();
    vehicle.dx = newDir.dx;
    vehicle.dy = newDir.dy;
  }, 3000);

  return vehicle;
}
