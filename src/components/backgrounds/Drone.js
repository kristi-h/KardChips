export function initDrone(canvas) {
  const vehicleImg = new Image();
  vehicleImg.src = "/drone2.png";

  return {
    img: vehicleImg,
    x: canvas.width,
    y: 100,
    width: 120,
    height: 90,
    speed: 2,
    alive: true,
  };
}
