import "../../style.css";
import "./CreateAccount.css";
import { renderHeader, setupHeaderEvents } from "../Header.js";
import cyber from "/cyber2.png";
import { initParticleBlaster } from "../backgrounds/ParticleBlaster.js";
import { initDrone } from "../backgrounds/Drone.js";

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
    const canvas = document.getElementById("particles-bg");
    const ctx = canvas.getContext("2d");

    const drone = initDrone(canvas);
    initParticleBlaster(canvas, ctx, { vehicle: drone });

    const bg = document.querySelector(".cyber-bg");
    document.addEventListener("mousemove", (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      bg.style.transform = `translate(-50%, -50%) rotateX(${y}deg) rotateY(${x}deg)`;
    });
  });
}
