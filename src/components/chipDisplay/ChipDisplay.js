import purple from "/chips/purple.png";
import green from "/chips/green.png";
import yellow from "/chips/yellow.png";
import brown from "/chips/brown.png";
import gray from "/chips/gray.png";
import pink from "/chips/pink.png";
import custom from "/chips/custom.png";
import "./ChipDisplay.css";
import { renderHeader, setupHeaderEvents } from "../Header.js";

const chipImages = [purple, green, yellow, brown, gray, pink, custom];
const chipData = [
  {
    src: green,
    label: "$25 Green Chip",
    material: "Clay composite (ceramic-infused), injection-molded core.",
    security: "UV edge-markings, micro-etched serial rings.",
    use: "Standard table minimum for casual and mid-stakes games.",
  },
  {
    src: yellow,
    label: "$1,000 Yellow Chip",
    material: "3-piece clay-composite with precision brass insert.",
    security: "RFID embedded, fade-proof UV detailing.",
    use: "High-stakes chip for VIP and tournament rooms.",
  },
  {
    src: purple,
    label: "$500 Purple Chip",
    material: "Casino clay blend with metal-slug core.",
    security: "Anti-counterfeit microdots, encoded edge bands.",
    use: "Used in elite mid-high stakes tables.",
  },
  {
    src: brown,
    label: "$10,000 Brown Chip",
    material: "Molded ceramic with embedded smart core.",
    security: "RFID + NFC, hologram ink layer.",
    use: "Whale-tier bets & final-table tournaments.",
  },
  {
    src: gray,
    label: "$5,000 Gray Chip",
    material: "Clay-polymer blend with textured edges.",
    security: "Embedded UV ring, QR-coded serials.",
    use: "Private rooms and high-stakes events.",
  },
  {
    src: pink,
    label: "$250,000 Pink Chip",
    material: "Premium clay composite with enhanced compression molding.",
    security:
      "RFID tag, UV-reactive ink, and nano-scale serial microdot layer.",
    use: "Used in super high-roller events and private elite rooms. Designed for visibility and prestige.",
  },
  {
    src: custom,
    label: "$1,000,000 Custom Holographic Chip",
    material: "Hybrid polymer-clay with multi-layer holographic prism film.",
    security: "Advanced RFID, lenticular holograms, DNA-traceable ink.",
    use: "Exclusive to invitation-only events. Symbol of legacy wealth and legendary play.",
  },
];

export function renderChipDisplay() {
  const container = document.querySelector("#app");
  container.innerHTML = `
  ${renderHeader()}
    <div class="chip-carousel-container">
      <div class="chip-orbit" id="chipOrbit"></div>
      <div class="chip-info-card" id="chipInfo"></div>
        <button class="chip-btn resume-btn">Resume Browsing</button>
        <button class="chip-btn cart-btn">Add to Cart</button>
         <div id="chipToast" class="chip-toast">Added to cart</div>
    </div>
  `;

  setupHeaderEvents();

  const orbit = document.getElementById("chipOrbit");
  const info = document.getElementById("chipInfo");
  const toast = document.getElementById("chipToast");
  const resumeBtn = document.querySelector(".resume-btn");
  const cartBtn = document.querySelector(".cart-btn");

  let selectedIndex = null;
  let isPaused = false;
  info.style.display = "none";

  chipData.forEach((data, i) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.style.setProperty("--angle", `${(360 / chipData.length) * i}deg`);
    chip.innerHTML = `<img src="${data.src}" alt="${data.label}" />`;

    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => {
        c.classList.remove("focused");
        c.querySelector("img")?.classList.remove("spinning");
      });

      chip.classList.add("focused");
      chip.querySelector("img").classList.add("spinning");

      selectedIndex = i;

      const anglePerChip = 360 / chipData.length;
      const rotateTo = anglePerChip * i;

      const orbitEl = document.getElementById("chipOrbit");
      orbitEl.style.animation = "none";
      orbitEl.style.transform = `rotateX(18deg) rotateY(-${rotateTo}deg)`;

      info.style.display = "block";
      info.innerHTML = `
  <h3>${data.label}</h3>
  <p><strong>Material:</strong> ${data.material}</p>
  <p><strong>Security:</strong> ${data.security}</p>
  <p><strong>Use Case:</strong> ${data.use}</p>
`;
    });

    orbit.appendChild(chip);
  });

  resumeBtn.addEventListener("click", () => {
    isPaused = false;
    document;
    document
      .querySelectorAll(".chip img")
      .forEach((img) => img.classList.remove("spinning"));
    orbit.style.animation = "orbitRotate 60s linear infinite";
    info.style.display = "none";
  });

  cartBtn.addEventListener("click", () => {
    if (selectedIndex !== null) {
      const chip = chipData[selectedIndex];
      showToast(`${chip.label} added to cart!`);
    }
  });

  function showToast(message) {
    toast.textContent = message;
    toast.style.opacity = "1";
    setTimeout(() => {
      toast.style.opacity = "0";
    }, 2000);
  }

  info.innerHTML = `
    <h3>${chipData[0].label}</h3>
    <p><strong>Material:</strong> ${chipData[0].material}</p>
    <p><strong>Security:</strong> ${chipData[0].security}</p>
    <p><strong>Use Case:</strong> ${chipData[0].use}</p>
  `;
}
