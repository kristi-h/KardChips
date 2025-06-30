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

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
