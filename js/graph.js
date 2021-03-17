'use strict';

const exaggerate_points = function () {
  const polyline = $('polyline');
  const points = [...polyline.points].slice(1, -2);
  const ys = points.map(({ y }) => y);
  const y_min = Math.min(...ys);
  const y_max = Math.max(...ys);
  points.forEach((point) => {
    const deg = point.y;
    point.y = (point.y - y_min) * 80 / (y_max - y_min);
    point.y += 10;
    point.deg = deg;
  });
  return points;
}

const label_points = function (points) {
  const svg = $('svg');
  const polyline = $('polyline');
  points.forEach(({ x, y, deg }, i) => {
    const text = `<text class="label" x="${x + 5}" y="${-(y + 10)}" text-anchor="middle">${deg}°</text>`;
    svg.innerHTML += text;
  });
}

label_points(exaggerate_points());