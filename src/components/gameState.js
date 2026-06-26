export const keys = {};

export const joystick = {
  x: 0,
  y: 0,
};

export const mobileState = {
  sprintEnabled: false,
};

export const cameraControls = {
  angle: 0,
  isDragging: false,
  lastX: 0,
};

export const obstacles = [
  { name: "Mountain", x: 0, z: -6, width: 4, depth: 4 },
  { name: "Tree", x: 6, z: -2, width: 1.2, depth: 1.2 },
];

export function isCollidingWithObstacle(x, z) {
  const playerRadius = 0.7;

  return obstacles.some((obstacle) => {
    const halfWidth = obstacle.width / 2 + playerRadius;
    const halfDepth = obstacle.depth / 2 + playerRadius;

    return (
      x > obstacle.x - halfWidth &&
      x < obstacle.x + halfWidth &&
      z > obstacle.z - halfDepth &&
      z < obstacle.z + halfDepth
    );
  });
}

export function clampToMap(value) {
  const mapLimit = 24;
  return Math.max(-mapLimit, Math.min(mapLimit, value));
}