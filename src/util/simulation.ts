import { Ball, areColliding, getNextColor, getNextPosition, isCollidingWithWall } from "./ball";
import { getRandomBall } from "./random";

export function runSimulation() {
  const rect = document.querySelector('main')!.getBoundingClientRect();
  let balls = getInitialBalls(rect);

  const canvas = document.querySelector('canvas')! as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const fps = 35;

  const interval = setInterval(() => {
    ctx.clearRect(0, 0, rect.width, rect.height);

    balls.forEach((ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
      ctx.fillStyle = ball.color;
      ctx.fill();
    });

    balls = getNextBalls(balls, rect);
  }, Math.floor(1000 / fps));

  return () => clearInterval(interval);
}

export function getInitialBalls(rect: DOMRect): Ball[] {
  const minLength = 4;
  const maxLength = 140;

  let length = maxLength;

  const stepsToReduceLength = 20;
  let step = 0;

  while (true) {
    const proposed = Array.from({ length }, () => getRandomBall(rect));
    const areBallsInWall = proposed.some((ball) => {
      return isCollidingWithWall(ball, rect.width, rect.height);
    });
    const areBallsColliding = proposed.some((ball1, i) => {
      return proposed.some((ball2, j) => {
        return i !== j && areColliding(ball1, ball2);
      });
    });

    if (!areBallsInWall && !areBallsColliding) {
      return proposed;
    }

    step++;

    if (step === stepsToReduceLength) {
      length = Math.max(length - 1, minLength);
      step = 0;
    }
  }
}

export function getNextBalls(balls: Ball[], rect: DOMRect): Ball[] {
  const proposedNextBalls = balls.map((ball) => {
    const nextPosition = getNextPosition(ball);
    if (isCollidingWithWall(nextPosition, rect.width, rect.height)) {
      if (nextPosition.y - ball.radius <= 0) {
        return {
          ...ball,
          y: ball.radius + 1,
          vy: -ball.vy,
        };
      } else if (nextPosition.y + ball.radius >= rect.height) {
        return {
          ...ball,
          y: rect.height - ball.radius - 1,
          vy: -ball.vy,
        };
      } else if (nextPosition.x - ball.radius <= 0) {
        return {
          ...ball,
          x: ball.radius + 1,
          vx: -ball.vx,
        };
      } else {
        return {
          ...ball,
          x: rect.width - ball.radius - 1,
          vx: -ball.vx,
        };
      }
    }

    return nextPosition;
  });

  // check for collisions
  for (let i = 0; i < proposedNextBalls.length; i++) {
    for (let j = i + 1; j < proposedNextBalls.length; j++) {
      const ball1 = proposedNextBalls[i];
      const ball2 = proposedNextBalls[j];

      if (!areColliding(ball1, ball2)) continue;

      let ball1_next = { ...ball1, vx: -ball1.vx, vy: -ball1.vy };
      let ball2_next = { ...ball2, vx: -ball2.vx, vy: -ball2.vy };

      let count = 0;
      while (areColliding(ball1_next, ball2_next)) {
        ball1_next = getNextPosition(ball1_next);
        ball2_next = getNextPosition(ball2_next);

        count++;

        if (count > 200) {
          break;
        }
      }

      proposedNextBalls[i] = ball1_next;
      proposedNextBalls[j] = ball2_next;

      break;
    }
  }

  return proposedNextBalls.map((ball) => getNextColor(ball));
}