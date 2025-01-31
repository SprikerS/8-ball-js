/**
 * Calculates the intersection point of two lines defined by points (p1, p2) and (p3, p4).
 */
const findLineIntersection = (p1, p2, p3, p4) => {
  const a1 = p2.y - p1.y;
  const b1 = p1.x - p2.x;
  const c1 = a1 * p1.x + b1 * p1.y;

  const a2 = p4.y - p3.y;
  const b2 = p3.x - p4.x;
  const c2 = a2 * p3.x + b2 * p3.y;

  const determinant = a1 * b2 - a2 * b1;
  if (determinant === 0) return null;

  const x = (b2 * c1 - b1 * c2) / determinant;
  const y = (a1 * c2 - a2 * c1) / determinant;

  if (
    Math.min(p1.x, p2.x) <= x &&
    x <= Math.max(p1.x, p2.x) &&
    Math.min(p1.y, p2.y) <= y &&
    y <= Math.max(p1.y, p2.y) &&
    Math.min(p3.x, p4.x) <= x &&
    x <= Math.max(p3.x, p4.x) &&
    Math.min(p3.y, p4.y) <= y &&
    y <= Math.max(p3.y, p4.y)
  ) {
    return { x, y };
  }
};

/**
 * Calculates the reflection of an incident vector off a surface with a given normal vector.
 */
const calculateReflection = (incident, normal) => {
  const dotProduct = incident.x * normal.x + incident.y * normal.y;
  return {
    x: incident.x - 2 * dotProduct * normal.x,
    y: incident.y - 2 * dotProduct * normal.y,
  };
};

/**
 * Calculates the normal vector of the line segment defined by two points.
 */
const calculateNormalVector = (p1, p2) => {
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;

  const magnitude = Math.sqrt(dx * dx + dy * dy);
  return { x: -dy / magnitude, y: dx / magnitude };
};

/**
 * Computes the reflection points of a line segment within a polygon.
 */
const computeReflectionPoints = (start, end, vertices, reflections) => {
  let rf = 0;
  let p1 = start;
  let p2 = end;

  const set = new Set();
  const points = [];

  while (rf < reflections) {
    for (let i = 0; i < vertices.length; i++) {
      if (set.size >= reflections) break;

      const v1 = vertices[i];
      const v2 = vertices[(i + 1) % vertices.length];

      const intersect = findLineIntersection(p1, p2, v1, v2);
      if (intersect && !set.has(intersect)) {
        const normal = calculateNormalVector(v1, v2);
        const incident = { x: p2.x - p1.x, y: p2.y - p1.y };
        const doReflect = calculateReflection(incident, normal);
        const reflected = { x: intersect.x + doReflect.x * 100, y: intersect.y + doReflect.y * 100 };

        set.add(intersect);
        points.push({ p1, p2: intersect });

        p1 = intersect;
        p2 = reflected;
      }
    }

    rf++;
  }

  return points;
};

export { computeReflectionPoints };
