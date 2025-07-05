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

  canvas.addEventListener("mousemove", (e) => {
    ripples.push({ x: e.clientX, y: e.clientY, radius: 0, alpha: 1 });
  });

  canvas.addEventListener("click", (e) => {
    blasters.push({ x: e.clientX, y: e.clientY, radius: 5, speed: 6 });
  });

  function drawVehicle() {
    const v = external.vehicle;
    if (!v || !v.alive) return;

    ctx.drawImage(v.img, v.x, v.y, v.width, v.height);
    v.x -= v.speed;

    if (v.x + v.width < 0) {
      v.x = canvas.width + Math.random() * 300;
      v.y = Math.random() * (canvas.height / 2);
    }
  }

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

      const v = external.vehicle;
      if (
        v &&
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
          v.x = -100;
          v.y = 100 + Math.random() * 300;
          v.alive = true;
        }, 1500);
      }
    });
  }

  let pulse = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (external.vehicle && external.vehicle.draw) {
      external.vehicle.draw();
    }
    if (external.vehicle && external.vehicle.alive) {
      const v = external.vehicle;
      v.x += v.dx;
      v.y += v.dy;

      if (v.y < 0 || v.y + v.height > canvas.height) v.dy *= -1;
      if (v.x + v.width < 0) v.x = canvas.width;
      if (v.x > canvas.width) v.x = -v.width;

      const hoverOffset = Math.sin(pulse) * 2;

      const angle = Math.atan2(v.dy, v.dx) * 0.3;

      ctx.save();
      ctx.translate(v.x + v.width / 2, v.y + v.height / 2 + hoverOffset);
      ctx.rotate(angle);
      ctx.drawImage(v.img, -v.width / 2, -v.height / 2, v.width, v.height);
      ctx.restore();
    }

    drawParticles();
    drawRipples();
    drawBlasters();

    pulse += 0.1;
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
