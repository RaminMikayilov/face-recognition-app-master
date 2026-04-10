import { DRAW_OPTIONS } from '../constants/config';

export function syncCanvasSize(canvas, video) {
  const { videoWidth, videoHeight } = video;
  if (videoWidth && videoHeight) {
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  }
}

export function clearCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function drawFaceBoxes(canvas, detections) {
  const ctx = canvas.getContext('2d');
  const { boxColor, boxLineWidth, labelFont, labelColor, labelBgColor } = DRAW_OPTIONS;

  detections.forEach((det, idx) => {
    const { x, y, width, height } = det.box;
    const score = (det.score * 100).toFixed(1);
    const label = `Face ${idx + 1}  ${score}%`;

    ctx.strokeStyle = boxColor;
    ctx.lineWidth = boxLineWidth;
    ctx.strokeRect(x, y, width, height);

    ctx.font = labelFont;
    const textWidth = ctx.measureText(label).width;
    const labelHeight = 22;
    const labelY = y > labelHeight ? y - labelHeight : y + height;

    ctx.fillStyle = labelBgColor;
    ctx.fillRect(x, labelY, textWidth + 12, labelHeight);

    ctx.fillStyle = labelColor;
    ctx.fillText(label, x + 6, labelY + 15);
  });
}
