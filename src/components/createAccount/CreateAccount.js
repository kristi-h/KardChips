import "../../style.css";
import "./CreateAccount.css";
import { renderHeader, setupHeaderEvents } from "../Header.js";
import cyber from "/cyber2.png";

export function renderCreateAccount() {
  document.querySelector("#app").innerHTML = `
    ${renderHeader()}
    <div class="account-container">
      <canvas id="particles-bg"></canvas>
      <img src="${cyber}" alt="cyber" class="cyber-bg" />
      <div class="account-card">
        <h2>Create Your Account</h2>
        <form class="account-form">
          <div class="input-group">
            <input type="text" id="username" required />
            <label for="username">Username</label>
          </div>
          <div class="input-group">
            <input type="email" id="email" required />
            <label for="email">Email</label>
          </div>
          <div class="input-group">
            <input type="password" id="password" required />
            <label for="password">Password</label>
          </div>
          <div class="input-group">
            <input type="password" id="confirm" required />
            <label for="confirm">Confirm Password</label>
          </div>
          <button type="submit" class="neon-btn-wide">Create Account</button>
        </form>
      </div>
    </div>
  `;

  setupHeaderEvents();

  requestAnimationFrame(() => {
    createParticles();

    const bg = document.querySelector(".cyber-bg");
    document.addEventListener("mousemove", (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      bg.style.transform = `translate(-50%, -50%) rotateX(${y}deg) rotateY(${x}deg)`;
    });
  });
}

function createParticles() {
  const canvas = document.getElementById("particles-bg");
  const ctx = canvas.getContext("2d");
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

  let vehicle = {
    x: -100,
    y: 100 + Math.random() * 300,
    width: 60,
    height: 30,
    speed: 2 + Math.random() * 1.5,
    alive: true,
  };

  const blasters = [];

  canvas.addEventListener("click", (e) => {
    blasters.push({
      x: e.clientX,
      y: e.clientY,
      radius: 5,
      speed: 6,
    });
  });

  function addRipple(x, y) {
    ripples.push({ x, y, radius: 0, alpha: 1 });
  }

  canvas.addEventListener("mousemove", (e) => {
    addRipple(e.clientX, e.clientY);
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    if (vehicle.alive) {
      ctx.fillStyle = "#ff0080";
      ctx.shadowColor = "#ff0080";
      ctx.shadowBlur = 12;
      ctx.fillRect(vehicle.x, vehicle.y, vehicle.width, vehicle.height);
      vehicle.x += vehicle.speed;

      if (vehicle.x > canvas.width + 100) {
        vehicle.x = -100;
        vehicle.y = 100 + Math.random() * 300;
        vehicle.speed = 2 + Math.random() * 1.5;
        vehicle.alive = true;
      }
    }

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

      if (
        vehicle.alive &&
        b.x > vehicle.x &&
        b.x < vehicle.x + vehicle.width &&
        b.y > vehicle.y &&
        b.y < vehicle.y + vehicle.height
      ) {
        vehicle.alive = false;
        blasters.splice(i, 1);

        for (let j = 0; j < 20; j++) {
          ripples.push({
            x: vehicle.x + vehicle.width / 2,
            y: vehicle.y + vehicle.height / 2,
            radius: 0,
            alpha: 1,
          });
        }

        setTimeout(() => {
          vehicle.x = -100;
          vehicle.y = 100 + Math.random() * 300;
          vehicle.alive = true;
        }, 1500);
      }
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
