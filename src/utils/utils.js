export const update = (arr, ind, val) => [...arr.slice(0, ind), val, ...arr.slice(ind + 1, arr.length)];

export const setWithLimit = (point, lowerPoint = point, higherPoint = point) => ({
    x: Math.min(Math.max(point.x, lowerPoint.x), higherPoint.x),
    y: Math.min(Math.max(point.y, lowerPoint.y), higherPoint.y)
});

export const pointsToString = (arr) => {
    return arr.map(item => '{x:'+item.x+', y:'+item.y+'}').join(',');
};