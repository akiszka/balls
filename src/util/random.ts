import { Ball } from "./ball";

const color = () => {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return `#${hex.padStart(6, "0")}`;
};

const splitColor = (color: string) => {
  const colorHex = color.replace("#", "");
  const r = parseInt(colorHex.substr(0, 2), 16);
  const g = parseInt(colorHex.substr(2, 2), 16);
  const b = parseInt(colorHex.substr(4, 2), 16);
  return { r, g, b };
};

const colorDistance = (color1: string, color2: string) => {
  const { r: r1, g: g1, b: b1 } = splitColor(color1);
  const { r: r2, g: g2, b: b2 } = splitColor(color2);

  const dr = Math.abs(r1 - r2);
  const dg = Math.abs(g1 - g2);
  const db = Math.abs(b1 - b2);

  return dr + dg + db;
};

export function getRandomBall(rect: DOMRect): Ball {
  // vx^2 + vy^2 = 36
  // and vx is between -6 and 6
  const vx = Math.floor(Math.random() * 12) - 6;
  const vy = Math.sqrt(36 - vx * vx);

  const radius = 15;

  const max_x = rect.width - radius - radius;
  const max_y = rect.height - radius - radius;
  const min_x = radius * 2;
  const min_y = radius * 2;

  const x = Math.floor(Math.random() * (max_x - min_x)) + min_x;
  const y = Math.floor(Math.random() * (max_y - min_y)) + min_y;

  let colorFrom = color();
  let colorTo = color();

  while (colorDistance(colorFrom, colorTo) < 200) {
    colorTo = color();
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    x,
    y,
    radius,
    colorFrom,
    colorTo,
    color: colorFrom,
    vx,
    vy,
  };
}