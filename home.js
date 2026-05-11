const canvas = document.getElementById("signalCanvas");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !reduceMotion) {
  const ctx = canvas.getContext("2d");
  const stage = canvas.parentElement;
  let width = 0;
  let height = 0;
  let time = 0;
  let mouseX = 0.5;
  let mouseY = 0.5;

  const paths = [
    [[0.04, 0.18], [0.2, 0.18], [0.2, 0.34], [0.42, 0.34], [0.42, 0.18], [0.68, 0.18]],
    [[0.12, 0.78], [0.32, 0.78], [0.32, 0.62], [0.55, 0.62], [0.55, 0.78], [0.9, 0.78]],
    [[0.72, 0.08], [0.72, 0.34], [0.86, 0.34], [0.86, 0.58], [0.98, 0.58]],
    [[0.02, 0.5], [0.16, 0.5], [0.16, 0.58], [0.3, 0.58], [0.3, 0.46], [0.48, 0.46]],
    [[0.48, 0.92], [0.48, 0.72], [0.66, 0.72], [0.66, 0.52], [0.8, 0.52]],
    [[0.06, 0.08], [0.06, 0.28], [0.14, 0.28], [0.14, 0.42], [0.26, 0.42]],
    [[0.58, 0.08], [0.58, 0.28], [0.5, 0.28], [0.5, 0.54], [0.36, 0.54]],
    [[0.18, 0.92], [0.18, 0.7], [0.08, 0.7], [0.08, 0.62], [0.24, 0.62]],
    [[0.82, 0.9], [0.82, 0.7], [0.94, 0.7], [0.94, 0.42], [0.76, 0.42]],
  ];

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const point = ([x, y]) => [
    x * width + (mouseX - 0.5) * 12,
    y * height + (mouseY - 0.5) * 10,
  ];

  const drawPath = (path, index) => {
    const pts = path.map(point);
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (const [x, y] of pts.slice(1)) ctx.lineTo(x, y);
    ctx.strokeStyle = "rgba(24, 61, 107, 0.16)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    for (const [x, y] of pts) {
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(24, 61, 107, 0.18)";
      ctx.fill();
    }

    const segment = (time * 0.001 + index * 0.18) % 1;
    const travel = Math.floor(segment * (pts.length - 1));
    const local = segment * (pts.length - 1) - travel;
    const a = pts[travel];
    const b = pts[Math.min(travel + 1, pts.length - 1)];
    const x = a[0] + (b[0] - a[0]) * local;
    const y = a[1] + (b[1] - a[1]) * local;

    ctx.beginPath();
    ctx.arc(x, y, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(24, 61, 107, 0.58)";
    ctx.fill();
  };

  const draw = (now) => {
    time = now;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(231, 241, 251, 0.46)";
    ctx.fillRect(0, 0, width, height);
    paths.forEach(drawPath);
    requestAnimationFrame(draw);
  };

  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    mouseX = (event.clientX - rect.left) / rect.width;
    mouseY = (event.clientY - rect.top) / rect.height;
  });

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
}
