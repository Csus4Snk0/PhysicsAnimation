export function stepEuler(
  f: (x: number, y: number[]) => number[],
  x: number,
  y: number[],
  dx: number,
): number[] {
  const dydx = f(x, y)

  return y.map((yi, i) => yi + dx * dydx[i])
}


export function stepRK4(
  f: (x: number, y: number[]) => number[],
  x: number,
  y: number[],
  dx: number,
): number[] {
  const k1 = f(x, y)
  const k2 = f(x+0.5*dx, addScaled(y, k1, 0.5*dx))
  const k3 = f(x+0.5*dx, addScaled(y, k2, 0.5*dx))
  const k4 = f(x+dx,     addScaled(y, k3, dx))
  return y.map((yi, i) => yi + (1/6)*dx * (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]))
}


export function integrate(
  f: (x: number, y: number[]) => number[],
  x: number[],
  y0: number[],
  stepper = stepRK4,
): number[][] {
  const Y: number[][] = [y0]

  for (let i = 0; i < x.length - 1; i++) {
    const dx = x[i + 1] - x[i]
    const yi = Y[i]
    const yi1 = stepper(f, x[i], yi, dx)
    Y.push(yi1)
  }

  return Y
}

function addScaled(
  y: number[],
  v: number[],
  scale: number,
): number[] {
  return y.map((yi, i) => yi + scale * v[i])
}
