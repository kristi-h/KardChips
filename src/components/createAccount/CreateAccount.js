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
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5) * 1.2,
    dy: (Math.random() - 0.5) * 1.2,
    hue: Math.floor(Math.random() * 60) + 180,
    history: [],
  }));

  let mouse = { x: null, y: null };

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > width) p.dx *= -1;
      if (p.y < 0 || p.y > height) p.dy *= -1;

      p.history.push({ x: p.x, y: p.y });
      if (p.history.length > 6) p.history.shift();

      const distanceToMouse =
        mouse.x !== null ? Math.hypot(mouse.x - p.x, mouse.y - p.y) : Infinity;

      if (distanceToMouse < 100) {
        for (let i = 0; i < p.history.length; i++) {
          const point = p.history[i];
          const intensity = (i + 1) / p.history.length;
          const radius = p.r * intensity;
          const color = `hsl(${p.hue}, 100%, ${60 + 20 * intensity}%)`;

          ctx.beginPath();
          ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.shadowBlur = 10 * intensity;
          ctx.shadowColor = color;
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${p.hue}, 100%, 40%)`;
        ctx.fill();
      }
    }

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });
}
