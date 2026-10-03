// Pure deterministic particle generator for React 19 compliance

export function createDeterministicPositions(
  count: number,
  scaleX: number,
  scaleY: number,
  scaleZ: number,
  seed = 42
): Float32Array {
  const pos = new Float32Array(count * 3);
  let s = seed;
  const next = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  for (let i = 0; i < count * 3; i += 3) {
    pos[i] = (next() - 0.5) * scaleX;
    pos[i + 1] = (next() - 0.5) * scaleY;
    pos[i + 2] = (next() - 0.5) * scaleZ;
  }
  return pos;
}

export function createDeterministicOrbitalPositions(
  count: number,
  minRadius: number,
  maxRadius: number,
  seed = 88
): Float32Array {
  const pos = new Float32Array(count * 3);
  let s = seed;
  const next = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  for (let i = 0; i < count * 3; i += 3) {
    const radius = minRadius + next() * (maxRadius - minRadius);
    const theta = next() * Math.PI * 2;
    const phi = (next() - 0.5) * Math.PI;
    pos[i] = radius * Math.cos(theta) * Math.cos(phi);
    pos[i + 1] = radius * Math.sin(phi);
    pos[i + 2] = radius * Math.sin(theta) * Math.cos(phi);
  }
  return pos;
}

export function createDeterministicOffsets(count: number, seed = 55): Float32Array {
  const arr = new Float32Array(count);
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = (s * 9301 + 49297) % 233280;
    arr[i] = s / 233280;
  }
  return arr;
}
