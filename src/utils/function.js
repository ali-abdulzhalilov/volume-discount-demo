export const interpolate = (points, x) => {
    let res = 0;

    for (let i = 0; i < points.length; i++) {
        let term = points[i].y;

        for (let j = 0; j < points.length; j++) {
            if (j !== i) {
                term = term * (x - points[j].x) / (points[i].x - points[j].x);
            }
        }

        res += term;
    }

    return res;
}

export const interpolateLimited = (points, x) => {
    let y = interpolate(points, x);

    const closestPointRight = Array.of(...points).reverse().find(d => d.x < x) ?? {y: 0};
    const closestPointLeft = Array.of(...points).find(d => d.x > x) ?? {y: interpolate(points, x)};

    y = Math.min(Math.max(y, closestPointRight.y), closestPointLeft.y)

    const firstPoint = points[0];
    const lastPoint = points[points.length-1];

    y = x < firstPoint.x ? 0 : (x > lastPoint.x ? lastPoint.y : y);

    return y;
};