export interface Ball {
  id: string;

  x: number;
  y: number;
  radius: 15;

  color: string;

  colorFrom: string;
  colorTo: string;

  vx: number;
  vy: number;
}

export function getNextPosition(ball: Ball): Ball {
  return {
    ...ball,
    x: ball.x + ball.vx,
    y: ball.y + ball.vy,
  };
}

export function getVelocityVector(angle: number): { vx: number; vy: number; } {
  const vx = Math.cos(angle);
  const vy = Math.sin(angle);

  return {
    vx: vx * 6,
    vy: vy * 6,
  };
}

export function getAngle(ball: Ball): number {
  return Math.atan2(ball.vy, ball.vx);
}

export function getDistance(ball1: Ball, ball2: Ball): number {
  return Math.sqrt(
    Math.pow(ball1.x - ball2.x, 2) + Math.pow(ball1.y - ball2.y, 2)
  );
}

export function getCollisionAngle(ball1: Ball, ball2: Ball): number {
  return Math.atan2(ball2.y - ball1.y, ball2.x - ball1.x);
}

export function areColliding(ball1: Ball, ball2: Ball): boolean {
  return getDistance(ball1, ball2) <= ball1.radius + ball2.radius;
}

export function isCollidingWithWall(ball: Ball, width: number, height: number): boolean {
  return ball.x - ball.radius <= 0 ||
    ball.x + ball.radius >= width ||
    ball.y - ball.radius <= 0 ||
    ball.y + ball.radius >= height;
}

export function getNextColor(ball: Ball): Ball {
  const { color, colorFrom, colorTo } = ball;

  const colorFromHex = colorFrom.replace("#", "");
  const colorToHex = colorTo.replace("#", "");
  const colorHex = color.replace("#", "");

  const colorFromR = parseInt(colorFromHex.substr(0, 2), 16);
  const colorFromG = parseInt(colorFromHex.substr(2, 2), 16);
  const colorFromB = parseInt(colorFromHex.substr(4, 2), 16);

  const colorToR = parseInt(colorToHex.substr(0, 2), 16);
  const colorToG = parseInt(colorToHex.substr(2, 2), 16);
  const colorToB = parseInt(colorToHex.substr(4, 2), 16);

  const colorR = parseInt(colorHex.substr(0, 2), 16);
  const colorG = parseInt(colorHex.substr(2, 2), 16);
  const colorB = parseInt(colorHex.substr(4, 2), 16);

  const stepSize = 1;

  const nextColorR = colorR + (colorR < colorToR ? stepSize : -stepSize);
  const nextColorG = colorG + (colorG < colorToG ? stepSize : -stepSize);
  const nextColorB = colorB + (colorB < colorToB ? stepSize : -stepSize);

  const nextColor = `#${nextColorR.toString(16).padStart(2, "0")}${nextColorG.toString(16).padStart(2, "0")}${nextColorB.toString(16).padStart(2, "0")}`;

  const shouldReverseDirection = Math.random() < 0.005;

  return {
    ...ball,
    color: nextColor,
    colorFrom: shouldReverseDirection ? colorTo : colorFrom,
    colorTo: shouldReverseDirection ? colorFrom : colorTo,
  };
}