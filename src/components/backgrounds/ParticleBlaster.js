export function initParticleBlaster(canvas, ctx, external = {}) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5 + 0.5,
    dx: (Math.random() - 0.5) * 0.6,
    dy: (Math.random() - 0.5) * 0.6,
    color: `hsl(${Math.random() * 40 + 180}, 100%, 70%)`,
  }));

  const ripples = [];
  const blasters = [];

  const drones = [];
  const maxDrones = 10;
  const usedPositions = new Set();

  function spawnDrone() {
    if (!external.createDrone || drones.length >= maxDrones) return;

    let x, y;
    let tries = 0;
    do {
      x = Math.floor(Math.random() * (canvas.width - 120));
      y = Math.floor(Math.random() * (canvas.height * 0.4));
      tries++;
    } while (usedPositions.has(`${x},${y}`) && tries < 10);

    usedPositions.add(`${x},${y}`);

    const drone = external.createDrone(canvas, ctx);
    drone.vehicle.x = x;
    drone.vehicle.y = y;

    drones.push(drone);
  }

  const droneSpawner = setInterval(() => {
    spawnDrone();
    if (drones.length >= maxDrones) clearInterval(droneSpawner);
  }, 1500);

  canvas.addEventListener("mousemove", (e) => {
    ripples.push({ x: e.clientX, y: e.clientY, radius: 0, alpha: 1 });
  });

  canvas.addEventListener("click", (e) => {
    blasters.push({ x: e.clientX, y: e.clientY, radius: 5, speed: 6 });
  });

  function drawParticles() {
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();
      ctx.closePath();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
  }

  function drawRipples() {
    ripples.forEach((r, i) => {
      const gradient = ctx.createRadialGradient(
        r.x,
        r.y,
        0,
        r.x,
        r.y,
        r.radius
      );
      gradient.addColorStop(0, `rgba(0, 255, 255, ${r.alpha})`);
      gradient.addColorStop(0.4, `rgba(138, 43, 226, ${r.alpha * 0.8})`);
      gradient.addColorStop(0.7, `rgba(255, 0, 255, ${r.alpha * 0.3})`);
      gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.fill();

      r.radius += 2.5;
      r.alpha -= 0.02;
      if (r.alpha <= 0) ripples.splice(i, 1);
    });
  }

  function drawBlasters() {
    blasters.forEach((b, i) => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#00ffff";
      ctx.shadowColor = "#00ffff";
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.closePath();
      b.y -= b.speed;

      if (b.y < 0) blasters.splice(i, 1);

      drones.forEach((d) => {
        const v = d.vehicle;
        if (
          v.alive &&
          b.x > v.x &&
          b.x < v.x + v.width &&
          b.y > v.y &&
          b.y < v.y + v.height
        ) {
          v.alive = false;
          blasters.splice(i, 1);
          for (let j = 0; j < 20; j++) {
            ripples.push({
              x: v.x + v.width / 2,
              y: v.y + v.height / 2,
              radius: 0,
              alpha: 1,
            });
          }
          setTimeout(() => {
            v.x = canvas.width + Math.random() * 300;
            v.y = Math.random() * canvas.height * 0.5;
            v.alive = true;
          }, 1500);
        }
      });
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawParticles();
    drawRipples();
    drawBlasters();
    drones.forEach((d) => d.draw());
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
